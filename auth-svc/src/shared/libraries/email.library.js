const axios = require('axios').default;
const _ = require('lodash');

const { emailConstants } = require('../../constants');

const client = axios.create({
    baseURL: process.env.EMAIL_API_BASE_URL,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
});

class Email {

    static async sendTemplate(to, template, template_data, options = {}) {
        try {
            const email = emailConstants.templates[template];
            console.log('to', to)
            if (!email || !email.template_id) {
                throw new Error(`Template '${template}' does not exist!`);
            }
            const payload = {
                from: !!options.from ? options.from : process.env.EMAIL_FROM_ADDRESS,
                to: to,
                cc: !!options.cc ? options.cc : [],
                reply_to: !!options.reply_to ? options.reply_to : process.env.REPLY_TO_EMAIL,
                subject: email.subject,
                attachments: Array.isArray(options.attachments) && options.attachments.length > 0 ? options.attachments : undefined,
                template_id: email.template_id,
                template_data: {
                    recipient: to,

                    ...template_data
                },
                priority: email.priority
            };
            const payload_without_attachments = JSON.parse(JSON.stringify(payload));

            if (Array.isArray(payload_without_attachments.attachments)) {
                payload_without_attachments.attachments = payload_without_attachments.attachments.map(a => {
                    return { filename: a.filename };
                });
            }


            return this._post('/email/send', payload);
        } catch (err) {
            throw ({
                StatusCode: 500, message: {
                    msg: 'Error with email',
                    err: err
                }
            })
        }
    }



    static async _post(endpoint, data, options = {}) {
        return this._request('POST', endpoint, { ...options, data });
    }

    static async _request(method, endpoint, options = {}) {
        const headers = {
            ...options.headers
        };



        return client.request({
            ...options,
            method: method,
            url: endpoint,
            headers: headers
        }).then(() => { return Email.responseHandler }).catch(Email.errorHandler);
    }

    static responseHandler(response) {
        console.log('response', response.data)
        return response.data;
    }

    static errorHandler(err) {
        // console.log('errrrrrr', err.response)
        console.log('reee', {
            statusCode: err.response.status,
            response: err.response.data,
            error_1: err.response.data.errors.to,
            errors: err.response.data.errors,
            err: err
        })
        throw {
            statusCode: err.response.status,
            response: err.response.data,
            error_1: err.response.data.errors.to,
            errors: err.response.data.errors,
            err: err
        };
    }
}

module.exports = Email;
