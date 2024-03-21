const { Worker } = require('bullmq');
const { MongoClient } = require('mongodb');
const mailService = new (require('../services/mail.service'));

// Connect to MongoDB
const client = new MongoClient(
    'mongodb+srv://admin:admin123@cluster0.mqbmnge.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const db = client.db('test');

// Create a BullMQ worker to process email jobs
const worker = new Worker('email-queue', async (job) => {
    console.log(`Processing email job ${job.id}`);
    console.log(job.data);
    const data_without_attachments = JSON.parse(JSON.stringify(job.data));

    if (Array.isArray(data_without_attachments.attachments)) {
        data_without_attachments.attachments = data_without_attachments.attachments.map(a => {
            return { filename: a.filename };
        });
    }
    try {
        const response = await mailService.send(job.data);
        console.log('response', response)
        done();
    } catch (e) {
        console.log('queue failed', e)
        done(e);
    }
}, {
    connection: {
        client: db,
        db: 'bull',
    },
});

// Event handler for completed jobs
worker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

// Event handler for failed jobs
worker.on('failed', (job, err) => {
    console.log(`Email job ${job.id} failed with error: ${err.message}`);
});
