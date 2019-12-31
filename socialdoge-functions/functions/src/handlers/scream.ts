import { ResponseScream } from '../types/response'
import { Scream } from '../types/dbSchema'
import { db } from '../initializers/db'
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

export { getScreamsHandler }
