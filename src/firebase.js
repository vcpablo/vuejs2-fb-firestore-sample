import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
  projectId: 'your-firebase-project-id',
  databaseURL: 'your-firebase-database-url'
})

const _db = firebase.firestore()
_db.settings({ timestampsInSnapshots: true })

export const db = _db
