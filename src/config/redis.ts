import { createClient } from 'redis';
import Redis from 'ioredis';
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: 6379,
    },
});

const redis = new Redis(process.env.REDIS_URL + '?family=0');

client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

(async () => {
    await client.connect();
    await redis.ping();
})();

export default client;