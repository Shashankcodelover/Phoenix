/**
 * Phoenix v2.0: AI Humanization Filter Middleware
 * 
 * Inspired by The Hackathon Simulator's anti-AI language filters.
 * Strips AI jargon, emojis, em-dashes, and generic fluff from all
 * LLM-generated responses so text sounds natural and authentic.
 * 
 * Usage: Apply to any Express route that returns AI-generated text.
 *   app.use('/api/v1/prep', humanizeResponse, prepRoutes);
 */

// --- AI Jargon Blocklist ---
// These words/phrases are telltale signs of AI-generated text.
// They make responses sound robotic and inauthentic.
const AI_JARGON = [
  'delve', 'delving', 'delved',
  'realm', 'realms',
  'landscape', 'landscapes',
  'testament',
  'seamless', 'seamlessly',
  'robust', 'robustly',
  'groundbreaking',
  'ever-evolving',
  'foster', 'fostering', 'fostered',
  'pivotal',
  'cutting-edge',
  'leveraging', 'leverage',
  'synergy', 'synergies',
  'paradigm', 'paradigm shift',
  'holistic', 'holistically',
  'multifaceted',
  'spearheading', 'spearheaded',
  'navigate', 'navigating',
  'tapestry',
  'embark', 'embarking', 'embarked',
  'resonate', 'resonating', 'resonates',
  'underscores',
  'game-changer',
  'thought-provoking',
  'nuanced',
  'intricate',
  'endeavor', 'endeavors',
  'meticulous', 'meticulously',
  'commendable',
  'noteworthy',
  'instrumental',
  'unparalleled',
  'utmost',
  'paramount',
  'indispensable'
];

// Replacement map: AI jargon → natural alternatives
const REPLACEMENTS = {
  'delve': 'dig into',
  'delving': 'digging into',
  'delved': 'dug into',
  'realm': 'area',
  'realms': 'areas',
  'landscape': 'space',
  'landscapes': 'spaces',
  'testament': 'proof',
  'seamless': 'smooth',
  'seamlessly': 'smoothly',
  'robust': 'strong',
  'robustly': 'strongly',
  'groundbreaking': 'innovative',
  'ever-evolving': 'changing',
  'foster': 'build',
  'fostering': 'building',
  'fostered': 'built',
  'pivotal': 'key',
  'cutting-edge': 'modern',
  'leveraging': 'using',
  'leverage': 'use',
  'synergy': 'teamwork',
  'synergies': 'collaborations',
  'paradigm': 'model',
  'paradigm shift': 'major change',
  'holistic': 'complete',
  'holistically': 'completely',
  'multifaceted': 'complex',
  'spearheading': 'leading',
  'spearheaded': 'led',
  'navigate': 'work through',
  'navigating': 'working through',
  'tapestry': 'mix',
  'embark': 'start',
  'embarking': 'starting',
  'embarked': 'started',
  'resonate': 'connect',
  'resonating': 'connecting',
  'resonates': 'connects',
  'underscores': 'highlights',
  'game-changer': 'breakthrough',
  'thought-provoking': 'interesting',
  'nuanced': 'detailed',
  'intricate': 'complex',
  'endeavor': 'effort',
  'endeavors': 'efforts',
  'meticulous': 'careful',
  'meticulously': 'carefully',
  'commendable': 'good',
  'noteworthy': 'notable',
  'instrumental': 'important',
  'unparalleled': 'exceptional',
  'utmost': 'highest',
  'paramount': 'critical',
  'indispensable': 'essential'
};

// --- Fluff Sentence Patterns ---
// Generic filler sentences that add zero value
const FLUFF_PATTERNS = [
  /this is a great opportunity to .*/gi,
  /in today's fast-paced world.*/gi,
  /it's worth noting that/gi,
  /it is important to note that/gi,
  /in conclusion,?\s*/gi,
  /overall,?\s+this\s+(is|was|has been)\s+a\s+(great|wonderful|fantastic)/gi,
  /without further ado/gi,
  /at the end of the day/gi,
  /last but not least/gi
];

/**
 * Strips AI jargon and replaces with natural alternatives.
 * Preserves the original casing pattern (lowercase, Title, UPPER).
 */
function stripJargon(text) {
  let result = text;

  for (const [jargon, replacement] of Object.entries(REPLACEMENTS)) {
    // Build a regex that matches the jargon as a whole word, case-insensitive
    const regex = new RegExp(`\\b${escapeRegex(jargon)}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Preserve original casing
      if (match === match.toUpperCase()) return replacement.toUpperCase();
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  return result;
}

/**
 * Removes em-dashes and replaces with commas or hyphens.
 */
function cleanEmDashes(text) {
  // Replace em-dash (—) and en-dash (–) with comma-space or hyphen
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ' - ')
    .replace(/\u2014/g, ', ')  // Unicode em-dash
    .replace(/\u2013/g, ' - '); // Unicode en-dash
}

/**
 * Converts curly/smart quotes to straight quotes.
 */
function normalizeQuotes(text) {
  return text
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')  // Double quotes
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'"); // Single quotes
}

/**
 * Strips emojis from text (keeps text-based emoticons like :) ).
 */
function stripEmojis(text) {
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
    ''
  ).replace(/\s{2,}/g, ' ').trim();
}

/**
 * Removes generic fluff sentences that say nothing useful.
 */
function stripFluff(text) {
  let result = text;
  for (const pattern of FLUFF_PATTERNS) {
    result = result.replace(pattern, '');
  }
  // Clean up any double spaces or empty lines left behind
  return result.replace(/\n{3,}/g, '\n\n').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Removes markdown bold wrappers (**text** → text) when used excessively.
 * Keeps bold if used sparingly (< 5 instances).
 */
function cleanExcessiveBold(text) {
  const boldCount = (text.match(/\*\*/g) || []).length / 2;
  if (boldCount > 8) {
    // Too many bold items — strip them all
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }
  return text;
}

/**
 * Main humanization pipeline — runs all filters in sequence.
 */
function humanize(text) {
  if (!text || typeof text !== 'string') return text;

  let result = text;
  result = stripJargon(result);
  result = cleanEmDashes(result);
  result = normalizeQuotes(result);
  result = stripEmojis(result);
  result = stripFluff(result);
  result = cleanExcessiveBold(result);

  return result;
}

/**
 * Recursively humanizes all string values in an object or array.
 * This allows the middleware to process complex JSON responses.
 */
function humanizeDeep(obj) {
  if (typeof obj === 'string') return humanize(obj);
  if (Array.isArray(obj)) return obj.map(item => humanizeDeep(item));
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = humanizeDeep(value);
    }
    return result;
  }
  return obj;
}

/**
 * Express middleware that intercepts JSON responses and applies humanization.
 * Hooks into res.json() to filter AI-generated text before sending to client.
 */
const humanizeResponse = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    try {
      const humanized = humanizeDeep(body);
      return originalJson(humanized);
    } catch (err) {
      // If humanization fails, send original response
      console.error('Humanizer middleware error:', err.message);
      return originalJson(body);
    }
  };

  next();
};

// Utility: escape special regex characters in a string
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { humanize, humanizeDeep, humanizeResponse };
