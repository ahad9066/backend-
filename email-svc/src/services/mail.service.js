const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

class MailService {
    async send(mail, options = {}) {
        console.log("mail service", mail)
        // return Email.sendEmail(mail, options);
        let subject = '';
        if (mail.template_id == 'welcome') {
            subject = 'Metalliage inventory user credentials!'
        } else if (mail.template_id == 'make_payment') {
            subject = `Payment pending - ${mail.template_data.orderId}`
        } else if (mail.template_id == 'cancel_order') {
            subject = `Order cancelled- - ${mail.template_data.orderId}`
        } else if (mail.template_id == 'order_placed') {
            subject = `Order placed- - ${mail.template_data.orderId}`
        } else if (mail.template_id == 'supplier_stock') {
            subject = `Request for raw materials`
        }
        console.log(__dirname);
        const path = require('path');
        const htmlTemplate = fs.readFileSync(path.resolve(__dirname, `../templates/${mail.template_id}.html`), 'utf8');
        const template = handlebars.compile(htmlTemplate);
        const context = mail.template_data;

        // Pass context data to the template
        const html = template(context);

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'metalliage.manager@gmail.com',
                pass: 'ktve qzsz moyk ktqv'
            }
        });

        // Define email options
        const mailOptions = {
            from: 'metalliage.manager@gmail.com',
            to: mail.to,
            subject: subject,
            html: html,
            attachments: mail.attachments ? mail.attachments.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                encoding: 'base64',
                contentType: attachment.type
            })) : []
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
}

module.exports = MailService;
