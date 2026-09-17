/**
 * phoenixTopologyService.js
 * Master Career & Hackathon Relational Topology Engine for Project Phoenix
 * Governs 8 Enterprise Arena Nodes and Cross-Arena Interoperability Corridors.
 * Provides: Cascading Deletions, Batch Ingestion (RFC 4180 CSV & Strict JSON),
 * 1-Click Sever/Restore Controls, Live Telemetry, and Universal Cascade Purge.
 */

const DEFAULT_ARENA_NODES = [
  {
    id: 'NODE-HORIZON',
    name: 'Horizon Career Pathways',
    tier: 'Enterprise Flagship',
    category: 'Admissions & Rank Matrix',
    status: 'ACTIVE',
    sla: '99.99%',
    latency: 8,
    version: 'v27.0.0',
    evaluations: 4200,
    routeUrl: '/horizon/world-dashboard.html'
  },
  {
    id: 'NODE-PLACEMENT',
    name: 'Placement Accelerator OS',
    tier: 'Enterprise Flagship',
    category: 'FAANG & System Design',
    status: 'ACTIVE',
    sla: '99.99%',
    latency: 6,
    version: 'v27.0.0',
    evaluations: 3850,
    routeUrl: '/interview-prep/roadmap.html'
  },
  {
    id: 'NODE-CHAOS',
    name: 'System Design Chaos Lab',
    tier: 'Mission-Critical',
    category: 'Chaos & Fault Simulator',
    status: 'ACTIVE',
    sla: '99.999%',
    latency: 4,
    version: 'v27.0.0',
    evaluations: 1940,
    routeUrl: '/interview-prep/system-design.html'
  },
  {
    id: 'NODE-HACKATHON',
    name: 'Hackathon Command OS',
    tier: 'Enterprise Flagship',
    category: 'Command Center & RAG',
    status: 'ACTIVE',
    sla: '99.98%',
    latency: 7,
    version: 'v27.0.0',
    evaluations: 2410,
    routeUrl: '/hackathon-agent/command-center.html'
  },
  {
    id: 'NODE-JUDGE',
    name: 'AI Judge Defense Panel',
    tier: 'Mission-Critical',
    category: 'Autonomous Rubric Engine',
    status: 'ACTIVE',
    sla: '99.99%',
    latency: 6,
    version: 'v27.0.0',
    evaluations: 1820,
    routeUrl: '/hackathon-agent/judge-defense.html'
  },
  {
    id: 'NODE-WHITEBOARD',
    name: 'Real-Time CRDT Canvas',
    tier: 'Production',
    category: 'Collaborative Whiteboard',
    status: 'ACTIVE',
    sla: '99.95%',
    latency: 9,
    version: 'v26.5.0',
    evaluations: 1650,
    routeUrl: '/interview-prep/whiteboard.html'
  },
  {
    id: 'NODE-VOICECOACH',
    name: 'Voice AI Fluency Radar',
    tier: 'Production',
    category: 'Multi-Modal Voice Coach',
    status: 'ACTIVE',
    sla: '99.96%',
    latency: 11,
    version: 'v26.8.0',
    evaluations: 2900,
    routeUrl: '/interview-prep/voice-coach.html'
  },
  {
    id: 'NODE-ENTERPRISE',
    name: 'Recruiter Sovereign Ledger',
    tier: 'Mission-Critical',
    category: 'Verifiable Credentials',
    status: 'ACTIVE',
    sla: '99.999%',
    latency: 5,
    version: 'v27.0.0',
    evaluations: 1580,
    routeUrl: '/enterprise/dashboard.html'
  }
];

const DEFAULT_CORRIDORS = [
  {
    id: 'CORR-PHX-01',
    source: 'NODE-HORIZON',
    target: 'NODE-PLACEMENT',
    protocol: 'mTLS-gRPC',
    bandwidth: '10 Gbps',
    latency: 8,
    status: 'CONNECTED',
    integrityScore: 0.999,
    description: 'Synchronizes collegiate rank predictive matrix with technical placement tracks'
  },
  {
    id: 'CORR-PHX-02',
    source: 'NODE-PLACEMENT',
    target: 'NODE-CHAOS',
    protocol: 'WebSocket-Mesh',
    bandwidth: '25 Gbps',
    latency: 4,
    status: 'CONNECTED',
    integrityScore: 0.999,
    description: 'Direct streaming of distributed network partition tests into FAANG architecture lab'
  },
  {
    id: 'CORR-PHX-03',
    source: 'NODE-HACKATHON',
    target: 'NODE-JUDGE',
    protocol: 'PQC-Channel',
    bandwidth: '40 Gbps',
    latency: 6,
    status: 'CONNECTED',
    integrityScore: 0.998,
    description: 'Autonomous hackathon pitch verification against multi-agent judge deliberator'
  },
  {
    id: 'CORR-PHX-04',
    source: 'NODE-WHITEBOARD',
    target: 'NODE-PLACEMENT',
    protocol: 'WebSocket-Mesh',
    bandwidth: '10 Gbps',
    latency: 7,
    status: 'CONNECTED',
    integrityScore: 0.996,
    description: 'Real-time CRDT whiteboard stroke replication during live technical interview rounds'
  },
  {
    id: 'CORR-PHX-05',
    source: 'NODE-VOICECOACH',
    target: 'NODE-ENTERPRISE',
    protocol: 'mTLS-gRPC',
    bandwidth: '15 Gbps',
    latency: 11,
    status: 'CONNECTED',
    integrityScore: 0.997,
    description: 'Voice cadence, sentiment arc, and STAR response telemetry feeds recruiter talent ledger'
  },
  {
    id: 'CORR-PHX-06',
    source: 'NODE-HACKATHON',
    target: 'NODE-HORIZON',
    protocol: 'REST-Webhook',
    bandwidth: '5 Gbps',
    latency: 12,
    status: 'CONNECTED',
    integrityScore: 0.995,
    description: 'Hackathon sponsor bounties and open SDK challenges mapped directly into career portfolios'
  }
];

class PhoenixTopologyService {
  constructor() {
    this.nodes = new Map();
    this.corridors = new Map();
    this.resetTopology();
  }

  resetTopology() {
    this.nodes.clear();
    this.corridors.clear();

    for (const n of DEFAULT_ARENA_NODES) {
      this.nodes.set(n.id, { ...n });
    }

    for (const c of DEFAULT_CORRIDORS) {
      this.corridors.set(c.id, { ...c });
    }
  }

  // ── ARENA NODES ──
  getNodes() {
    return Array.from(this.nodes.values());
  }

  getNode(id) {
    return this.nodes.get(String(id).trim().toUpperCase()) || null;
  }

  addNode(data) {
    if (!data.id || !data.name) {
      throw new Error('Arena node id and name are required');
    }
    const cleanId = String(data.id).trim().toUpperCase();
    if (this.nodes.has(cleanId)) {
      throw new Error(`Arena node ${cleanId} already exists`);
    }

    const node = {
      id: cleanId,
      name: String(data.name).trim(),
      tier: data.tier || 'Production',
      category: data.category || 'Career Acceleration',
      status: data.status || 'ACTIVE',
      sla: data.sla || '99.9%',
      latency: Number(data.latency) || 10,
      version: data.version || 'v1.0.0',
      evaluations: Number(data.evaluations) || 500,
      routeUrl: data.routeUrl || '/dashboard/dashboard.html'
    };

    this.nodes.set(cleanId, node);
    return node;
  }

  /**
   * CASCADING DELETION:
   * Dropping an arena node automatically purges all connected corridors.
   */
  deleteNode(id) {
    const cleanId = String(id).trim().toUpperCase();
    if (!this.nodes.has(cleanId)) {
      return { success: false, error: `Arena node ${cleanId} not found` };
    }

    const deletedNode = this.nodes.get(cleanId);
    this.nodes.delete(cleanId);

    const droppedCorridors = [];
    for (const [corrId, corr] of this.corridors.entries()) {
      if (corr.source === cleanId || corr.target === cleanId) {
        droppedCorridors.push({ ...corr });
        this.corridors.delete(corrId);
      }
    }

    return {
      success: true,
      deletedNode,
      droppedCorridors,
      droppedCount: droppedCorridors.length
    };
  }

  // ── CORRIDORS ──
  getCorridors() {
    return Array.from(this.corridors.values());
  }

  getCorridor(id) {
    return this.corridors.get(String(id).trim().toUpperCase()) || null;
  }

  addCorridor(data) {
    if (!data.id || !data.source || !data.target) {
      throw new Error('Corridor id, source, and target are required');
    }
    const cleanId = String(data.id).trim().toUpperCase();
    const source = String(data.source).trim().toUpperCase();
    const target = String(data.target).trim().toUpperCase();

    if (this.corridors.has(cleanId)) {
      throw new Error(`Corridor ${cleanId} already exists`);
    }
    if (!this.nodes.has(source)) {
      throw new Error(`Source arena node ${source} does not exist in topology`);
    }
    if (!this.nodes.has(target)) {
      throw new Error(`Target arena node ${target} does not exist in topology`);
    }
    if (source === target) {
      throw new Error('Corridor source and target cannot be the same arena node');
    }

    const corridor = {
      id: cleanId,
      source,
      target,
      protocol: data.protocol || 'mTLS-gRPC',
      bandwidth: data.bandwidth || '10 Gbps',
      latency: Number(data.latency) || 8,
      status: data.status || 'CONNECTED',
      integrityScore: Number(data.integrityScore) || 0.995,
      description: data.description || `Career mesh corridor ${source} <-> ${target}`
    };

    this.corridors.set(cleanId, corridor);
    return corridor;
  }

  severCorridor(id) {
    const cleanId = String(id).trim().toUpperCase();
    const corridor = this.corridors.get(cleanId);
    if (!corridor) {
      throw new Error(`Corridor ${cleanId} not found`);
    }
    corridor.status = 'SEVERED';
    corridor.integrityScore = 0.0;
    return corridor;
  }

  restoreCorridor(id) {
    const cleanId = String(id).trim().toUpperCase();
    const corridor = this.corridors.get(cleanId);
    if (!corridor) {
      throw new Error(`Corridor ${cleanId} not found`);
    }
    corridor.status = 'CONNECTED';
    corridor.integrityScore = 0.998;
    return corridor;
  }

  deleteCorridor(id) {
    const cleanId = String(id).trim().toUpperCase();
    const corridor = this.corridors.get(cleanId);
    if (!corridor) {
      return { success: false, error: `Corridor ${cleanId} not found` };
    }
    this.corridors.delete(cleanId);
    return { success: true, deletedCorridor: corridor };
  }

  // ── TELEMETRY ──
  getTelemetry() {
    const totalCorridors = this.corridors.size;
    let connectedCorridors = 0;
    let totalLatency = 0;
    let totalIntegrity = 0;

    for (const c of this.corridors.values()) {
      if (c.status === 'CONNECTED') {
        connectedCorridors++;
        totalIntegrity += (c.integrityScore || 0.99);
      }
      totalLatency += (c.latency || 8);
    }

    const avgLatency = totalCorridors > 0 ? Math.round(totalLatency / totalCorridors) : 0;
    const avgIntegrity = totalCorridors > 0 ? (totalIntegrity / totalCorridors) * 100 : 100;

    let totalEvals = 0;
    for (const n of this.nodes.values()) {
      totalEvals += (n.evaluations || 0);
    }

    return {
      governedNodes: this.nodes.size,
      activeCorridors: connectedCorridors,
      totalCorridors: totalCorridors,
      pipelineSecurityIntegrity: parseFloat(avgIntegrity.toFixed(1)),
      interArenaLatencySLA: `${avgLatency}ms (Sub-20ms SLA)`,
      totalEvaluations: `${totalEvals.toLocaleString()}+ Candidates Evaluated`,
      systemHealth: connectedCorridors === totalCorridors && totalCorridors > 0 ? 'OPTIMAL' : 'ATTENTION_REQUIRED'
    };
  }

  // ── BATCH INGESTION (RFC 4180 CSV / STRICT JSON) ──
  parseRFC4180CSV(csvText) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentLine.push(currentField.trim());
          currentField = '';
        } else if (char === '\r') {
          // ignore CR
        } else if (char === '\n') {
          currentLine.push(currentField.trim());
          if (currentLine.some(f => f.length > 0)) {
            lines.push(currentLine);
          }
          currentLine = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
    }

    if (currentField.length > 0 || currentLine.length > 0) {
      currentLine.push(currentField.trim());
      if (currentLine.some(f => f.length > 0)) {
        lines.push(currentLine);
      }
    }

    if (lines.length < 2) {
      throw new Error('CSV must contain a header row and at least one data row');
    }

    const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    const rows = [];

    for (let r = 1; r < lines.length; r++) {
      const rowVals = lines[r];
      const obj = {};
      for (let h = 0; h < headers.length; h++) {
        obj[headers[h]] = rowVals[h] !== undefined ? rowVals[h] : '';
      }
      rows.push(obj);
    }

    return rows;
  }

  ingestBatch(type, format, rawPayload) {
    if (!rawPayload || typeof rawPayload !== 'string' || !rawPayload.trim()) {
      throw new Error('Raw payload is empty');
    }

    let records = [];

    if (format === 'json') {
      try {
        const parsed = JSON.parse(rawPayload);
        records = Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        throw new Error(`Invalid JSON format: ${err.message}`);
      }
    } else if (format === 'csv') {
      try {
        records = this.parseRFC4180CSV(rawPayload);
      } catch (err) {
        throw new Error(`CSV Parsing error: ${err.message}`);
      }
    } else {
      throw new Error(`Unsupported format: ${format}. Use 'csv' or 'json'`);
    }

    const results = {
      importedCount: 0,
      errors: [],
      items: []
    };

    if (type === 'nodes') {
      for (let i = 0; i < records.length; i++) {
        const item = records[i];
        try {
          if (!item.id || !item.name) {
            throw new Error(`Row ${i + 1}: Missing id or name`);
          }
          const added = this.addNode(item);
          results.importedCount++;
          results.items.push(added);
        } catch (err) {
          results.errors.push(`Row ${i + 1} (${item.id || 'unknown'}): ${err.message}`);
        }
      }
    } else if (type === 'corridors') {
      for (let i = 0; i < records.length; i++) {
        const item = records[i];
        try {
          if (!item.id || !item.source || !item.target) {
            throw new Error(`Row ${i + 1}: Missing id, source, or target`);
          }
          const added = this.addCorridor(item);
          results.importedCount++;
          results.items.push(added);
        } catch (err) {
          results.errors.push(`Row ${i + 1} (${item.id || 'unknown'}): ${err.message}`);
        }
      }
    } else {
      throw new Error(`Invalid type '${type}'. Must be 'corridors' or 'nodes'`);
    }

    return results;
  }

  // ── UNIVERSAL PURGE ──
  universalPurge(confirmPhrase) {
    if (confirmPhrase !== 'PURGE-ALL-PHOENIX-ENTITIES') {
      throw new Error('Invalid safety confirmation phrase. Exactly enter: PURGE-ALL-PHOENIX-ENTITIES');
    }

    const purgedCorridorsCount = this.corridors.size;
    const purgedNodesCount = this.nodes.size;

    this.corridors.clear();
    this.nodes.clear();

    return {
      success: true,
      purgedCorridors: purgedCorridorsCount,
      purgedNodes: purgedNodesCount,
      timestamp: new Date().toISOString()
    };
  }
}

const phoenixTopologyService = new PhoenixTopologyService();

module.exports = {
  PhoenixTopologyService,
  phoenixTopologyService
};
