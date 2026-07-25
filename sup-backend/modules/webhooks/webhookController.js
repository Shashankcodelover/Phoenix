/**
 * Phoenix V22: Webhook Notification Controller
 *
 * Sends deadline alerts and team status updates to Discord/Slack channels.
 * Endpoints:
 *   POST /api/webhooks/configure  — Save webhook URL
 *   POST /api/webhooks/send       — Send a message to the configured webhook
 *   POST /api/webhooks/deadline-alert — Send a formatted deadline alert
 */

// In-memory webhook store (per team/user). In production, persist to DB.
const webhookStore = new Map();

// @desc    Configure a webhook URL for a team
// @route   POST /api/webhooks/configure
const configureWebhook = async (req, res) => {
  try {
    const { teamId, platform, webhookUrl } = req.body;
    if (!teamId || !webhookUrl) {
      return res.status(400).json({ message: 'teamId and webhookUrl are required.' });
    }

    webhookStore.set(teamId, { platform: platform || 'discord', webhookUrl });
    res.json({ message: `Webhook configured for team ${teamId} on ${platform || 'discord'}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a raw message to the team's configured webhook
// @route   POST /api/webhooks/send
const sendWebhookMessage = async (req, res) => {
  try {
    const { teamId, message } = req.body;
    if (!teamId || !message) {
      return res.status(400).json({ message: 'teamId and message are required.' });
    }

    const config = webhookStore.get(teamId);
    if (!config) {
      return res.status(404).json({ message: 'No webhook configured for this team. Use /configure first.' });
    }

    const payload = config.platform === 'slack'
      ? { text: message }
      : { content: message }; // Discord format

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 204) {
      res.json({ message: 'Webhook message sent successfully.' });
    } else {
      res.status(response.status).json({ message: `Webhook delivery failed with status ${response.status}.` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a formatted deadline alert embed to Discord
// @route   POST /api/webhooks/deadline-alert
const sendDeadlineAlert = async (req, res) => {
  try {
    const { teamId, hackathonName, deadline, registrationUrl, teamMembers = [] } = req.body;
    if (!teamId || !hackathonName || !deadline) {
      return res.status(400).json({ message: 'teamId, hackathonName, and deadline are required.' });
    }

    const config = webhookStore.get(teamId);
    if (!config) {
      return res.status(404).json({ message: 'No webhook configured for this team.' });
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.round((deadlineDate - now) / (1000 * 60 * 60)));

    let payload;

    if (config.platform === 'slack') {
      payload = {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: `🚨 Deadline Alert: ${hackathonName}` } },
          { type: 'section', text: { type: 'mrkdwn', text: `*⏰ ${hoursLeft} hours remaining!*\n📅 Deadline: ${deadlineDate.toLocaleString()}\n👥 Team: ${teamMembers.join(', ') || 'Not set'}` } },
          { type: 'actions', elements: [{ type: 'button', text: { type: 'plain_text', text: '📝 Register Now' }, url: registrationUrl || '#' }] }
        ]
      };
    } else {
      // Discord rich embed
      payload = {
        embeds: [{
          title: `🚨 Deadline Alert: ${hackathonName}`,
          description: `**⏰ ${hoursLeft} hours remaining!**`,
          color: hoursLeft <= 12 ? 0xf43f5e : hoursLeft <= 48 ? 0xff8a00 : 0x00f5ff,
          fields: [
            { name: '📅 Deadline', value: deadlineDate.toLocaleString(), inline: true },
            { name: '👥 Team', value: teamMembers.join(', ') || 'Not set', inline: true },
            { name: '🔗 Register', value: registrationUrl ? `[Click here](${registrationUrl})` : 'No link provided' }
          ],
          footer: { text: 'Phoenix Hackathon Command Center' },
          timestamp: new Date().toISOString()
        }]
      };
    }

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 204) {
      res.json({ message: `Deadline alert sent for "${hackathonName}" (${hoursLeft}h remaining).` });
    } else {
      res.status(response.status).json({ message: `Webhook delivery failed: ${response.status}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { configureWebhook, sendWebhookMessage, sendDeadlineAlert };
