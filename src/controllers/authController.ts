import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../services/authService";

export const authController = {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const { email, username, password } = request.body as { email: string, username: string, password: string }

        try {
            const result = await authService.registerUser(email, username, password);
            reply.send(result);
        } catch (error) {
            const errorType = error as Error
            reply.code(500).send({ message: errorType.message });
        }
    },
    async completeRegistration(request: FastifyRequest, reply: FastifyReply) {
        const { email, credentialId, publicKey } = request.body as { email: string, credentialId: string, publicKey: string };
        try {
            const result = await authService.completeRegistration(email, credentialId, publicKey);
            reply.send(result);
        } catch (error) {
            const errorType = error as Error
            reply.code(500).send({ message: errorType.message });
        }

    },
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email } = request.body as { email: string };
        try {
            const result = await authService.loginUser(email,);
            reply.send(result);
        } catch (error) {
            const errorType = error as Error
            reply.code(500).send({ message: errorType.message });
        }

    },
    async completeLogin(request: FastifyRequest, reply: FastifyReply) {
        const { email, credentialId } = request.body as { email: string, credentialId: string };
        try {
            const result = await authService.completeLogin(email, credentialId);
            reply.send(result);
        } catch (error) {
            const errorType = error as Error
            reply.code(500).send({ message: errorType.message });
        }
    }
}