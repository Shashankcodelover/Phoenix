/**
 * Anti-AI Language Filter & Text Humanizer
 * Cleans AI-generated text to ensure natural, human-sounding tone.
 */

const JARGON_PATTERNS = [
  /\bdelve\b/gi,
  /\brealm\b/gi,
  /\blandscape\b/gi,
  /\btestament\b/gi,
  /\bseamless(?:ly)?\b/gi,
  /\brobust\b/gi,
  /\bgroundbreaking\b/gi,
  /\bever-evolving\b/gi,
  /\bfoster\b/gi,
  /\bpivotal\b/gi,
  /\bsynergy\b/gi,
  /\bgame-changer\b/gi,
  /\bparadigm shift\b/gi,
  /\bunleash\b/gi,
  /\bempower\b/gi
];

function humanizeText(text) {
  if (typeof text !== 'string') return text;

  let cleaned = text;

  // Replace AI buzzwords with natural equivalents
  cleaned = cleaned.replace(/\bdelve into\b/gi, 'explore');
  cleaned = cleaned.replace(/\bdelve\b/gi, 'check');
  cleaned = cleaned.replace(/\brealm of\b/gi, 'field of');
  cleaned = cleaned.replace(/\brealm\b/gi, 'area');
  cleaned = cleaned.replace(/\blandscape\b/gi, 'market');
  cleaned = cleaned.replace(/\btestament to\b/gi, 'proof of');
  cleaned = cleaned.replace(/\bseamlessly\b/gi, 'smoothly');
  cleaned = cleaned.replace(/\bseamless\b/gi, 'smooth');
  cleaned = cleaned.replace(/\brobust\b/gi, 'solid');
  cleaned = cleaned.replace(/\bgroundbreaking\b/gi, 'innovative');
  cleaned = cleaned.replace(/\bever-evolving\b/gi, 'changing');
  cleaned = cleaned.replace(/\bfoster\b/gi, 'build');
  cleaned = cleaned.replace(/\bpivotal\b/gi, 'key');
  cleaned = cleaned.replace(/\bsynergy\b/gi, 'teamwork');
  cleaned = cleaned.replace(/\bgame-changer\b/gi, 'big deal');
  cleaned = cleaned.replace(/\bparadigm shift\b/gi, 'major change');
  cleaned = cleaned.replace(/\bunleash\b/gi, 'unlock');
  cleaned = cleaned.replace(/\bempower\b/gi, 'enable');

  // Strip em-dashes and replace with clean commas/hyphens
  cleaned = cleaned.replace(/—/g, ' - ');

  // Standardize quotes
  cleaned = cleaned.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Clean excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

module.exports = { humanizeText };
