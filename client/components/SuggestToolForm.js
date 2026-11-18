'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateToolSubmission } from '@/lib/moderation'

const EMPTY = {
  name: '',
  alternative_to: '',
  category_id: '',
  description: '',
  github_repo: '',
  website_url: '',
}

const fieldClass =
  'w-full rounded-md border-input bg-transparent text-base shadow-xs focus:border-ring focus:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30'

// Per-field messages for the rules enforced by validateToolSubmission.
function getErrors(values) {
  const errors = {}
  const name = values.name.trim()
  const alternativeTo = values.alternative_to.trim()
  const description = values.description.trim()
  const githubRepo = values.github_repo.trim()
  const websiteUrl = values.website_url.trim()

  if (!name) errors.name = 'Tool name is required.'
  else if (name.length > 80) errors.name = 'Tool name must be 80 characters or less.'
  if (!alternativeTo) errors.alternative_to = 'Tell us what this tool replaces.'
  else if (alternativeTo.length > 100) errors.alternative_to = 'Must be 100 characters or less.'
  if (!values.category_id) errors.category_id = 'Choose a category.'
  if (!description) errors.description = 'Description is required.'
  else if (description.length > 500) errors.description = 'Description must be 500 characters or less.'
  if (githubRepo && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(githubRepo))
    errors.github_repo = 'Use the owner/repository format.'
  if (websiteUrl && !websiteUrl.startsWith('https://'))
    errors.website_url = 'Use a secure https:// link.'
  return errors
}

export default function SuggestToolForm({ categories, action }) {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})

  const errors = getErrors(values)
  // The shared validator is the source of truth; the server action re-runs it.
  const isValid =
    validateToolSubmission({
      name: values.name,
      alternativeTo: values.alternative_to,
      description: values.description,
      categoryId: values.category_id,
      githubRepo: values.github_repo,
      websiteUrl: values.website_url,
    }) !== null
  const showError = (field) => (touched[field] ? errors[field] : undefined)

  const handleChange = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value })
  const handleBlur = (event) => setTouched({ ...touched, [event.target.name]: true })
  const inputProps = (field, id) => ({
    id,
    name: field,
    value: values[field],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(showError(field)),
    'aria-describedby': `${id}-error`,
  })

  return (
    <form action={action} noValidate className="grid gap-4">
      <Field label="Tool name" id="tool-name" error={showError('name')}>
        <Input {...inputProps('name', 'tool-name')} />
      </Field>

      <Field label="Alternative to" id="alternative-to" error={showError('alternative_to')}>
        <Input {...inputProps('alternative_to', 'alternative-to')} />
      </Field>

      <Field label="Category" id="tool-category" error={showError('category_id')}>
        <select {...inputProps('category_id', 'tool-category')} className={`${fieldClass} bg-background`}>
          <option value="" disabled>
            Choose a category
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" id="tool-description" error={showError('description')}>
        <textarea {...inputProps('description', 'tool-description')} rows={4} className={fieldClass} />
      </Field>

      <Field label="GitHub repository" id="github-repo" error={showError('github_repo')}>
        <Input {...inputProps('github_repo', 'github-repo')} placeholder="owner/repository" />
      </Field>

      <Field label="Official website" id="website-url" error={showError('website_url')}>
        <Input {...inputProps('website_url', 'website-url')} type="url" placeholder="https://example.com" />
      </Field>

      <p className="text-sm text-muted-foreground">
        Suggestions are private until reviewed. Submitting a suggestion does
        not automatically add it to the public catalogue.
      </p>
      <div>
        <SubmitButton disabled={!isValid} />
      </div>
    </form>
  )
}

// useFormStatus only reads the pending state from inside the form.
function SubmitButton({ disabled }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? 'Sending...' : 'Send suggestion'}
    </Button>
  )
}

function Field({ label, id, error, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-5 text-sm text-destructive">
        {error}
      </p>
    </div>
  )
}
