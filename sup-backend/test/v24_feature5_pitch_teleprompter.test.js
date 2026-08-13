const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PitchTeleprompterEngine } = require('../modules/hackathon-agent/pitchTeleprompterEngine');

describe('V24 Quality Focus: Feature 5 — 3-Minute Hackathon Pitch Teleprompter & 5-Slide Deck', () => {
  const engine = new PitchTeleprompterEngine();

  it('generates a timed 180-second teleprompter script across 4 progressive phases', () => {
    const teleprompter = engine.generateTeleprompter({
      title: 'NexusAudio',
      tagline: 'Sub-300ms Collaborative Voice IDE with AST Complexity Profiling'
    });

    assert.strictEqual(teleprompter.totalDurationSeconds, 180);
    assert.strictEqual(teleprompter.sections.length, 4);
    assert.ok(teleprompter.sections[0].phase.includes('1. The Hook'));
    assert.ok(teleprompter.sections[1].phase.includes('2. Live Demo'));
    assert.ok(teleprompter.sections[2].phase.includes('3. Technical Architecture'));
    assert.ok(teleprompter.sections[3].phase.includes('4. Market Opportunity'));
    assert.strictEqual(teleprompter.pacingAlarmThresholds.length, 3);
  });

  it('generates a complete 5-Slide Pitch Deck formatted in Markdown for Marp / Slidev', () => {
    const deck = engine.generate5SlideDeck({
      title: 'NexusAudio Platform',
      tagline: 'Autonomous Collaborative Voice IDE',
      teamMembers: 'Shashank J, Alex, Dev',
      demoUrl: 'https://phoenixprep.tech'
    });

    assert.strictEqual(deck.totalSlides, 5);
    assert.strictEqual(deck.slides.length, 5);
    assert.strictEqual(deck.slides[0].title.includes('NexusAudio'), true);
    assert.ok(deck.marpMarkdown.includes('# Slide 1:'));
    assert.ok(deck.marpMarkdown.includes('# Slide 5:'));
  });
});
