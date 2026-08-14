const { describe, it } = require('node:test');
const assert = require('node:assert');

const { MarpPitchDeckEngine } = require('../modules/hackathon-agent/marpPitchDeckEngine');

describe('V24 Quality Focus: Feature 16 — Automated Marp 5-Slide Pitch Deck Engine', () => {
  const engine = new MarpPitchDeckEngine();

  it('generates standard Marp frontmatter Markdown deck across 5 structured slides', () => {
    const deck = engine.generateMarpDeck({
      projectTitle: 'NexusAudio AI',
      tagline: 'Sub-300ms Turn-Taking Voice AI Mock Coach',
      tamFigure: '$14B EdTech Market'
    });

    assert.strictEqual(deck.success, true);
    assert.strictEqual(deck.slideCount, 5);
    assert.ok(deck.marpMarkdown.includes('marp: true'));
    assert.ok(deck.marpMarkdown.includes('theme: gaia'));
    assert.ok(deck.marpMarkdown.includes('# 🚀 NexusAudio AI'));
    assert.ok(deck.marpMarkdown.includes('Slide 2: The Core Problem'));
    assert.ok(deck.marpMarkdown.includes('Slide 3: The NexusAudio Solution'));
    assert.ok(deck.marpMarkdown.includes('Slide 4: Distributed Architecture'));
    assert.ok(deck.marpMarkdown.includes('Slide 5: Unit Economics & Go-To-Market'));
  });

  it('generates a single-file standalone offline HTML presentation with zero npm dependencies', () => {
    const deck = engine.generateMarpDeck({ projectTitle: 'NexusAudio AI' });

    assert.ok(deck.standaloneHtmlPresenter.includes('<!DOCTYPE html>'));
    assert.ok(deck.standaloneHtmlPresenter.includes('slide-container'));
    assert.ok(deck.standaloneHtmlPresenter.includes('Slide 1 of 5'));
    assert.strictEqual(deck.exportOptions.length, 3);
  });
});
