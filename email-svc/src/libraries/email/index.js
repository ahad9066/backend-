
const SendGrid =   new(require('./sendgrid.provider'))


class Email {
    
    static async sendEmail(mail) {
        const mailObj = new Mail(mail);
        return SendGrid.sendEmail(mailObj)
    }

}

class Mail {
    constructor(data) {
        this.from = data.from;
        this.to = data.to;
        this.cc = data.cc;
        this.bcc = data.bcc;
        this.reply_to = data.reply_to;
        this.subject = data.subject;
        this.body = data.body;
        this.attachments = data.attachments;
        this.template_id = data.template_id;
        this.template_data = data.template_data;
        this.priority = data.priority;
    }
}



module.exports = Email;
