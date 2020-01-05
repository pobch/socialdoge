import 'source-map-support/register'

import * as functions from 'firebase-functions'
import * as express from 'express'
import { getScreamsHandler, createScreamHandler } from './handlers/scream'
import { signUpHandler, logInHandler } from './handlers/user'
import { signUpRequiredProps } from './middlewares/user'
import { isAuth } from './middlewares/isAuth'

const app = express()

app.get('/screams', getScreamsHandler)
app.post('/scream', isAuth, createScreamHandler)
app.post('/signup', signUpRequiredProps, signUpHandler)
app.post('/login', logInHandler)

export const api = functions.region('asia-east2').https.onRequest(app)

// @TODO add json validator to validate `req.body` at runtime
// use `express-validator`??
// @TODO transaction between `firebase.auth()` service and `admin.firestore()` service
// use firebase function to help this??
