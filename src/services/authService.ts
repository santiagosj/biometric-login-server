import bcrypt from 'bcrypt';
import { users } from '../models/userModel';
import { generateJWT } from '../utils/jwtHelper';
import { randomBytes } from 'crypto';
import admin from '../config/firebase';

export const authService = {
    async registerUser(email: string, username?: string, password?: string) {
        try {
            const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
            if (existingUser) {
                throw new Error('Email already exists');
            }
            // hash del password
            const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
            const userId = randomBytes(16).toString('hex');

            // crear el usuario en firebase
            const userRecord = await admin.auth().createUser({
                uid: userId,
                email: email,
                password: password,
                displayName: username,
            });

            //guardar el hash de la contrasena y datos adicionales en firestore
            await admin.firestore().collection('users').doc(userRecord.uid).set({
                email,
                username,
                passwordHash,
                createdAt: new Date().toISOString(),
                publicKey: '',
                credentialId: ''
            });
            return { status: 200, message: "User Created", user: userRecord }
        } catch (err) {
            return { status: 500, message: "Error al crear el usuario" }
        }
    },

    async completeRegistration(email: string, credentialId: string, publicKey: string,) {
        try {
            const user = (await admin.auth().getUserByEmail(email));

            if (!user) {
                return { status: 400, message: 'User not found' };
            }

            await admin.firestore().collection('users').doc(user.uid).update({
                credentialId,
                publicKey,
            });

            return { status: 200, message: "Registration Complete" }

        } catch (err) {
            return { status: 500, message: "Error completing the registration" }
        }
    },

    async loginUser(email: string) {
        try {
            const user = (await admin.auth().getUserByEmail(email));

            if (!user) {
                return { status: 404, message: 'User not found' };
            }

            const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            if (!userData || !userData.publicKey) {
                return { status: 404, message: 'User not found' };
            }

            const options = {
                challenge: randomBytes(32).toString('base64'),
                allowCredentials: [{ id: userData.credentialId, type: 'public-key' }]
            }
            return { status: 200, options }
        } catch (err) {
            return { status: 500, message: "Error al iniciar sesion" }
        }
    },

    async completeLogin(email: string, credentialId: string) {
        try {
            const user = await admin.auth().getUserByEmail(email);

            if (!user || !user.email) {
                return { status: 404, message: 'User not found' };
            }

            const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            if (userData?.credentialId !== credentialId) {
                return { status: 400, message: 'Credential ID does not match' };
            }

            const token = generateJWT({ id: user.uid, email: user.email });
            return { status: 200, message: "Login successfull", token }

        } catch (err) {
            return { status: 500, message: "Error completing login" }
        }
    },
}