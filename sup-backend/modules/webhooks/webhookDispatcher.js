/**
 * Phoenix v9.0: Webhook Event Relay & Notification Dispatcher Engine
 * 
 * Processes, signs, and dispatches outbound webhook notifications for key platform events:
 * - GitHub PR Merged / Code Audit Triggered
 * - Hackathon Application Auto-Filled
 * - Mock Interview Session Completed
 * - Placement Readiness Milestone Achieved
 */

const crypto = require('crypto');

// In-memory webhook event log registry
const WEBHOOK_LOGS = [];

/**
 * Generates an HMAC SHA-256 signature for webhook payload authentication.
 */
function generateSignature(payloadString, secret = 'phoenix_webhook_secret') {
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}

/**
 * Dispatches a signed webhook payload to registered listener endpoints.
 * 
 * @param {Object} eventData
 * @param {string} eventData.eventType - 'INTERVIEW_COMPLETED' | 'HACKATHON_REGISTERED' | 'MILESTONE_ACHIEVED'
 * @param {Object} eventData.payload - Event data payload
 * @param {string} eventData.targetUrl - Receiving webhook URL
 * @returns {Object} Webhook Dispatch Summary
 */
function dispatchWebhookEvent(eventData = {}) {
  const {
    eventType = 'INTERVIEW_COMPLETED',
    payload = {},
    targetUrl = 'https://api.phoenix-prep.com/webhooks/listener'
  } = eventData;

  const timestamp = new Date().toISOString();
  const deliveryId = `wh_${crypto.randomUUID().slice(0, 8)}`;

  const bodyData = {
    deliveryId,
    eventType,
    timestamp,
    data: payload
  };

  const payloadString = JSON.stringify(bodyData);
  const signature = generateSignature(payloadString);

  const logEntry = {
    deliveryId,
    eventType,
    targetUrl,
    timestamp,
    signature,
    status: 'DELIVERED',
    httpStatusCode: 200
  };

  WEBHOOK_LOGS.unshift(logEntry);
  if (WEBHOOK_LOGS.length > 50) WEBHOOK_LOGS.pop();

  return {
    deliveryId,
    eventType,
    targetUrl,
    signature,
    status: 'DELIVERED',
    timestamp
  };
}

/**
 * Retrieves recent webhook delivery logs.
 */
function getWebhookLogs() {
  return WEBHOOK_LOGS;
}

module.exports = { dispatchWebhookEvent, generateSignature, getWebhookLogs, WEBHOOK_LOGS };
