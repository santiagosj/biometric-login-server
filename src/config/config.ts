export const config = {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    corsOptions: { origin: true }
}