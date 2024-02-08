

const { Email } = require('../libraries');

class MailService  {
    /**
     * Send email
     * @param {import('../libraries/Email').MailObject} mail - Mail Object
     * @param {Object} options - Options
     * @param {String} options.provider - Service provider
     * @returns {Promise} - Promise
     */
    async send(mail, options = {}) {
        return Email.sendEmail(mail, options);
    }
}

module.exports = MailService;
