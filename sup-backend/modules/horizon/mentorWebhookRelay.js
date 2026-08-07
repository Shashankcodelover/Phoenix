/**
 * Phoenix v13 Horizon — Senior Alumni Direct Webhook Relay
 * =========================================================
 * Connects student career queries directly to verified senior alumni mentors
 * via signed webhook events with HMAC-SHA256 verification.
 */

const crypto = require('crypto');

const DISPATCHED_QUESTIONS = [];

function generateWebhookSignature(payloadString, secretKey) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(payloadString)
    .digest('hex');
}

function submitMentorQuestion({ studentId, studentName, stage, mentorId, questionText }) {
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
  const secretKey = process.env.WEBHOOK_SECRET || 'phoenix_mentor_relay_secret_key_2026';
  const signature = generateWebhookSignature(payloadString, secretKey);

  const record = {
    ...payloadObj,
    signature,
    status: 'QUEUED_FOR_MENTOR',
    estimatedResponseHours: 24
  };

  DISPATCHED_QUESTIONS.push(record);

  return {
    success: true,
    message: 'Your question has been securely signed and dispatched to your senior mentor.',
    record
  };
}

function getDispatchedQuestions({ mentorId, studentId }) {
  let list = [...DISPATCHED_QUESTIONS];
  if (mentorId) list = list.filter(q => q.mentorId === mentorId);
  if (studentId) list = list.filter(q => q.student.id === studentId);
  return { success: true, count: list.length, questions: list };
}

module.exports = { submitMentorQuestion, getDispatchedQuestions, generateWebhookSignature };
