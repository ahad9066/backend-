const JoiController = require('../shared/controller/joi.controller');

const validators = require("../validators/mail.validator");
// const agenda = require('../queues/mail.queue');
const schedule = require('node-schedule');
const mailService = new (require('../services/mail.service'))

class MailController {
    static async send(req, res, next) {
        try {
            console.log('first spot', req.body)
            const schema = validators.send;
            const payload = await JoiController.validateSchema(schema, req.body);
            const options = {
                priority: payload.priority ? payload.priority : 2
            };
            // await agenda.schedule('now', 'send email', payload);
            const resp = mailService.send(payload, options)
            // Schedule the job to send email
            // const job = schedule.scheduleJob('now', async function () {
            //     try {
            //         const response = await mailService.send(payload);
            //         console.log('Email sent successfully:', response);
            //     } catch (error) {
            //         console.error('Failed to send email:', error);
            //         // Handle email sending failure
            //         // You can decide how to handle the error here
            //     }
            // });
            res.json({ message: 'Email has been scheduled to be sent!' });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

module.exports = MailController;
