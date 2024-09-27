import { createClient } from 'redis';
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: 6379,
    },
});

client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

(async () => {
    await client.connect()
})();

export default client;