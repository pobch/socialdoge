import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

type Scream = {
  userHandle: string
  body: string
}

admin.initializeApp()

export const hello = functions.https.onRequest((request, response) => {
  response.send('Hello from PoB!')
})

export const getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('screams')
    .get()
    .then(docs => {
      let result: Scream[] = []

      docs.forEach(doc => {
        result.push(doc.data() as Scream)
      })

      res.json(result)
    })
    .catch(err => console.error(err))
})
