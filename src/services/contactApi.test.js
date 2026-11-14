import test from 'node:test'
import assert from 'node:assert/strict'
import { submitContact } from './contactApi.js'

function message() {
  const data = new FormData()
  data.set('name', 'Bahar')
  data.set('email', 'bahar@example.com')
  data.set('project', 'A new company website')
  return data
}

test('obtains CSRF before posting the original form with same-origin credentials', async () => {
  const calls = []
  const data = message()
  const fetchImpl = async (url, options) => {
    calls.push({ url, options })
    return calls.length === 1
      ? Response.json({ csrfToken: 'masked-csrf-token' })
      : Response.json({ ok: true }, { status: 201 })
  }
  await submitContact(data, { fetchImpl })
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url, '/api/csrf/')
  assert.equal(calls[0].options.cache, 'no-store')
  assert.equal(calls[1].url, '/api/contact/')
  assert.equal(calls[1].options.headers['X-CSRFToken'], 'masked-csrf-token')
  assert.equal(calls[1].options.credentials, 'same-origin')
  assert.equal(calls[1].options.body, data)
  assert.equal(calls[1].options.method, 'POST')
})

test('does not send a message when CSRF acquisition fails', async () => {
  let calls = 0
  const fetchImpl = async () => { calls++; return Response.json({ code: 'server_error' }, { status: 503 }) }
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'server_error')
  assert.equal(calls, 1)
})

test('rejects a missing CSRF token without submitting', async () => {
  let calls = 0
  const fetchImpl = async () => { calls++; return Response.json({}) }
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'invalid_response')
  assert.equal(calls, 1)
})

test('preserves validation fields and reports a failed submission', async () => {
  let calls = 0
  const fetchImpl = async () => ++calls === 1
    ? Response.json({ csrfToken: 'token' })
    : Response.json({ code: 'validation_error', errors: { email: ['invalid'] } }, { status: 400 })
  await assert.rejects(submitContact(message(), { fetchImpl }), error => {
    assert.equal(error.code, 'validation_error')
    assert.deepEqual(error.fields, { email: ['invalid'] })
    return true
  })
})

test('reports rate limiting without retrying the POST', async () => {
  let calls = 0
  const fetchImpl = async () => ++calls === 1
    ? Response.json({ csrfToken: 'token' })
    : Response.json({ code: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '60' } })
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'rate_limited')
  assert.equal(calls, 2)
})

test('handles non-JSON errors from a reverse proxy', async () => {
  const fetchImpl = async () => new Response('<h1>Bad Gateway</h1>', { status: 502 })
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'server_error')
})

test('does not treat an unexpected 200 HTML page as successful delivery', async () => {
  let calls = 0
  const fetchImpl = async () => ++calls === 1
    ? Response.json({ csrfToken: 'token' })
    : new Response('<html>SPA fallback</html>', { status: 200 })
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'invalid_response')
})

test('times out a stalled request rather than leaving the form pending', async () => {
  const fetchImpl = async (url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
  })
  await assert.rejects(submitContact(message(), { fetchImpl, timeoutMs: 5 }), error => error.code === 'timeout')
})

test('network failures are reported without automatically retrying', async () => {
  let calls = 0
  const fetchImpl = async () => { calls++; throw new TypeError('Network unavailable') }
  await assert.rejects(submitContact(message(), { fetchImpl }), error => error.code === 'network_error')
  assert.equal(calls, 1)
})

test('refuses external API endpoints before sending a CSRF token or personal data', async () => {
  for (const endpoint of ['https://outside.invalid/contact/', '//outside.invalid/contact/', '/\\outside.invalid/contact/']) {
    let calls = 0
    const fetchImpl = async () => { calls++; return Response.json({}) }
    await assert.rejects(submitContact(message(), { endpoint, fetchImpl }), error => error.code === 'invalid_endpoint')
    assert.equal(calls, 0)
  }
})
