import { getAuthMessage, getAuthNotice } from '@/lib/auth'

export default function AuthMessage({ error, notice, checkEmail }) {
  const errorMessage = getAuthMessage(error)
  const noticeMessage =
    getAuthNotice(notice) ?? (checkEmail ? getAuthNotice('check-email') : null)

  return (
    <>
      {errorMessage && (
        <p className="mb-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      {noticeMessage && (
        <p className="mb-4 rounded-md border border-border p-3 text-sm" role="status">
          {noticeMessage}
        </p>
      )}
    </>
  )
}
