import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import dotenv from 'dotenv';
import { authRoutes } from "./routes/authRouter";

dotenv.config({
    path: `${__dirname}/../.env`
});

if (!process.env.JWT_SECRET) {
    throw new Error("Missing necessary environment variables!");
}

const app = fastify();
app.register(fastifyCors, { origin: true });

// Registro de rutas
authRoutes(app);

app.get('/', async (request, response) => {
    return { message: 'Hola mundo' }
});

try {
    const port = process.env.PORT || 3001;
    app.listen({ port: Number(port), host: '0.0.0.0' });
    console.log(`Server is running on port ${port}`);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
