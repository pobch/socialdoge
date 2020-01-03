import * as firebase from 'firebase'
import { firebaseConfig } from '../configs/firebaseCfg'
import { db } from '../utils/adminUtil'
import { RequestHandler } from 'express'
import { signUpValidator } from '../utils/validators'
import { User } from '../types/dbSchema'
import { SignUpRequiredData, LogInRequired } from '../types/request'

firebase.initializeApp(firebaseConfig)

const signUpHandler: RequestHandler = (req, res) => {
  const reqBody: SignUpRequiredData = { ...req.body }

  // Validate request data
  const { errors, isValid } = signUpValidator(reqBody)
  if (!isValid) {
    res.status(400).json({ ...errors })
    return
  }

  db.doc(`/users/${reqBody.handle}`)
    .get()
    .then(snapShot => {
      if (snapShot.exists) {
        throw new Error('handle-already-taken')
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
      if (e?.message === 'handle-already-taken') {
        res.status(400).json({ handle: 'this handle is already taken' })
        return
      }

      res
        .status(500)
        .json({ error: 'something went wrong', fbErrorCode: e.code, fbErrorMsg: e.message })
      return
    })
}

const logInHandler: RequestHandler = (req, res) => {
  const reqBody: LogInRequired = { ...req.body }

  firebase
    .auth()
    .signInWithEmailAndPassword(reqBody.email, reqBody.password)
    .then(auth => {
      return auth.user?.getIdToken()
    })
    .then(token => {
      res.json({ token })
      return
    })
    .catch(e => {
      console.error(e)
      res.status(403).json({ general: 'Wrong credentials, please try again' })
      return
    })
}

export { signUpHandler, logInHandler }
