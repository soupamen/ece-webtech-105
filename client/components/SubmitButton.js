'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

// Submit button for server-action forms: disabled while pending, optional confirm prompt.
export default function SubmitButton({ children, pendingLabel, confirmMessage, disabled, ...props }) {
  const { pending } = useFormStatus()

  return (
    <Button
      {...props}
      type="submit"
      disabled={disabled || pending}
      onClick={
        confirmMessage
          ? (event) => {
              if (!window.confirm(confirmMessage)) event.preventDefault()
            }
          : undefined
      }
    >
      {pending ? (pendingLabel ?? children) : children}
    </Button>
  )
}
