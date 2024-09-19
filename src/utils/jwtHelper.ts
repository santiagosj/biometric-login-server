import jwt from "jsonwebtoken";
import { config } from '../config/config';

export function generateJWT(user: { id: string, email: string }) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' })
}