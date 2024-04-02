const express = require('express');
const router = express.Router();

const MailController = require('../controllers/mail.controller');

router.post(
    '/send',
    MailController.send
);
router.get("/health", MailController.health);

module.exports = router;
