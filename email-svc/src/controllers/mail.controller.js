const JoiController = require('../shared/controller/joi.controller');

const validators = require("../validators/mail.validator");
const agenda = require('../queues/mail.queue');

class MailController {
    static async send(req, res, next) {
        try {
            console.log('i have landed here in email service')
            const schema = validators.send;
            const payload = await JoiController.validateSchema(schema, req.body);
            const options = {
                priority: payload.priority ? payload.priority : 2
            };
            await agenda.schedule('now', 'send email', payload);
            ;
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
