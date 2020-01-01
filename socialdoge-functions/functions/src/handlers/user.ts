import * as firebase from 'firebase'
import { firebaseConfig } from '../configs/firebaseCfg'
import { db } from '../utils/adminUtil'
import { RequestHandler } from 'express'
import { User } from '../types/dbSchema'

firebase.initializeApp(firebaseConfig)

const signUpHandler: RequestHandler = (req, res) => {
  const reqBody: { email: string; password: string; confirmPassword: string; handle: string } = {
    ...req.body
  }

  // TODO: validate

  db.doc(`/users/${reqBody.handle}`)
    .get()
    .then(snapShot => {
      if (snapShot.exists) {
        throw new Error('400/handle-already-taken')
      } else {
        return firebase.auth().createUserWithEmailAndPassword(reqBody.email, reqBody.password)
      }
    })
    .then(auth => {
      const userId = auth.user?.uid ?? null
      const newUserDoc: User = {
        handle: reqBody.handle,
        email: reqBody.email,
        createdAt: new Date().toISOString(),
        userId
      }
      return Promise.all([
        db.doc(`/users/${reqBody.handle}`).set(newUserDoc),
        auth.user?.getIdToken() ?? null
      ])
    })
    .then(([_, token]) => {
      res.status(201).json({ token })
      return
    })
    .catch(e => {
      console.error(e)
      // custom error
      if (e?.message === '400/handle-already-taken') {
        res.status(400).json({ handle: 'this handle is already taken' })
        return
      }

      res
        .status(500)
        .json({ error: 'something went wrong', fbErrorCode: e.code, fbErrorMsg: e.message })
      return
    })
}

export { signUpHandler }
