import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

const config = JSON.parse(process.env.FIREBASE_CONFIG!);

// Reemplaza literal \\n por salto de línea real
config.private_key = config.private_key.replace(/\\n/g, '\n');

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(config),
});

console.log("Firebase initialized successfully");
