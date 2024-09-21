import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController';

export const authRoutes = (app: FastifyInstance) => {
    app.post('/register', authController.register);
    app.post('/register/complete', authController.completeRegistration);
    app.post('/login', authController.login);
    app.post('/login/complete', authController.completeLogin);
};
