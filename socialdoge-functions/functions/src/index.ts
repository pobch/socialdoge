import * as functions from 'firebase-functions'
import * as express from 'express'
import { getScreamsHandler, createScreamHandler } from './handlers/scream'
import { signUpHandler } from './handlers/user'

const app = express()

app.get('/screams', getScreamsHandler)
app.post('/scream', createScreamHandler)
app.post('/signup', signUpHandler)

export const api = functions.region('asia-east2').https.onRequest(app)
