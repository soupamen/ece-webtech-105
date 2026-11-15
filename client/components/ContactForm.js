'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createContact } from '@/lib/supabase'

const EMPTY = { name: '', email: '', message: '' }

// Same rules as the check constraints in the contacts migration.
function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  else if (name.trim().length > 100) errors.name = 'Name must be 100 characters or less.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errors.email = 'Enter a valid email.'
  if (message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
  else if (message.trim().length > 2000) errors.message = 'Message must be 2000 characters or less.'
  return errors
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0
  const showError = (field) => touched[field] && errors[field]

  const handleChange = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value })
  const handleBlur = (event) => setTouched({ ...touched, [event.target.name]: true })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid) return
    setStatus('sending')
    try {
      await createContact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="max-w-xl rounded-lg border border-green-600/40 bg-green-600/10 p-6">
        <p className="font-semibold">Thanks, your message was sent.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setValues(EMPTY)
            setTouched({})
            setStatus('idle')
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      <Field label="Name" name="name" error={showError('name')}>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(showError('name'))}
          aria-describedby="name-error"
        />
      </Field>

      <Field label="Email" name="email" error={showError('email')}>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(showError('email'))}
          aria-describedby="email-error"
        />
      </Field>

      <Field label="Message" name="message" error={showError('message')}>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(showError('message'))}
          aria-describedby="message-error"
          className="w-full rounded-md border-input bg-transparent text-base shadow-xs focus:border-ring focus:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
        />
      </Field>

      {status === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong, please try again.
        </p>
      )}

      <Button type="submit" disabled={!isValid || status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}

function Field({ label, name, error, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <p id={`${name}-error`} className="min-h-5 text-sm text-destructive">
        {error}
      </p>
    </div>
  )
}
