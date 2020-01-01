import { ResponseScream } from '../types/response'
import { Scream } from '../types/dbSchema'
import { db } from '../utils/adminUtil'
import { RequestHandler } from 'express'

const getScreamsHandler: RequestHandler = (req, res) => {
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
}

const createScreamHandler: RequestHandler = (req, res) => {
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
}

export { getScreamsHandler, createScreamHandler }
