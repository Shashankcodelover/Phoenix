/**
 * Phoenix Horizon — AI Guide Bot Engine
 * ======================================
 * An interactive AI assistant that:
 * 1. Understands the current page context (which page the user is on)
 * 2. Can answer questions about the platform, roadmaps, exams, and career paths
 * 3. Returns "focus instructions" that tell the frontend to highlight specific page elements
 * 4. Provides contextual guidance based on the user's academic stage
 *
 * The bot communicates via structured JSON responses that the frontend
 * interprets to create visual focus effects (blinking, circles, highlights).
 */

const { getPuSyllabusGapAnalysis, getPuMonthByMonthRoadmap, getPuEntranceExamPrep, getPuBoardPyqs, getPuResources } = require('../cs-pu/puCurriculumEngine');
const { getDiplomaSyllabusGapAnalysis, getDiplomaRoadmap, getDcetPrepPlan, getDcetPyqs, getDiplomaResources, getLateralEntryGuide } = require('../cs-diploma/diplomaCurriculumEngine');
const { getEngSemesterGapAnalysis, getEngRoadmap, evaluatePlacementReadiness } = require('../cs-engineering/engCurriculumEngine');

const { dispatchToAI } = require('../../../config/aiProvider');

// ═══════════════════════════════════════════════════════════
// CORE BOT LOGIC
// ═══════════════════════════════════════════════════════════

async function processMessage({ message, userStage, currentPage }) {
  if (!message || typeof message !== 'string') {
    return { success: false, error: 'Message is required.' };
  }

  const stage = userStage || '2nd_pu';

  const systemInstruction = `
    You are the Phoenix Horizon Guide Bot, an intelligent, empathetic AI career counselor and navigation assistant.
    The user is a student at academic stage: ${stage}.
    They are currently on the page/context: ${currentPage || 'world-dashboard'}.
    
    Respond in JSON format with two fields:
    1. "botReply": Your actual textual response to the student. Keep it conversational, helpful, and concise. Use emojis.
    2. "focusElements": An array of strings representing the UI components they should look at (e.g., ["roadmap", "exam_radar", "daily_checklist", "mentor_section", "pyq_bank", "resource_links", "world_badge", "navigation"]). Only include elements highly relevant to their query. If none apply, return an empty array.
  `;

  try {
    const rawResult = await dispatchToAI(message, systemInstruction, 'conversational', true);
    let parsedData = { botReply: "I'm having trouble analyzing that request right now.", focusElements: [] };
    
    if (typeof rawResult === 'string') {
      try {
        parsedData = JSON.parse(rawResult);
      } catch (e) {
        // Fallback if not valid JSON
        parsedData.botReply = rawResult;
      }
    } else {
      parsedData = rawResult;
    }

    return {
      success: true,
      userStage: stage,
      currentPage: currentPage || 'world-dashboard',
      botReply: parsedData.botReply,
      focusElements: parsedData.focusElements || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: 'AI Engine failed to process your request: ' + error.message
    };
  }
}

module.exports = { processMessage };
