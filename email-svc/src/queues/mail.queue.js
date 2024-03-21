
// const { Queue } = require('bullmq');
// const { MongoClient } = require('mongodb');

// // Connect to MongoDB
// const client = new MongoClient(
//     'mongodb+srv://admin:admin123@cluster0.mqbmnge.mongodb.net/?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect();
// const db = client.db('test');

// // Create a BullMQ queue with MongoDB as the backend
// const emailQueue = new Queue('email-queue', {
//     connection: {
//         client: db,
//         db: 'bull',
//     },
// });



// module.exports = emailQueue;