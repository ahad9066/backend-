const Joi = require('joi');

const person = Joi.object({
    name: Joi.string().allow(null),
    email: Joi.string().email().required()
});

const attachment = Joi.object({
    content: Joi.string().required(),
    filename: Joi.string().required(),
    type: Joi.string().allow(null),
    disposition: Joi.string().allow(null, 'inline', 'attachment'),
    content_id: Joi.string().allow(null),
});

module.exports = {
    send: Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        cc: Joi.array().items(person),
        bcc: Joi.array().items(person),
        reply_to: person,
        subject: Joi.string().required(),
        body: Joi.array().items(Joi.object({
            type: Joi.string().required(),
            value: Joi.string().required()
        })).when('template_id', { is: Joi.equal(null), then: Joi.array().min(1).required() }),
        attachments: Joi.array().items(attachment),
        template_id: Joi.string().allow(null),
        template_data: Joi.object().allow(null),
        priority: Joi.number().default(2).min(1).max(10).allow(null)
    }),
};
