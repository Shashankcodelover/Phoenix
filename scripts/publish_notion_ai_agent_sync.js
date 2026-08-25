/**
 * Notion AI Agent & Real-World Dynamic Workflows Sync
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';

const PAGES = {
  PHOENIX: '3bf6f130-e9bd-8127-bc78-e97a3d0772c1',
  UNCLASH: '3bf6f130-e9bd-8139-a57e-f0f8b11b2f3f',
  BUNKR: '3bf6f130-e9bd-8185-9776-c1d3a1d29159',
  FLARE: '3bf6f130-e9bd-8173-96cf-e1c89875752b'
};

async function notionApi(endpoint, method = 'GET', body = null) {
  const url = `https://api.notion.com/v1/${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}

function text(content, annotations = {}) {
  return {
    type: 'text',
    text: { content },
    annotations: {
      bold: Boolean(annotations.bold),
      italic: Boolean(annotations.italic),
      code: Boolean(annotations.code)
    }
  };
}

function bullet(richText) {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'bulleted_list_item', bulleted_list_item: { rich_text: richText } };
}

function callout(richText, emoji = '🤖') {
  if (typeof richText === 'string') richText = [text(richText)];
  return { type: 'callout', callout: { rich_text: richText, icon: { type: 'emoji', emoji } } };
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

async function main() {
  if (!NOTION_TOKEN) {
    console.log('NOTION_TOKEN is empty; skipping Notion sync.');
    return;
  }
  console.log('🚀 Appending AI Agent & Dynamic Real-World Workflow Sign-Offs to Notion...');

  // BUNKR
  await notionApi(`blocks/${PAGES.BUNKR}/children`, 'PATCH', {
    children: [
      toggle('🤖 AUTONOMOUS AI AGENT BOT & DYNAMIC TIMETABLE REORGANIZER', [
        callout('Live Interactive AI Agent Bot embedded with Timetable Reorganizer & Student/Faculty Onboarding Gateway', '🛡️'),
        bullet([text('Autonomous Timetable Parser: ', { bold: true }), text('Ingests unstructured raw timetable text, extracts slots/rooms, detects clashes, and automatically creates modular classroom sections.')]),
        bullet([text('Floating AI Agent Copilot: ', { bold: true }), text('Real-time query resolution for safe bunks, 75% warning radar, and medical leave condonation.')]),
        bullet([text('Zero-Mock Onboarding Modal: ', { bold: true }), text('Captures real university credentials (USN, Roll Number, Phone, Email, Year, Section, Department).')])
      ])
    ]
  });

  // UNCLASH
  await notionApi(`blocks/${PAGES.UNCLASH}/children`, 'PATCH', {
    children: [
      toggle('🤖 AUTONOMOUS PLACEMENT AI COPILOT & COMPANY DRIVE INGESTOR', [
        callout('Live Placement AI Copilot Bot with Gale-Shapley Stable Matching & Recruiter Ingestion', '⚡'),
        bullet([text('Autonomous Company Drive Ingest: ', { bold: true }), text('Parses recruiter JDs, rounds, CTC bands, and maps non-clashing virtual interview rooms automatically.')]),
        bullet([text('Floating Placement AI Copilot: ', { bold: true }), text('Real-time interactive assistance on slot clash resolution, Gale-Shapley proof, and Hungarian panel matching.')]),
        bullet([text('Candidate & Recruiter Onboarding: ', { bold: true }), text('Dynamically registers student USN, CGPA, target skills, and recruiter corporate credentials.')])
      ])
    ]
  });

  // FLARE
  await notionApi(`blocks/${PAGES.FLARE}/children`, 'PATCH', {
    children: [
      toggle('🤖 AI INCIDENT COMMANDER COPILOT & RESPONDER ONBOARDING', [
        callout('Real-time Field Commander AI for SAR Swarms, Hazmat Dispersion & LoRa Mesh Routing', '📡'),
        bullet([text('Field Commander Agent (/agent-chat): ', { bold: true }), text('Real-time guidance for 3D Gaussian plume dispersion, UAV Voronoi search partitions, and START/JumpSTART triage.')]),
        bullet([text('Responder Onboarding Gateway: ', { bold: true }), text('Captures callsigns, agencies, roles, and GPS sector assignments dynamically.')])
      ])
    ]
  });

  console.log('✅ Notion AI Agent documentation sync completed!');
}

main().catch(err => console.error('Error in Notion AI sync:', err));
