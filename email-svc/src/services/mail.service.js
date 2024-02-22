

const { Email } = require('../libraries');

class MailService {
    /**
     * Send email
     * @param {import('../libraries/Email').MailObject} mail - Mail Object
     * @param {Object} options - Options
     * @param {String} options.provider - Service provider
     * @returns {Promise} - Promise
     */
    async send(mail, options = {}) {
        try {
            console.log("mail service", mail)
            await Email.sendEmail(mail, options);
        }
        catch (err) {
            console.log("service error", err)
            throw ({
                statusCode: 500, message: {
                    err: err
                }
            })
        }
    }
}

module.exports = MailService;
