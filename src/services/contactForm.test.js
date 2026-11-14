import test from 'node:test'
import assert from 'node:assert/strict'
import { bindContactForm } from './contactForm.js'
import { ContactError } from './contactApi.js'

const copy = {
  formSending: 'Sending', formSuccess: 'Saved', formError: 'Failed',
  formInvalid: 'Check the fields', formRateLimited: 'Wait before sending', formTimeout: 'Delivery unknown',
}
const settle = () => new Promise(resolve => setImmediate(resolve))

// Exercise the handler against the form's DOM contract, using Node EventTarget.
function formFixture() {
  const form = new EventTarget()
  const button = { disabled: false }
  const fields = [{ readOnly: false }, { readOnly: true }]
  const attrs = new Map()
  const focused = []
  let resets = 0
  const formData = new FormData()
  formData.set('project', 'Keep this draft when a request fails')
  Object.assign(form, {
    checkValidity: () => true,
    reportValidity: () => {},
    querySelector: () => button,
    querySelectorAll: () => fields,
    setAttribute: (name, value) => attrs.set(name, value),
    removeAttribute: name => attrs.delete(name),
    reset: () => { resets++ },
    elements: { namedItem: name => ({ focus: () => focused.push(name) }) },
  })
  const status = { textContent: '', classList: { toggle: () => {} } }
  return { form, button, fields, attrs, status, focused, formData, resets: () => resets }
}

test('ignores duplicate submits while pending, then resets only after confirmed success', async () => {
  const f = formFixture()
  let complete
  let calls = 0
  bindContactForm(f.form, f.status, () => copy, {
    createFormData: () => f.formData,
    submit: () => { calls++; return new Promise(resolve => { complete = resolve }) },
  })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  assert.equal(calls, 1)
  assert.equal(f.button.disabled, true)
  assert.equal(f.attrs.get('aria-busy'), 'true')
  assert.equal(f.resets(), 0)
  complete({ ok: true })
  await settle()
  assert.equal(f.resets(), 1)
  assert.equal(f.status.textContent, 'Saved')
  assert.equal(f.button.disabled, false)
  assert.equal(f.attrs.has('aria-busy'), false)
})

test('keeps the draft and restores the button after a failed request', async () => {
  const f = formFixture()
  bindContactForm(f.form, f.status, () => copy, {
    createFormData: () => f.formData,
    submit: async () => { throw new ContactError('network_error') },
  })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  await settle()
  assert.equal(f.resets(), 0)
  assert.equal(f.status.textContent, 'Failed')
  assert.equal(f.button.disabled, false)
})

test('shows validation feedback and focuses the field rejected by the server', async () => {
  const f = formFixture()
  bindContactForm(f.form, f.status, () => copy, {
    createFormData: () => f.formData,
    submit: async () => { throw new ContactError('validation_error', { email: ['invalid'] }) },
  })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  await settle()
  assert.equal(f.status.textContent, 'Check the fields')
  assert.deepEqual(f.focused, ['email'])
  assert.equal(f.resets(), 0)
})

test('uses the current language when a response arrives after switching languages', async () => {
  const f = formFixture()
  let current = copy
  let complete
  bindContactForm(f.form, f.status, () => current, {
    createFormData: () => f.formData,
    submit: () => new Promise(resolve => { complete = resolve }),
  })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  current = { ...copy, formSuccess: 'پیامتان ارسال شد' }
  complete({ ok: true })
  await settle()
  assert.equal(f.status.textContent, 'پیامتان ارسال شد')
})

test('native-invalid form is not submitted', async () => {
  const f = formFixture()
  f.form.checkValidity = () => false
  let calls = 0
  bindContactForm(f.form, f.status, () => copy, { submit: async () => { calls++ } })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  await settle()
  assert.equal(calls, 0)
  assert.equal(f.button.disabled, false)
})


test('locks draft fields while sending and restores their original editability', async () => {
  const f = formFixture()
  let complete
  bindContactForm(f.form, f.status, () => copy, {
    createFormData: () => f.formData,
    submit: () => new Promise(resolve => { complete = resolve }),
  })
  f.form.dispatchEvent(new Event('submit', { cancelable: true }))
  assert.equal(f.fields[0].readOnly, true)
  assert.equal(f.fields[1].readOnly, true)
  complete({ ok: true })
  await settle()
  assert.equal(f.fields[0].readOnly, false)
  assert.equal(f.fields[1].readOnly, true)
})
