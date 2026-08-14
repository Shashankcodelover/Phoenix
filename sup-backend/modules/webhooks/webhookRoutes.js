const express = require('express');
const { configureWebhook, sendWebhookMessage, sendDeadlineAlert } = require('./webhookController');
const { protect, protectOptional } = require('../../middleware/authMiddleware');
const { dispatchWebhookEvent, getWebhookLogs } = require('./webhookDispatcher');

const router = express.Router();

// Protected Webhook Management Routes
router.post('/configure', protect, configureWebhook);
router.post('/send', protect, sendWebhookMessage);
router.post('/deadline-alert', protect, sendDeadlineAlert);

// Signed Webhook Dispatcher Route (with SSRF Guard)
router.post('/dispatch', protectOptional, (req, res) => {
  try {
    const result = dispatchWebhookEvent(req.body);
    if (result.success === false) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook Delivery Audit Log Access
router.get('/logs', protectOptional, (req, res) => {
  res.json({ logs: getWebhookLogs() });
});

module.exports = router;
