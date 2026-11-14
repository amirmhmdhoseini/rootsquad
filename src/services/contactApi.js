export class ContactError extends Error {
  constructor(code, fields = {}) {
    super(code)
    this.name = 'ContactError'
    this.code = code
    this.fields = fields
  }
}

async function readResponse(response) {
  let body
  try { body = await response.json() } catch { body = null }
  if (!response.ok) {
    const fallback = response.status === 429 ? 'rate_limited'
      : response.status === 413 ? 'payload_too_large'
        : response.status === 403 ? 'csrf_failed' : 'server_error'
    throw new ContactError(body?.code || fallback, body?.errors || {})
  }
  return body
}

export async function submitContact(data, {
  endpoint = '/api/contact/',
  csrfEndpoint = '/api/csrf/',
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
} = {}) {
  // Internal API paths only: never transmit personal data or CSRF tokens off-site.
  if (![endpoint, csrfEndpoint].every(path => typeof path === 'string' && /^\/api\/[a-zA-Z0-9/_-]+\/$/.test(path))) {
    throw new ContactError('invalid_endpoint')
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const options = { credentials: 'same-origin', mode: 'same-origin', redirect: 'error', signal: controller.signal }
  try {
    const csrfResponse = await fetchImpl(csrfEndpoint, { ...options, cache: 'no-store', headers: { Accept: 'application/json' } })
    const csrf = await readResponse(csrfResponse)
    if (typeof csrf?.csrfToken !== 'string' || !csrf.csrfToken) throw new ContactError('invalid_response')
    const response = await fetchImpl(endpoint, {
      ...options, method: 'POST', body: data,
      headers: { Accept: 'application/json', 'X-CSRFToken': csrf.csrfToken },
    })
    const result = await readResponse(response)
    if (response.status !== 201 || result?.ok !== true) throw new ContactError('invalid_response')
    return result
  } catch (error) {
    if (error instanceof ContactError) throw error
    throw new ContactError(controller.signal.aborted ? 'timeout' : 'network_error')
  } finally {
    clearTimeout(timer)
  }
}
