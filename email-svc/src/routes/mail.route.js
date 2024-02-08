const express = require('express');
const router = express.Router();

const MailController = require('../controllers/mail.controller');

router.post(
    '/send',
    MailController.send
);

module.exports = router;
