const express = require('express');
const { configureWebhook, sendWebhookMessage, sendDeadlineAlert } = require('./webhookController');

const router = express.Router();

const { dispatchWebhookEvent, getWebhookLogs } = require('./webhookDispatcher');

router.post('/configure', configureWebhook);
router.post('/send', sendWebhookMessage);
router.post('/deadline-alert', sendDeadlineAlert);
router.post('/dispatch', (req, res) => {
  try {
    const result = dispatchWebhookEvent(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/logs', (req, res) => {
  res.json({ logs: getWebhookLogs() });
});

module.exports = router;
