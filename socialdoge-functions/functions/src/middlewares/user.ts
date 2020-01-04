import { RequestHandler } from 'express'
import { SignUpRequest } from '../types/request'

export const signUpRequiredProps: RequestHandler = (req, res, next) => {
  const { email, password, confirmPassword, handle } = req.body as SignUpRequest

  if (!email || !password || !confirmPassword || !handle) {
    console.error(new Error('required props are missing in a JSON request'))
    res.status(400).json({ error: 'All required properties are not provided' })
    return
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string' ||
    typeof handle !== 'string'
  ) {
    console.error(new Error('some props have a wrong type'))
    res.status(400).json({ error: 'Required properties have mismatch type of value' })
    return
  }

  next()
}
