// provides validation utilities for forms and data

// checks if an email is valid
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// checks if a password is strong (min 8 chars, 1 number, 1 letter)
export function isStrongPassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

// checks if a string is not empty
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
