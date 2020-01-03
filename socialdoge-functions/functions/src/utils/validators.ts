import { SignUpRequiredData } from '../types/request'

type ValidationError = {
  email?: string
  password?: string
  confirmPassword?: string
  handle?: string
}

function isEmail(text: string) {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegEx.test(text)
}

function isEmpty(text: string) {
  const trimmedText = text.trim()
  return trimmedText.length > 0 ? false : true
}

export function signUpValidator({ email, confirmPassword, password, handle }: SignUpRequiredData) {
  let errors: ValidationError = {}

  // Validate email
  if (isEmpty(email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(email)) {
    errors.email = 'Must be a valid e-mail address'
  }

  // Validate password
  if (isEmpty(password)) {
    errors.password = 'Must not be empty'
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Must be the same as password'
  }

  // Validate handle
  if (isEmpty(handle)) {
    errors.handle = 'Must not be empty'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}
