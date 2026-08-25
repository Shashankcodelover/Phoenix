/**
 * Notion Executive Quality, Depth & Mathematical Visualizers Master Sync
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

function callout(richText, emoji = '💎') {
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
    console.log('No token provided; skipping.');
    return;
  }

  console.log('>>> Publishing Quality, Depth & Mathematical Visualizer Updates to Notion...');

  // 1. UNCLASH
  await notionApi(`blocks/${PAGES.UNCLASH}/children`, 'PATCH', {
    children: [
      toggle('💎 EXECUTIVE-GRADE MATHEMATICAL VISUALIZER DASHBOARDS & PROOFS', [
        callout('All superficial stubs replaced with multi-section algorithmic visualizers, mathematical proofs, and step-by-step traces.', '💎'),
        bullet([text('Gale-Shapley Stable Marriage Dashboard: ', { bold: true }), text('Full multi-company quota grid, step-by-step proposal trace, and formal proof of zero blocking pairs.')]),
        bullet([text('NSGA-II Pareto Frontier Analyzer: ', { bold: true }), text('Simultaneous 3-objective optimization (Wait Time vs Utilization vs Fatigue Variance) with Karush-Kuhn-Tucker (KKT) knee-point isolation.')]),
        bullet([text('AC-3 Constraint Satisfaction (CSP) Visualizer: ', { bold: true }), text('Interactive timetable grid with domain pruning statistics and MRV degree heuristic execution trace.')]),
        bullet([text('Zero-Knowledge Blind Screening Passport: ', { bold: true }), text('Anonymized HMAC credentials, verified project assertions, and merit-based hiring guarantee.')])
      ])
    ]
  });

  console.log('🎉 Notion Quality & Depth sync complete!');
}

main().catch(err => console.error(err));
