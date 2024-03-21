
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class SendGrid {
  static name = 'sendgrid';



  async sendEmail(mail) {
    try {
      console.log('sendgrid mail', mail)
      const payload3 = {
        from: {
          email: mail.from,
        },
        attachments: mail.attachments ? mail.attachments : [],
        personalizations: [
          {
            to: [
              {
                email: mail.to,
              },
            ],
            dynamic_template_data: {
              ...mail.template_data
            }
          },
        ],
        template_id: mail.template_id,
        to: mail.to,
        subject: mail.subject,
      };
      const email = await sgMail.send(payload3);
      return email

    } catch (err) {
      console.log("sendgrid error handler", err)
      throw ({
        statusCode: 500, message: {
          msg: 'Soemthing went wrong',
          response: err.response?.body,
          error_1: err.response?.body?.errors[0],
          errors: err.response?.body?.errors,
          err: err
        }
      })
    }
  }


}

module.exports = SendGrid;
