/**
 * Phoenix Horizon Universal Career Foundation & Upcoming Roadmap Publisher
 * Publishes the complete 9-module Horizon Ecosystem, origin story, systemic data,
 * and upcoming feature implementation roadmap directly to Notion.
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const PHOENIX_PAGE_ID = '3bf6f130-e9bd-8127-bc78-e97a3d0772c1';
const HUB_PAGE_ID = '3c56f130-e9bd-8198-86e1-ff5376370ef1';

async function notionApi(endpoint, method = 'GET', body = null, retries = 4) {
  const url = `https://api.notion.com/v1/${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(`Notion API Error [${res.status}]: ${JSON.stringify(json)}`);
      }
      return json;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  [Retry ${attempt}/${retries}] Retrying ${endpoint} after error: ${err.message}`);
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

function text(content, annotations = {}) {
  return {
    type: 'text',
    text: { content },
    annotations: {
      bold: Boolean(annotations.bold),
      italic: Boolean(annotations.italic),
      strikethrough: false,
      underline: false,
      code: Boolean(annotations.code),
      color: annotations.color || 'default'
    }
  };
}

function p(richText) {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'paragraph', paragraph: { rich_text: richText } };
}

function h2(title) {
  return { type: 'heading_2', heading_2: { rich_text: [text(title, { bold: true })] } };
}

function h3(title) {
  return { type: 'heading_3', heading_3: { rich_text: [text(title, { bold: true })] } };
}

function bullet(richText) {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'bulleted_list_item', bulleted_list_item: { rich_text: richText } };
}

function numbered(richText) {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'numbered_list_item', numbered_list_item: { rich_text: richText } };
}

function callout(richText, emoji = '💡') {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'callout', callout: { rich_text: richText, icon: { type: 'emoji', emoji } } };
}

function quote(richText) {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'quote', quote: { rich_text: richText } };
}

function toggle(title, children = []) {
  return {
    type: 'toggle',
    toggle: {
      rich_text: [text(title, { bold: true })],
      children: children.slice(0, 100)
    }
  };
}

async function appendBlocks(parentId, blocks) {
  for (let i = 0; i < blocks.length; i += 100) {
    const chunk = blocks.slice(i, i + 100);
    await notionApi(`blocks/${parentId}/children`, 'PATCH', { children: chunk });
    console.log(`  -> Appended ${chunk.length} blocks to ${parentId}`);
  }
}

async function main() {
  console.log('🚀 Publishing Phoenix Horizon Universal Career Foundation on Notion...');

  // 1. Create Module E Toggle on Project 4: PHOENIX page
  const toggleRes = await notionApi(`blocks/${PHOENIX_PAGE_ID}/children`, 'PATCH', {
    children: [
      toggle('🌅 MODULE E: PHOENIX HORIZON — UNIVERSAL CAREER FOUNDATION & UPCOMING 9-MODULE SUITE', [
        callout('Comprehensive specification of Phoenix Horizon (Universal Career Foundation Ecosystem): Solving the awareness gap for 10th grade, 1st/2nd PU, Diploma, and Early Engineering students with multi-sector roadmaps, competitive exam raders, and PYQ simulators.', '🧭')
      ])
    ]
  });

  const toggleId = toggleRes.results[0].id;

  const horizonContent = [
    h2('1. Origin Story & The Awareness Gap Crisis'),
    quote('Lived Founder Reality: "A student who finishes 1st/2nd PU and clears CET can enter engineering knowing basic Python or C syntax, yet remain completely unaware that DSA, Web Development, Cloud, and System Design are distinct career disciplines. Capability was never the barrier — guidance, roadmap clarity, and mentorship were."'),
    p('Phoenix Horizon fills this systemic national gap by providing an automated, living bridge between early academic crossroads (10th / PU / Diploma) and senior industry execution.'),

    h2('2. Hard Systemic Data (Research-Verified)'),
    bullet([text('90% of Indian students ', { bold: true }), text('choose career paths without professional counselling, relying on peer pressure or blind guessing (India Today).')]),
    bullet([text('Gross Enrolment Ratio (GER) drops ', { bold: true }), text('from 90%+ in middle school to below 60% in Class 11–12 (Extramarks/UNICEF).')]),
    bullet([text('Over 33% of aspiring student innovators ', { bold: true }), text('cite absence of verified senior mentors as their single largest barrier.')]),

    h2('3. The 9 Core Horizon Modules (Upcoming & In-Development)'),
    numbered([text('Module 1: Intelligent Onboarding & Domain Diagnostic — ', { bold: true }), text('3-step diagnostic assessment matching academic stage (10th, PU, Diploma, B.Tech) to personalized learning worlds.')]),
    numbered([text('Module 2: Multi-Sector Domain Roadmaps — ', { bold: true }), text('Curated, verified milestone paths across Tech World (Full-Stack, AI/ML, DevOps, Cyber), Commerce World (CA, CFA, Fintech), Bio World (NEET, Biotech), Electronics World (VLSI, IoT, Robotics), and Arts/Design World.')]),
    numbered([text('Module 3: Daily & Monthly Action Checklists — ', { bold: true }), text('Gamified execution trackers providing exact day-by-day tasks and eliminating procrastination.')]),
    numbered([text('Module 4: Verified Link & Resource Repository — ', { bold: true }), text('100% free, high-signal YouTube playlists, official documentation, and open-source GitHub curricula.')]),
    numbered([text('Module 5: Competitive Exam Radar & Notification Engine — ', { bold: true }), text('Live alerts, syllabus updates, and registration countdowns for KCET, DCET, JEE Main, NEET-UG, CA Foundation, and COMEDK.')]),
    numbered([text('Module 6: PYQ Bank & Mock Exam Simulator — ', { bold: true }), text('500+ categorized previous year questions with timed full-length practice modes and performance analytics.')]),
    numbered([text('Module 7: Senior Alumni Mentorship Bridge — ', { bold: true }), text('Verified senior profiles, "Top 3 Mistakes to Avoid" wisdom cards, and ask-a-senior Q&A channels.')]),
    numbered([text('Module 8: Dynamic Profile & Skill Radar — ', { bold: true }), text('Visual competency charts tracking student mastery across theoretical foundations, projects, and soft skills.')]),
    numbered([text('Module 9: Domain Explorer ("What’s Out There at My Stage?") — ', { bold: true }), text('Interactive catalog allowing students to explore emerging career options before locking in preferences.')]),

    h2('4. Phased Implementation Roadmap'),
    bullet([text('Phase 1 (Database & Models): ', { bold: true }), text('Mongoose horizonModel.js with userStage, selectedWorld, activeRoadmapId, pyqBookmarks.')]),
    bullet([text('Phase 2 (Core Backend Engines): ', { bold: true }), text('diagnosticEngine.js, examRadarEngine.js, pyqDatabase.js, mentorshipEngine.js in sup-backend/modules/horizon/.')]),
    bullet([text('Phase 3 (Frontend UI Portals): ', { bold: true }), text('Glassmorphic Onboarding, Multi-World Dashboard, and PYQ Simulator integrated in phoenix-ui/src/app/vault/horizon/.')])
  ];

  await appendBlocks(toggleId, horizonContent);
  console.log('🎉 Phoenix Horizon 9-Module Ecosystem published to Notion page!');
}

main().catch(err => {
  console.error('❌ Error publishing Horizon Ecosystem:', err);
  process.exit(1);
});
