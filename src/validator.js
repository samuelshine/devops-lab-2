/**
 * Input validation helpers used by the demo app.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value);
}

export function isStrongPassword(value) {
  if (typeof value !== 'string' || value.length < 8) {
    return false;
  }
  return /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
}

export function normalizeUsername(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Username must be a string');
  }
  return value.trim().toLowerCase();
}
