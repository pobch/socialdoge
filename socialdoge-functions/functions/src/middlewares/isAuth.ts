import { Response, Request, NextFunction } from 'express'
import { admin, db } from '../utils/adminUtil'

export type AuthUserData = {
  uid: string
  handle: string
  imageUrl: string
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers as {
    [key: string]: string | undefined
    authorization?: string
  }

  if (authorization && authorization.startsWith('Bearer ')) {
    let token = authorization.slice(7)
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        let dbPromise = db
          .collection('users')
          .where('userId', '==', decodedToken.uid)
          .limit(1)
          .get()
        return Promise.all([decodedToken, dbPromise])
      })
      .then(([decodedToken, snapShot]) => {
        const user: AuthUserData = {
          uid: decodedToken.uid,
          handle: snapShot.docs[0].data().handle,
          imageUrl: snapShot.docs[0].data().imageUrl
        }
        ;(req as Request & { user: AuthUserData }).user = user
        next()
        return
      })
      .catch(e => {
        console.error('Error while verifying token', e)
        res.status(403).json({ error: e.code || e.message })
        return
      })
  } else {
    console.error(new Error('Token not found'))
    res.status(403).json({ error: 'Unauthorized' })
    return
  }
}
