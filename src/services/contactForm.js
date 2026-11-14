import { submitContact } from './contactApi.js'

export function bindContactForm(form, status, getCopy, {
  submit = submitContact,
  createFormData = element => new FormData(element),
  ...apiOptions
} = {}) {
  if (!form || !status) return
  let pending = false
  const button = form.querySelector('button[type="submit"]')
  const setStatus = (message, ok = false) => {
    status.textContent = message
    status.classList.toggle('notice', ok)
  }
  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (pending) return
    if (!form.checkValidity()) { form.reportValidity(); return }
    pending = true
    button.disabled = true
    const fields = Array.from(form.querySelectorAll('input, textarea')).map(field => [field, field.readOnly])
    fields.forEach(([field]) => { field.readOnly = true })
    form.setAttribute('aria-busy', 'true')
    setStatus(getCopy().formSending, true)
    try {
      await submit(createFormData(form), apiOptions)
      form.reset()
      setStatus(getCopy().formSuccess, true)
    } catch (error) {
      const copy = getCopy()
      const messages = {
        validation_error: copy.formInvalid,
        rate_limited: copy.formRateLimited,
        csrf_failed: copy.formSessionExpired,
        payload_too_large: copy.formTooLarge,
        timeout: copy.formTimeout,
      }
      setStatus(messages[error.code] || copy.formError)
      if (error.code === 'validation_error') {
        const field = Object.keys(error.fields || {}).find(name => ['name', 'email', 'project'].includes(name))
        if (field) form.elements.namedItem(field)?.focus()
      }
    } finally {
      pending = false
      button.disabled = false
      fields.forEach(([field, readOnly]) => { field.readOnly = readOnly })
      form.removeAttribute('aria-busy')
    }
  })
}
