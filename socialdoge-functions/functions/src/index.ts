import * as functions from 'firebase-functions'
import * as express from 'express'
import * as firebase from 'firebase'
import { Scream, User } from './types/dbSchema'

import './initializers/firebaseInit'
import './initializers/adminInit'
import { db } from './initializers/db'
import { getScreamsHandler } from './handlers/scream'

const app = express()

app.get('/screams', getScreamsHandler)

app.post('/scream', (req, res) => {
  const reqBody: { userHandle: string; body: string } = req.body
  const newScream: Scream = {
    ...reqBody,
    createdAt: new Date().toISOString()
  }

  db.collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `${doc.id} was created` })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
})

app.post('/signup', (req, res) => {
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
})

export const api = functions.region('asia-east2').https.onRequest(app)
