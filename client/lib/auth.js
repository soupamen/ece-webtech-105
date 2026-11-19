export function getSafeReturnPath(path, fallback = '/profile') {
  if (
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.startsWith('/\\') ||
    path.includes('\\')
  ) {
    return fallback
  }

  return path
}

export function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}

export function getAuthMessage(error) {
  const messages = {
    'invalid-input': 'Enter a valid email address and a password of at least 8 characters.',
    'password-mismatch': 'The passwords do not match.',
    credentials: 'The email or password is incorrect.',
    signup: 'We could not create the account. Check the details and try again.',
    callback: 'The confirmation link is invalid or has expired. Please sign in again.',
    'sign-out': 'We could not sign you out. Please try again.',
  }

  return typeof error === 'string' ? messages[error] ?? null : null
}

export function getAuthNotice(notice) {
  const messages = {
    'signed-out': 'You have been signed out.',
    'check-email': 'Check your email to confirm your account before signing in.',
  }

  return typeof notice === 'string' ? messages[notice] ?? null : null
}
