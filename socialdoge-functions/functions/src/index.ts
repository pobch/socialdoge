import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as firebase from 'firebase'
import { Scream } from './dbSchema'

const firebaseConfig = {
  apiKey: 'AIzaSyDIAzTMnI0RlTJZCgxnZah82eKqswo99x0',
  authDomain: 'socialdoge-626e7.firebaseapp.com',
  databaseURL: 'https://socialdoge-626e7.firebaseio.com',
  projectId: 'socialdoge-626e7',
  storageBucket: 'socialdoge-626e7.appspot.com',
  messagingSenderId: '619471434921',
  appId: '1:619471434921:web:7e0465118bee3ea51865b8',
  measurementId: 'G-796RPC8QJS'
}
firebase.initializeApp(firebaseConfig)

admin.initializeApp()

const db = admin.firestore()
const app = express()

type ResponseScream = Scream & { screamId: string }

app.get('/screams', (req, res) => {
  db.collection('screams')
    .get()
    .then(snapshot => {
      let screams: ResponseScream[] = []

      snapshot.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...(doc.data() as Scream)
        })
      })

      res.json(screams)
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
})

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

  firebase
    .auth()
    .createUserWithEmailAndPassword(reqBody.email, reqBody.password)
    .then(data => {
      res.status(201).json({ message: `an user ${data.user?.uid} was created` })
    })
    .catch(e => {
      console.error(e)
      res
        .status(500)
        .json({ error: 'something went wrong', fbErrorCode: e.code, fbErrorMsg: e.message })
    })
})

export const api = functions.region('asia-east2').https.onRequest(app)
