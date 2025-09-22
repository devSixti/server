import  admin  from 'firebase-admin';

const serviceAccount = require('../keys/firebase.services.json');

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase ok.")