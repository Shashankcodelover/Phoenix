const express = require('express');
const { configureWebhook, sendWebhookMessage, sendDeadlineAlert } = require('./webhookController');

const router = express.Router();

router.post('/configure', configureWebhook);
router.post('/send', sendWebhookMessage);
router.post('/deadline-alert', sendDeadlineAlert);

module.exports = router;
