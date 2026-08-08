/**
 * Phoenix v13 Horizon — Senior Alumni Direct Webhook Relay
 * =========================================================
 * Connects student career queries directly to verified senior alumni mentors
 * via signed webhook events with HMAC-SHA256 verification.
 */

const crypto = require('crypto');
const DispatchedQuestion = require('../../models/DispatchedQuestion');

function generateWebhookSignature(payloadString, secretKey) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(payloadString)
    .digest('hex');
}

async function submitMentorQuestion({ studentId, studentName, stage, mentorId, questionText }) {
  if (!studentName || !mentorId || !questionText) {
    throw new Error('studentName, mentorId, and questionText are required.');
  }

  const questionId = `q_mentor_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const timestamp = new Date().toISOString();

  const payloadObj = {
    event: 'MENTOR_QUESTION_SUBMITTED',
    questionId,
    student: { id: studentId || 'anon_student', name: studentName, stage: stage || '2nd_pu' },
    mentorId,
    questionText,
    submittedAt: timestamp
  };

  const payloadString = JSON.stringify(payloadObj);
  const secretKey = process.env.WEBHOOK_SECRET;
  if (!secretKey) throw new Error('WEBHOOK_SECRET environment variable is missing.');
  const signature = generateWebhookSignature(payloadString, secretKey);

  const record = await DispatchedQuestion.create({
    ...payloadObj,
    signature,
    status: 'QUEUED_FOR_MENTOR',
    estimatedResponseHours: 24
  });

  return {
    success: true,
    message: 'Your question has been securely signed and dispatched to your senior mentor.',
    record
  };
}

async function getDispatchedQuestions({ mentorId, studentId }) {
  const query = {};
  if (mentorId) query.mentorId = mentorId;
  if (studentId) query['student.id'] = studentId;
  const list = await DispatchedQuestion.find(query).sort({ createdAt: -1 });
  return { success: true, count: list.length, questions: list };
}

module.exports = { submitMentorQuestion, getDispatchedQuestions, generateWebhookSignature };
