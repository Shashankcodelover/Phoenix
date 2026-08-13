const { describe, it } = require('node:test');
const assert = require('node:assert');

const { DevpostSubmissionEngine } = require('../modules/hackathon-agent/devpostSubmissionEngine');

describe('V24 Quality Focus: Feature 12 — Automated Devpost Markdown Submission & Badges Generator', () => {
  const engine = new DevpostSubmissionEngine();

  it('generates complete Devpost project story with Shield.io tech badges and key features', () => {
    const submission = engine.generateDevpostSubmission({
      projectTitle: 'NexusAudio AI',
      tagline: 'Sub-300ms Turn-Taking Voice AI Mock Coach',
      tracks: ['AI Track', 'Grand Prize'],
      techStack: ['Next.js 15', 'TailwindCSS v4', 'WebRTC', 'Redis Cluster']
    });

    assert.strictEqual(submission.success, true);
    assert.strictEqual(submission.projectTitle, 'NexusAudio AI');
    assert.ok(submission.techBadgesHtml.includes('img.shields.io'));
    assert.ok(submission.fullDevpostMarkdown.includes('# NexusAudio AI 🚀'));
    assert.ok(submission.fullDevpostMarkdown.includes('### 💡 Inspiration'));
    assert.ok(submission.fullDevpostMarkdown.includes('### ⚡ What It Does'));
    assert.ok(submission.fullDevpostMarkdown.includes('### 🛠️ How We Built It'));
    assert.ok(submission.submissionWordCount > 150);
  });

  it('formats engineering challenges and 90-day post-hackathon roadmap', () => {
    const submission = engine.generateDevpostSubmission({
      projectTitle: 'NexusAudio AI'
    });

    assert.ok(submission.fullDevpostMarkdown.includes('### 🚧 Challenges We Ran Into'));
    assert.ok(submission.fullDevpostMarkdown.includes('### 🔮 What\'s Next for NexusAudio AI'));
    assert.strictEqual(submission.estimatedReadingTime, '3 min read');
  });
});
