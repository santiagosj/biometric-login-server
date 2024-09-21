import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Asegúrate de que FIREBASE_ADMIN_SDK esté definida y sea válida
if (!process.env.FIREBASE_ADMIN_SDK) {
    throw new Error('FIREBASE_ADMIN_SDK is not defined');
}

// Parsea la variable de entorno FIREBASE_ADMIN_SDK como JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://login-biometrico-default-rtdb.firebaseio.com'
});

export default admin;
