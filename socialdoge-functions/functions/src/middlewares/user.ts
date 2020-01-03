import { RequestHandler } from 'express'
import { SignUpReq } from '../types/request'

export const signUpRequiredProps: RequestHandler = (req, res, next) => {
  const { email, password, confirmPassword, handle } = req.body as SignUpReq

  if (!email || !password || !confirmPassword || !handle) {
    res.status(400).json({ error: 'All required properties are not provided' })
    return
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string' ||
    typeof handle !== 'string'
  ) {
    res.status(400).json({ error: 'Required properties have mismatch type of value' })
    return
  }

  next()
}
