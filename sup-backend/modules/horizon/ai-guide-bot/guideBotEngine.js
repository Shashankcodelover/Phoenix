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

// ═══════════════════════════════════════════════════════════
// INTENT RECOGNITION ENGINE
// ═══════════════════════════════════════════════════════════

const INTENT_PATTERNS = [
  { intent: 'find_roadmap', keywords: ['roadmap', 'path', 'plan', 'journey', 'where to start', 'what to learn', 'guide me', 'route'], description: 'User wants to see their learning roadmap' },
  { intent: 'find_pyq', keywords: ['pyq', 'previous year', 'past paper', 'question bank', 'practice question', 'mock test', 'exam paper'], description: 'User wants practice questions' },
  { intent: 'find_exam', keywords: ['kcet', 'dcet', 'jee', 'comedk', 'neet', 'entrance', 'exam date', 'registration', 'exam prep'], description: 'User wants entrance exam information' },
  { intent: 'find_resource', keywords: ['resource', 'course', 'book', 'tutorial', 'video', 'link', 'website', 'learn from', 'study material'], description: 'User wants learning resources' },
  { intent: 'find_gap', keywords: ['gap', 'what college doesn\'t teach', 'syllabus problem', 'missing skill', 'industry need', 'what I\'m missing'], description: 'User wants syllabus gap analysis' },
  { intent: 'find_mentor', keywords: ['mentor', 'senior', 'alumni', 'advice', 'guidance', 'talk to someone', 'who can help'], description: 'User wants mentorship connections' },
  { intent: 'navigate_element', keywords: ['where is', 'show me', 'find the', 'how do I get to', 'take me to', 'locate', 'point to', 'highlight'], description: 'User wants the bot to highlight a specific UI element' },
  { intent: 'check_readiness', keywords: ['am I ready', 'readiness', 'placement ready', 'how prepared', 'am I good enough', 'evaluate me'], description: 'User wants a placement readiness check' },
  { intent: 'lateral_entry', keywords: ['lateral entry', 'diploma to engineering', 'dcet lateral', 'skip PU', '2nd year direct', 'bridge gap'], description: 'User wants lateral entry guidance' },
  { intent: 'greeting', keywords: ['hello', 'hi', 'hey', 'good morning', 'help', 'start', 'what can you do'], description: 'User greeting or help request' },
];

// ═══════════════════════════════════════════════════════════
// PAGE ELEMENT FOCUS MAP (tells frontend what to highlight)
// ═══════════════════════════════════════════════════════════

const PAGE_FOCUS_MAP = {
  roadmap: { selector: '#roadmapTimeline, .phase-timeline', label: 'Your Phased Roadmap', section: 'roadmap' },
  daily_checklist: { selector: '#dailyChecklist, .daily-checklist', label: 'Today\'s Action Checklist', section: 'checklist' },
  exam_radar: { selector: '#examRadarList, .exam-alert', label: 'Entrance Exam Radar', section: 'exams' },
  mentor_section: { selector: '#seniorMentorsList, .mentor-card', label: 'Senior Mentorship Wisdom', section: 'mentors' },
  navigation: { selector: '.sidebar, .nav-item', label: 'Navigation Sidebar', section: 'navigation' },
  world_badge: { selector: '#worldBadge, .world-badge', label: 'Your Current World', section: 'world' },
  resource_links: { selector: '.resource-list, .resource-card', label: 'Learning Resources', section: 'resources' },
  pyq_bank: { selector: '.pyq-section, .pyq-card', label: 'PYQ Practice Bank', section: 'pyqs' },
};

// ═══════════════════════════════════════════════════════════
// CORE BOT LOGIC
// ═══════════════════════════════════════════════════════════

function recognizeIntent(message) {
  const lowerMsg = message.toLowerCase();
  let bestMatch = { intent: 'unknown', confidence: 0, description: '' };

  for (const pattern of INTENT_PATTERNS) {
    const matchCount = pattern.keywords.filter(kw => lowerMsg.includes(kw)).length;
    const confidence = matchCount / pattern.keywords.length;
    if (confidence > bestMatch.confidence) {
      bestMatch = { intent: pattern.intent, confidence, description: pattern.description };
    }
  }

  // Minimum confidence threshold
  if (bestMatch.confidence < 0.1) {
    bestMatch = { intent: 'general_query', confidence: 0, description: 'General question' };
  }

  return bestMatch;
}

function processMessage({ message, userStage, currentPage }) {
  if (!message || typeof message !== 'string') {
    return { success: false, error: 'Message is required.' };
  }

  const stage = userStage || '2nd_pu';
  const intentResult = recognizeIntent(message);
  let response = {};

  switch (intentResult.intent) {
    case 'greeting':
      response = {
        botReply: `Hey! 👋 I'm your Phoenix Horizon Guide. I can help you with:\n\n• 🗺️ **Learning Roadmaps** — "Show me my roadmap"\n• 📡 **Exam Prep** — "How do I prepare for KCET?"\n• 📚 **PYQ Practice** — "Give me practice questions"\n• 🔍 **Gap Analysis** — "What is my college not teaching me?"\n• 🎓 **Senior Advice** — "Connect me with a mentor"\n• 📍 **Page Navigation** — "Where is the exam radar?"\n\nWhat would you like to explore?`,
        focusElements: [],
      };
      break;

    case 'find_roadmap':
      if (stage.includes('pu') || stage === '10th') {
        const roadmap = getPuMonthByMonthRoadmap();
        response = {
          botReply: `Here's your **complete 2-year PU CS roadmap** — month by month from June of 1st PU to KCET exam day. I've highlighted it on the dashboard for you.`,
          data: roadmap,
          focusElements: [PAGE_FOCUS_MAP.roadmap],
        };
      } else if (stage.includes('diploma')) {
        const roadmap = getDiplomaRoadmap();
        response = {
          botReply: `Here's your **3-year Diploma CS roadmap** including DCET preparation timeline. Each month has academic + self-study targets. I've highlighted it for you.`,
          data: roadmap,
          focusElements: [PAGE_FOCUS_MAP.roadmap],
        };
      } else {
        const roadmap = getEngRoadmap();
        response = {
          botReply: `Here's your **8-semester Engineering CS placement-oriented roadmap** with DSA targets, project milestones, and internship timelines. Let's get you placed.`,
          data: roadmap,
          focusElements: [PAGE_FOCUS_MAP.roadmap],
        };
      }
      break;

    case 'find_exam':
      if (stage.includes('diploma')) {
        const dcet = getDcetPrepPlan();
        response = {
          botReply: `**DCET Preparation Plan** loaded! The exam is conducted by KEA with 120 questions (Math + CS) in 2 hours. I've highlighted the exam radar section. Key tip: Start 6 months before, not 1 month.`,
          data: dcet,
          focusElements: [PAGE_FOCUS_MAP.exam_radar],
        };
      } else {
        const kcet = getPuEntranceExamPrep('kcet');
        response = {
          botReply: `**KCET Preparation Plan** loaded! 180 questions across Physics, Chemistry, and Mathematics. No negative marking. Your final rank = KCET Score (50%) + PU Board Marks (50%). I've highlighted the exam section.`,
          data: kcet,
          focusElements: [PAGE_FOCUS_MAP.exam_radar],
        };
      }
      break;

    case 'find_pyq':
      if (stage.includes('diploma')) {
        const pyqs = getDcetPyqs({});
        response = {
          botReply: `Here are **DCET Previous Year Questions** with detailed solutions. I've highlighted the PYQ section. Pro tip: DCET repeats question patterns — solving last 5 years guarantees pattern recognition.`,
          data: pyqs,
          focusElements: [PAGE_FOCUS_MAP.pyq_bank],
        };
      } else {
        const pyqs = getPuBoardPyqs({});
        response = {
          botReply: `Here are **PU CS Board Exam PYQs** with model answers. Practice writing these by hand on paper — that's how the real exam works. I've highlighted the practice section.`,
          data: pyqs,
          focusElements: [PAGE_FOCUS_MAP.pyq_bank],
        };
      }
      break;

    case 'find_gap':
      if (stage.includes('pu') || stage === '10th') {
        const gap = getPuSyllabusGapAnalysis();
        response = {
          botReply: `**PU CS Syllabus Gap Analysis**: Your college teaches only **30%** of what industry actually needs. The biggest gaps: DSA problem-solving, Git/GitHub, modern web development, and domain awareness. Let me show you what to self-study.`,
          data: gap,
          focusElements: [],
        };
      } else if (stage.includes('diploma')) {
        const gap = getDiplomaSyllabusGapAnalysis();
        response = {
          botReply: `**Diploma CS Gap Analysis**: Your college covers basic programming and theory, but **misses Git, modern web frameworks, cloud deployment, and real DSA problem-solving**. Self-study is mandatory — here's exactly what to learn and when.`,
          data: gap,
          focusElements: [],
        };
      } else {
        const gap = getEngSemesterGapAnalysis();
        response = {
          botReply: `**Engineering CS Semester-Wise Gap Analysis**: Each semester has specific gaps between what's taught and what's needed. I've mapped them all with actionable "what to do alongside" advice.`,
          data: gap,
          focusElements: [],
        };
      }
      break;

    case 'find_resource':
      if (stage.includes('diploma')) {
        const resources = getDiplomaResources({});
        response = {
          botReply: `Here are **curated, free, verified resources** for Diploma CS students — from CS50 for foundations to Striver's A2Z DSA for interview prep. All free. No paid courses needed.`,
          data: resources,
          focusElements: [PAGE_FOCUS_MAP.resource_links],
        };
      } else {
        const resources = getPuResources({});
        response = {
          botReply: `Here are **curated, free, Gold-tier resources** for PU CS students — freeCodeCamp, The Odin Project, CS50, HackerRank 30 Days, and KCET PYQ banks. All free. Start today.`,
          data: resources,
          focusElements: [PAGE_FOCUS_MAP.resource_links],
        };
      }
      break;

    case 'find_mentor':
      response = {
        botReply: `I've highlighted the **Senior Mentorship section** on your dashboard. These are verified alumni who walked your exact path and want to help. Their "Top 3 Mistakes to Avoid" cards are gold — read every single one.`,
        focusElements: [PAGE_FOCUS_MAP.mentor_section],
      };
      break;

    case 'navigate_element': {
      const lowerMsg = message.toLowerCase();
      let targetElement = null;

      if (lowerMsg.includes('menu') || lowerMsg.includes('sidebar') || lowerMsg.includes('nav'))
        targetElement = PAGE_FOCUS_MAP.navigation;
      else if (lowerMsg.includes('roadmap') || lowerMsg.includes('plan'))
        targetElement = PAGE_FOCUS_MAP.roadmap;
      else if (lowerMsg.includes('checklist') || lowerMsg.includes('daily') || lowerMsg.includes('task'))
        targetElement = PAGE_FOCUS_MAP.daily_checklist;
      else if (lowerMsg.includes('exam') || lowerMsg.includes('radar') || lowerMsg.includes('alert'))
        targetElement = PAGE_FOCUS_MAP.exam_radar;
      else if (lowerMsg.includes('mentor') || lowerMsg.includes('senior') || lowerMsg.includes('advice'))
        targetElement = PAGE_FOCUS_MAP.mentor_section;
      else if (lowerMsg.includes('resource') || lowerMsg.includes('link') || lowerMsg.includes('course'))
        targetElement = PAGE_FOCUS_MAP.resource_links;
      else if (lowerMsg.includes('world') || lowerMsg.includes('badge'))
        targetElement = PAGE_FOCUS_MAP.world_badge;

      if (targetElement) {
        response = {
          botReply: `Found it! I'm highlighting **${targetElement.label}** on your screen right now. Look for the glowing border. 👆`,
          focusElements: [targetElement],
          focusAction: 'HIGHLIGHT_AND_SCROLL',
        };
      } else {
        response = {
          botReply: `I couldn't find that specific element. Try asking me to find: "roadmap", "exam radar", "daily checklist", "mentor section", "navigation sidebar", or "resources".`,
          focusElements: [],
        };
      }
      break;
    }

    case 'check_readiness':
      response = {
        botReply: `To check your placement readiness, I need some data. Tell me:\n• How many DSA problems have you solved?\n• How many projects have you deployed live?\n• Have you done any internships?\n• How many mock interviews have you done?\n• How many system design topics have you studied?\n\nOr use the API: \`/api/v1/horizon/cs-eng/readiness\` with your numbers.`,
        focusElements: [],
      };
      break;

    case 'lateral_entry':
      const guide = getLateralEntryGuide();
      response = {
        botReply: `**Diploma → Engineering Lateral Entry Survival Guide** loaded! You enter B.E 2nd year directly but you skip 1st year fundamentals. Here's the biggest challenges and how to survive them.`,
        data: guide,
        focusElements: [],
      };
      break;

    default:
      response = {
        botReply: `I'm not sure I understood that. Try asking me:\n• "Show me my roadmap"\n• "How do I prepare for KCET?"\n• "Give me practice questions"\n• "What is my college not teaching me?"\n• "Where is the exam radar?"\n• "Am I ready for placements?"\n\nI'm here to guide you through every step of your CS career journey! 🚀`,
        focusElements: [],
      };
  }

  return {
    success: true,
    intent: intentResult,
    userStage: stage,
    currentPage: currentPage || 'world-dashboard',
    ...response,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { processMessage, recognizeIntent, PAGE_FOCUS_MAP, INTENT_PATTERNS };
