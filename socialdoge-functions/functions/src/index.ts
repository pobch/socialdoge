import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

type Scream = {
  userHandle: string
  body: string
  createdAt: Date
}

admin.initializeApp()

export const getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('screams')
    .get()
    .then(snapshot => {
      let screams: Scream[] = []

      snapshot.forEach(doc => {
        screams.push(doc.data() as Scream)
      })

      res.json(screams)
    })
    .catch(err => console.error(err))
})

export const createScream = functions.https.onRequest((req, res) => {
  const newScream = {
    ...req.body,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  }

  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `${doc.id} was created` })
    })
    .catch(err => {
      res.status(500).json({ message: 'something went wrong', isError: true })
      console.error(err)
    })
})
