/**
 * mesh.js
 * Client-Side Controller for Phoenix Career & Hackathon Relational Topology Mesh
 */

let topologyState = {
  nodes: [],
  corridors: [],
  telemetry: {}
};

async function fetchTopologyData() {
  try {
    const res = await fetch('/api/v1/topology/overview');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    topologyState = data;
    renderUI();
  } catch (err) {
    console.warn('[Phoenix Mesh] API offline or static mode, using local fallback:', err.message);
    loadOfflineFallback();
  }
}

function updateTelemetryUI(tel) {
  if (!tel) return;
  const kpiCorr = document.getElementById('kpiActiveCorridors');
  const kpiSec = document.getElementById('kpiSecurityIntegrity');
  const kpiNodes = document.getElementById('kpiGovernedNodes');
  const kpiLat = document.getElementById('kpiLatencySla');
  const kpiEval = document.getElementById('kpiEvaluations');

  if (kpiCorr) kpiCorr.textContent = `${tel.activeCorridors} / ${tel.totalCorridors} Active`;
  if (kpiSec) kpiSec.textContent = `${tel.pipelineSecurityIntegrity}% PQC`;
  if (kpiNodes) kpiNodes.textContent = `${tel.governedNodes} Systems`;
  if (kpiLat) kpiLat.textContent = tel.interArenaLatencySLA || '8ms (Sub-20ms SLA)';
  if (kpiEval) kpiEval.textContent = tel.totalEvaluations || '12,400+ Candidates';

  const corrBadge = document.getElementById('corridorsBadgeCount');
  if (corrBadge) corrBadge.textContent = tel.totalCorridors || topologyState.corridors.length;
  const nodesBadge = document.getElementById('nodesBadgeCount');
  if (nodesBadge) nodesBadge.textContent = tel.governedNodes || topologyState.nodes.length;
}

function renderCorridorsTable(corridors) {
  const tbody = document.getElementById('corridorsTableBody');
  if (!tbody) return;

  if (!corridors || corridors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No active corridors in topology mesh. Provision a corridor or ingest batch data.</td></tr>`;
    return;
  }

  tbody.innerHTML = corridors.map(c => {
    const isConn = c.status === 'CONNECTED';
    const statusHtml = isConn
      ? `<span class="status-badge connected"><i class="fas fa-check-circle"></i> Connected</span>`
      : `<span class="status-badge severed"><i class="fas fa-exclamation-triangle"></i> Severed</span>`;

    const toggleBtn = isConn
      ? `<button class="btn-sever" onclick="severCorridor('${c.id}')"><i class="fas fa-bolt"></i> Sever</button>`
      : `<button class="btn-restore" onclick="restoreCorridor('${c.id}')"><i class="fas fa-sync-alt"></i> Restore</button>`;

    const srcNode = topologyState.nodes.find(n => n.id === c.source);
    const tgtNode = topologyState.nodes.find(n => n.id === c.target);
    const srcName = srcNode ? srcNode.name : c.source;
    const tgtName = tgtNode ? tgtNode.name : c.target;

    return `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${srcName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${c.source}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${tgtName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${c.target}</div>
        </td>
        <td>
          <span style="color: var(--cyan); font-weight: 700;">${c.protocol}</span>
          <span style="font-size: 0.74rem; color: var(--text-muted); margin-left: 6px;">${c.bandwidth}</span>
        </td>
        <td><strong>${c.latency}ms</strong></td>
        <td>${c.status === 'CONNECTED' ? (c.integrityScore * 100).toFixed(1) + '%' : '0.0%'}</td>
        <td>${statusHtml}</td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            ${toggleBtn}
            <button class="btn-drop" onclick="dropCorridor('${c.id}')" title="Drop corridor"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderNodesGrid(nodes) {
  const grid = document.getElementById('nodesGrid');
  if (!grid) return;

  if (!nodes || nodes.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">Zero arena nodes found. Use Reset to restore factory defaults.</div>`;
    return;
  }

  grid.innerHTML = nodes.map(n => {
    return `
      <div class="node-card">
        <div class="node-header">
          <div>
            <div class="node-title">${n.name}</div>
            <div class="node-id">${n.id}</div>
          </div>
          <span class="node-tier-badge">${n.tier}</span>
        </div>
        <div class="node-meta">
          <span><i class="fas fa-tag text-cyan"></i> ${n.category}</span>
          <span><i class="fas fa-shield-alt text-green"></i> SLA ${n.sla}</span>
        </div>
        <div class="node-meta">
          <span><i class="fas fa-tachometer-alt"></i> ${n.latency}ms latency</span>
          <span><i class="fas fa-user-graduate text-cyan"></i> ${n.evaluations.toLocaleString()} evals</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 8px; border-top: 1px dashed var(--border-subtle);">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--cyan);">${n.version}</span>
          <button class="btn-cascade-del" onclick="deleteNode('${n.id}', '${n.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-trash-alt"></i> Cascade Delete Node
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Update modal source/target selects
  const provSource = document.getElementById('provSource');
  const provTarget = document.getElementById('provTarget');
  if (provSource && provTarget) {
    const opts = nodes.map(n => `<option value="${n.id}">${n.name} (${n.id})</option>`).join('');
    provSource.innerHTML = opts;
    provTarget.innerHTML = opts;
    if (nodes.length > 1) {
      provTarget.selectedIndex = 1;
    }
  }
}

function renderUI() {
  updateTelemetryUI(topologyState.telemetry);
  renderCorridorsTable(topologyState.corridors);
  renderNodesGrid(topologyState.nodes);
}

function switchMeshView(view) {
  const corrPanel = document.getElementById('corridorsViewPanel');
  const nodesPanel = document.getElementById('nodesViewPanel');
  const corrBtn = document.getElementById('tabCorridorsBtn');
  const nodesBtn = document.getElementById('tabNodesBtn');

  if (view === 'corridors') {
    if (corrPanel) corrPanel.style.display = 'block';
    if (nodesPanel) nodesPanel.style.display = 'none';
    if (corrBtn) corrBtn.classList.add('active');
    if (nodesBtn) nodesBtn.classList.remove('active');
  } else {
    if (corrPanel) corrPanel.style.display = 'none';
    if (nodesPanel) nodesPanel.style.display = 'block';
    if (corrBtn) corrBtn.classList.remove('active');
    if (nodesBtn) nodesBtn.classList.add('active');
  }
}

// ── 1-Click Controls ──
async function severCorridor(id) {
  try {
    const res = await fetch(`/api/v1/topology/corridors/${encodeURIComponent(id)}/sever`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sever corridor');
    logTerminal(`[SEVER] Corridor ${id} severed. Telemetry updated.`, 'highlight');
    await fetchTopologyData();
  } catch (err) {
    alert('Error severing corridor: ' + err.message);
  }
}

async function restoreCorridor(id) {
  try {
    const res = await fetch(`/api/v1/topology/corridors/${encodeURIComponent(id)}/restore`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restore corridor');
    logTerminal(`[RESTORE] Corridor ${id} restored to full connectivity.`, 'success');
    await fetchTopologyData();
  } catch (err) {
    alert('Error restoring corridor: ' + err.message);
  }
}

async function dropCorridor(id) {
  if (!confirm(`Are you sure you want to drop corridor ${id}?`)) return;
  try {
    const res = await fetch(`/api/v1/topology/corridors/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete corridor');
    logTerminal(`[DROP] Corridor ${id} deleted from topology mesh.`, 'info');
    await fetchTopologyData();
  } catch (err) {
    alert('Error dropping corridor: ' + err.message);
  }
}

// ── Cascading Deletion ──
async function deleteNode(id, name) {
  const msg = `WARNING: Cascading Deletion Triggered!\n\nDeleting arena node "${name}" (${id}) will drop the arena node AND automatically sever and cascade-delete ALL interconnected corridors.\n\nProceed with cascading deletion?`;
  if (!confirm(msg)) return;

  try {
    const res = await fetch(`/api/v1/topology/nodes/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete node');
    logTerminal(`[CASCADE DELETION] Dropped arena node ${id} and ${data.droppedCount} interconnected corridors.`, 'error');
    alert(`Arena node ${name} deleted.\nCascading effect: ${data.droppedCount} interconnected corridors were severed and removed.`);
    await fetchTopologyData();
  } catch (err) {
    alert('Error during cascading deletion: ' + err.message);
  }
}

// ── Provision Modal ──
function openProvisionModal() {
  const modal = document.getElementById('provisionModal');
  if (modal) modal.classList.add('active');
}

function closeProvisionModal() {
  const modal = document.getElementById('provisionModal');
  if (modal) modal.classList.remove('active');
}

async function handleProvisionSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('provId').value;
  const source = document.getElementById('provSource').value;
  const target = document.getElementById('provTarget').value;
  const protocol = document.getElementById('provProtocol').value;
  const bandwidth = document.getElementById('provBandwidth').value;
  const latency = parseInt(document.getElementById('provLatency').value, 10);
  const description = document.getElementById('provDesc').value;

  try {
    const res = await fetch('/api/v1/topology/corridors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, source, target, protocol, bandwidth, latency, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to provision corridor');
    logTerminal(`[PROVISION] Successfully provisioned corridor ${id}: ${source} <-> ${target} (${protocol})`, 'success');
    closeProvisionModal();
    await fetchTopologyData();
  } catch (err) {
    alert('Provisioning Error: ' + err.message);
  }
}

// ── Batch Ingestion Studio ──
function handleFormatChange() {
  const fmt = document.getElementById('ingestFormat').value;
  const badge = document.getElementById('formatBadge');
  if (badge) {
    badge.textContent = fmt === 'csv' ? 'RFC 4180 Compliant' : 'Strict JSON Schema';
  }
}

function loadSampleTemplate() {
  const entity = document.getElementById('ingestTargetEntity').value;
  const format = document.getElementById('ingestFormat').value;
  const buffer = document.getElementById('ingestBuffer');

  if (entity === 'corridors') {
    if (format === 'csv') {
      buffer.value = [
        'id,source,target,protocol,bandwidth,latency,description',
        'CORR-PHX-07,NODE-HORIZON,NODE-CHAOS,WebSocket-Mesh,30 Gbps,5,"Predictive admission rank streaming into chaos simulator"',
        'CORR-PHX-08,NODE-VOICECOACH,NODE-JUDGE,mTLS-gRPC,20 Gbps,9,"Speech fluency and objection handling fed directly into AI judge"',
        'CORR-PHX-09,NODE-WHITEBOARD,NODE-ENTERPRISE,PQC-Channel,50 Gbps,4,"CRDT design artifacts logged as verifiable credentials"'
      ].join('\n');
    } else {
      buffer.value = JSON.stringify([
        {
          id: 'CORR-PHX-JSON-01',
          source: 'NODE-PLACEMENT',
          target: 'NODE-ENTERPRISE',
          protocol: 'mTLS-gRPC',
          bandwidth: '25 Gbps',
          latency: 6,
          description: 'FAANG candidate assessment score piped to recruiter talent pool'
        }
      ], null, 2);
    }
  } else {
    // Nodes
    if (format === 'csv') {
      buffer.value = [
        'id,name,tier,category,status,sla,latency,version,evaluations',
        'NODE-SYNTHEDGE,"SynthEdge Arena, Inc.",Enterprise Flagship,AI Testing / Mock,ACTIVE,99.99%,12,v1.0.0,3200',
        'NODE-QUANTUMARENA,"Quantum Arena Grid, Global",Mission-Critical,Security / Grid,ACTIVE,99.999%,5,v2.0.0,5100'
      ].join('\n');
    } else {
      buffer.value = JSON.stringify([
        {
          id: 'NODE-SYNTHEDGE',
          name: 'SynthEdge Arena, Inc.',
          tier: 'Enterprise Flagship',
          category: 'AI Testing / Mock',
          status: 'ACTIVE',
          sla: '99.99%',
          latency: 12,
          version: 'v1.0.0',
          evaluations: 3200
        }
      ], null, 2);
    }
  }
  logTerminal(`[TEMPLATE] Loaded ${entity} (${format.toUpperCase()}) preset template into buffer.`, 'info');
}

async function executeBatchIngest() {
  const entity = document.getElementById('ingestTargetEntity').value;
  const format = document.getElementById('ingestFormat').value;
  const buffer = document.getElementById('ingestBuffer').value;

  if (!buffer.trim()) {
    alert('Please enter or load payload data into buffer.');
    return;
  }

  logTerminal(`[INGEST] Parsing batch payload for ${entity} (${format.toUpperCase()})...`, 'highlight');

  try {
    const res = await fetch('/api/v1/topology/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: entity, format, data: buffer })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ingest failed');

    logTerminal(`[INGEST SUCCESS] Successfully imported ${data.importedCount} items into mesh.`, 'success');
    if (data.errors && data.errors.length > 0) {
      data.errors.forEach(err => logTerminal(`[REJECTED] ${err}`, 'error'));
    }
    await fetchTopologyData();
  } catch (err) {
    logTerminal(`[INGEST ERROR] ${err.message}`, 'error');
  }
}

function clearTerminal() {
  const term = document.getElementById('terminalLog');
  if (term) term.innerHTML = `<div class="term-line info">[SYSTEM] Terminal cleared. Ready.</div>`;
}

function logTerminal(msg, type = 'info') {
  const term = document.getElementById('terminalLog');
  if (!term) return;
  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = `term-line ${type}`;
  div.textContent = `${time} ${msg}`;
  term.appendChild(div);
  term.scrollTop = term.scrollHeight;
}

// ── Universal Purge & Reset ──
async function triggerUniversalPurge() {
  const input = document.getElementById('purgeConfirmInput');
  const phrase = input ? input.value.trim() : '';

  if (phrase !== 'PURGE-ALL-PHOENIX-ENTITIES') {
    alert('SAFETY REJECTION: You must type PURGE-ALL-PHOENIX-ENTITIES to authorize universal purge.');
    return;
  }

  if (!confirm('FINAL WARNING: This will eradicate all 8 arena nodes and all corridors. Proceed?')) return;

  try {
    const res = await fetch('/api/v1/topology/purge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPhrase: phrase })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Purge failed');

    logTerminal(`[UNIVERSAL PURGE] Eradicated ${data.purgedNodes} arena nodes and ${data.purgedCorridors} corridors.`, 'error');
    if (input) input.value = '';
    alert('Universal Purge Executed: All arena nodes and corridors dropped.');
    await fetchTopologyData();
  } catch (err) {
    alert('Purge Error: ' + err.message);
  }
}

async function restoreFactoryDefaults() {
  if (!confirm('Restore factory default topology (8 arena nodes, 6 corridors)?')) return;
  try {
    const res = await fetch('/api/v1/topology/reset', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Reset failed');
    logTerminal('[RESTORE] Factory topology restored (8 nodes, 6 corridors).', 'success');
    await fetchTopologyData();
  } catch (err) {
    alert('Reset Error: ' + err.message);
  }
}

function syncTopologyData() {
  logTerminal('[SYNC] Syncing topology telemetry...', 'info');
  fetchTopologyData();
}

function loadOfflineFallback() {
  topologyState = {
    nodes: [
      { id: 'NODE-HORIZON', name: 'Horizon Career Pathways', tier: 'Enterprise Flagship', category: 'Admissions & Rank Matrix', status: 'ACTIVE', sla: '99.99%', latency: 8, version: 'v27.0.0', evaluations: 4200 },
      { id: 'NODE-PLACEMENT', name: 'Placement Accelerator OS', tier: 'Enterprise Flagship', category: 'FAANG & System Design', status: 'ACTIVE', sla: '99.99%', latency: 6, version: 'v27.0.0', evaluations: 3850 },
      { id: 'NODE-CHAOS', name: 'System Design Chaos Lab', tier: 'Mission-Critical', category: 'Chaos & Fault Simulator', status: 'ACTIVE', sla: '99.999%', latency: 4, version: 'v27.0.0', evaluations: 1940 },
      { id: 'NODE-HACKATHON', name: 'Hackathon Command OS', tier: 'Enterprise Flagship', category: 'Command Center & RAG', status: 'ACTIVE', sla: '99.98%', latency: 7, version: 'v27.0.0', evaluations: 2410 },
      { id: 'NODE-JUDGE', name: 'AI Judge Defense Panel', tier: 'Mission-Critical', category: 'Autonomous Rubric Engine', status: 'ACTIVE', sla: '99.99%', latency: 6, version: 'v27.0.0', evaluations: 1820 },
      { id: 'NODE-WHITEBOARD', name: 'Real-Time CRDT Canvas', tier: 'Production', category: 'Collaborative Whiteboard', status: 'ACTIVE', sla: '99.95%', latency: 9, version: 'v26.5.0', evaluations: 1650 },
      { id: 'NODE-VOICECOACH', name: 'Voice AI Fluency Radar', tier: 'Production', category: 'Multi-Modal Voice Coach', status: 'ACTIVE', sla: '99.96%', latency: 11, version: 'v26.8.0', evaluations: 2900 },
      { id: 'NODE-ENTERPRISE', name: 'Recruiter Sovereign Ledger', tier: 'Mission-Critical', category: 'Verifiable Credentials', status: 'ACTIVE', sla: '99.999%', latency: 5, version: 'v27.0.0', evaluations: 1580 }
    ],
    corridors: [
      { id: 'CORR-PHX-01', source: 'NODE-HORIZON', target: 'NODE-PLACEMENT', protocol: 'mTLS-gRPC', bandwidth: '10 Gbps', latency: 8, status: 'CONNECTED', integrityScore: 0.999 },
      { id: 'CORR-PHX-02', source: 'NODE-PLACEMENT', target: 'NODE-CHAOS', protocol: 'WebSocket-Mesh', bandwidth: '25 Gbps', latency: 4, status: 'CONNECTED', integrityScore: 0.999 },
      { id: 'CORR-PHX-03', source: 'NODE-HACKATHON', target: 'NODE-JUDGE', protocol: 'PQC-Channel', bandwidth: '40 Gbps', latency: 6, status: 'CONNECTED', integrityScore: 0.998 },
      { id: 'CORR-PHX-04', source: 'NODE-WHITEBOARD', target: 'NODE-PLACEMENT', protocol: 'WebSocket-Mesh', bandwidth: '10 Gbps', latency: 7, status: 'CONNECTED', integrityScore: 0.996 },
      { id: 'CORR-PHX-05', source: 'NODE-VOICECOACH', target: 'NODE-ENTERPRISE', protocol: 'mTLS-gRPC', bandwidth: '15 Gbps', latency: 11, status: 'CONNECTED', integrityScore: 0.997 },
      { id: 'CORR-PHX-06', source: 'NODE-HACKATHON', target: 'NODE-HORIZON', protocol: 'REST-Webhook', bandwidth: '5 Gbps', latency: 12, status: 'CONNECTED', integrityScore: 0.995 }
    ],
    telemetry: {
      governedNodes: 8,
      activeCorridors: 6,
      totalCorridors: 6,
      pipelineSecurityIntegrity: 99.8,
      interArenaLatencySLA: '8ms (Sub-20ms SLA)',
      totalEvaluations: '12,400+ Candidates Evaluated',
      systemHealth: 'OPTIMAL'
    }
  };
  renderUI();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchTopologyData();
});
