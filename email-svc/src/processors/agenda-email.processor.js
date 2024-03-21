
// const { agenda } = require('../queues/agenda-mail.queue');

// (async () => {
//     await agenda.start();
//     console.log('Agenda started...');
// })();
// // const mailService = new (require('../services/mail.service'));

// // email.process('send', async (job, done) => {
// //     const data_without_attachments = JSON.parse(JSON.stringify(job.data));

// //     if (Array.isArray(data_without_attachments.attachments)) {
// //         data_without_attachments.attachments = data_without_attachments.attachments.map(a => {
// //             return { filename: a.filename };
// //         });
// //     }


// //     try {
// //         const response = await mailService.send(job.data);
// //         console.log('response', response)
// //         done();
// //     } catch (e) {
// //         console.log('queue failed', e)
// //         done(e);
// //     }
// // });
