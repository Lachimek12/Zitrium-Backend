import { createClient } from 'redis';

const client = createClient();

(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    console.log('Connected to Redis');
})();

module.exports = client;