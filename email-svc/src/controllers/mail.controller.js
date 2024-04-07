
const mailService = new (require('../services/mail.service'))

class MailController {
    static async send(req, res, next) {
        try {
            console.log('first spot', req.body)
            const payload = req.body;
            const options = {
                priority: payload.priority ? payload.priority : 2
            };
            const resp = await mailService.send(payload, options)
            res.json({ message: 'Email has been scheduled to be sent!' });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
    static health(req, res, next) {
        return res.status(200).json({ message: 'Email svc is running' })

    }
}

module.exports = MailController;
