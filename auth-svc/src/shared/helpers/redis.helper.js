// const redis = require("redis");
// const { promisifyAll } = require('bluebird');

// promisifyAll(redis);

// const client = redis.createClient({
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_HOST,
// })
// client.on('connect', () => {
//     console.log('Client connected to redis...')
// })

// client.on('ready', () => {
//     console.log('Client connected to redis and ready to use...')
// })

// process.on('SIGINT', () => {
//     client.quit()
// })

// module.exports = client

// // const redis = require('redis');
// // // const bluebird = require('bluebird');

// // // Promisify all Redis functions
// // // bluebird.promisifyAll(redis.RedisClient.prototype);
// // // bluebird.promisifyAll(redis.Multi.prototype);

// // // Create the Redis client
// // const client = redis.createClient({
// //     port: process.env.REDIS_PORT,
// //     host: process.env.REDIS_HOST,
// // });

// // client.on('connect', () => {
// //     console.log('Client connected to Redis...');
// // });

// // client.on('ready', () => {
// //     console.log('Client connected to Redis and ready to use...');
// // });

// // client.on('error', (err) => {
// //     console.error('Redis error:', err);
// // });

// // client.on('end', () => {
// //     console.log('Client disconnected from Redis...');
// // });

// // module.exports = client;
const redis = require('redis');
const { promisify } = require('util');

// Retrieve your Redis Cloud credentials from your Redis Cloud instance dashboard
const client = redis.createClient({
    //   host: 'your-redis-cloud-hostname',
    //   port: 'your-redis-cloud-port',
    //   password: 'your-redis-cloud-password',
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    tls: {}, // Enable TLS if your Redis Cloud instance supports it
});

client.on('connect', () => {
    console.log('Connected to Redis Cloud');
});

client.on('error', (err) => {
    console.error('Error connecting to Redis Cloud:', err);
});

// Promisify Redis commands to use async/await
const setAsync = promisify(client.set).bind(client);

module.exports = {
    client,
    setAsync,
};
