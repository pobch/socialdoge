export type SignUpReq = {
  email?: any
  password?: any
  confirmPassword?: any
  handle?: any
  [key: string]: any
}

export type SignUpRequiredData = {
  email: string
  password: string
  confirmPassword: string
  handle: string
}
