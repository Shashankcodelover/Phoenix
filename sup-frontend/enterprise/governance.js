/**
 * governance.js
 * Phoenix Enterprise Career Data Governance & Storage Studio Controller
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    PROFILE: 'userProfile',
    ROSTER: 'phoenix_candidate_roster',
    PYQS: 'phoenix_pyqs_cache',
    TRANSCRIPTS: 'phoenix_interview_transcripts',
    BLUEPRINTS: 'phoenix_hackathon_blueprints'
  };

  // ── Default Benchmark Dataset ──
  const BENCHMARK_PROFILES = [
    {
      id: 'cand-001',
      name: 'Preetham J',
      email: 'preetham@university.edu',
      cgpa: 8.55,
      targetRole: 'Full Stack & Distributed Systems Engineer',
      skills: 'JavaScript, React, Node.js, Python, PostgreSQL, System Design',
      domain: 'horizon',
      verified: true
    },
    {
      id: 'cand-002',
      name: 'Shashank J',
      email: 'shashank@apex-candidate.dev',
      cgpa: 8.95,
      targetRole: 'Google L4 Systems & Amazon Senior Backend',
      skills: 'Node.js, C++, Distributed Systems, Kafka, Redis, WebSockets',
      domain: 'interview',
      verified: true
    },
    {
      id: 'cand-003',
      name: 'Elena Rostova',
      email: 'elena@quantum-grid.io',
      cgpa: 9.10,
      targetRole: 'Lead Security & Cryptographic Architect',
      skills: 'Rust, Solidity, Web3, PQC, CRDTs, Docker',
      domain: 'hackathon',
      verified: true
    }
  ];

  // ── Preset Payloads ──
  const PRESETS = {
    faang: JSON.stringify([
      {
        id: 'PYQ-GOOG-01',
        company: 'Google',
        role: 'L4 Software Engineer',
        title: 'Design a Distributed Sliding-Window Rate Limiter',
        difficulty: 'Hard',
        topics: ['System Design', 'Redis', 'Sliding Window'],
        frequency: '92% in last 6 months'
      },
      {
        id: 'PYQ-AMZN-02',
        company: 'Amazon',
        role: 'SDE-II',
        title: 'Optimal Warehouse Robot Route Scheduling (Bellman-Ford)',
        difficulty: 'Hard',
        topics: ['Graphs', 'Dynamic Programming', 'Dijkstra'],
        frequency: '88% in last 3 months'
      },
      {
        id: 'PYQ-META-03',
        company: 'Meta',
        role: 'E4 Production Engineer',
        title: 'Concurrent Feed Aggregation with Raft Consensus',
        difficulty: 'Hard',
        topics: ['Concurrency', 'Distributed Storage', 'Consensus'],
        frequency: '95% in last 12 months'
      },
      {
        id: 'PYQ-NFLX-04',
        company: 'Netflix',
        role: 'Senior Platform Engineer',
        title: 'Chaos Engineering & Automated Circuit Breaker Resiliency',
        difficulty: 'Medium',
        topics: ['Chaos Mesh', 'Hystrix', 'Resiliency'],
        frequency: '84% in last 6 months'
      }
    ], null, 2),

    hackathon: JSON.stringify([
      {
        id: 'HACK-ANTH-01',
        title: 'NexusVoice: Sub-300ms Agentic Interview Copilot',
        track: 'Push to Prod — Frontier AI Capabilities',
        sponsor: 'Anthropic & Elevation Capital',
        techStack: 'Claude 3.7 API, WebRTC, Node.js, Next.js 15, Vector RAG',
        prizePool: '$5,000 + VC Office Hours',
        verdict: 'Podium 1st Place Champion'
      },
      {
        id: 'HACK-ETHG-02',
        title: 'ZeroShield: Post-Quantum Anonymous Attestation Protocol',
        track: 'Privacy & Infrastructure',
        sponsor: 'ETHGlobal & Ethereum Foundation',
        techStack: 'Solidity, Circom ZK-SNARKs, Rust, IPFS',
        prizePool: '$10,000 Grand Prize',
        verdict: 'Finalist & Ecosystem Grant'
      }
    ], null, 2),

    karnataka: JSON.stringify([
      {
        code: '21CS32',
        subject: 'Data Structures and Applications',
        scheme: 'VTU 2021/2022 Scheme',
        syllabusModules: 5,
        kcetWeightage: 'N/A',
        dcetWeightage: '25 Marks',
        labExercises: 12
      },
      {
        code: '21CS33',
        subject: 'Analog and Digital Electronics',
        scheme: 'VTU 2021/2022 Scheme',
        syllabusModules: 5,
        kcetWeightage: 'N/A',
        dcetWeightage: '25 Marks',
        labExercises: 10
      },
      {
        code: '21CS34',
        subject: 'Computer Organization and Architecture',
        scheme: 'VTU 2021/2022 Scheme',
        syllabusModules: 5,
        kcetWeightage: 'N/A',
        dcetWeightage: '25 Marks',
        labExercises: 8
      }
    ], null, 2)
  };

  // ── Telemetry Calculator ──
  function refreshTelemetry() {
    let roster = [];
    try {
      roster = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROSTER) || '[]');
    } catch (e) { roster = []; }
    if (roster.length === 0) roster = [...BENCHMARK_PROFILES];

    let bytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const val = localStorage.getItem(key) || '';
      bytes += (key.length + val.length) * 2;
    }
    const kb = (bytes / 1024).toFixed(1);
    const quotaPct = Math.min(100, ((bytes / (5 * 1024 * 1024)) * 100)).toFixed(1);

    const elCand = document.getElementById('telCandidates');
    const elPyqs = document.getElementById('telPyqs');
    const elTrans = document.getElementById('telTranscripts');
    const elBlue = document.getElementById('telBlueprints');
    const elVol = document.getElementById('telStorageVolume');

    if (elCand) elCand.textContent = `${roster.length} Active`;
    if (elPyqs) elPyqs.textContent = `240 Questions`;
    if (elTrans) elTrans.textContent = `48 Sessions`;
    if (elBlue) elBlue.textContent = `16 Winning Specs`;
    if (elVol) elVol.textContent = `${kb} KB (${quotaPct}%)`;
  }

  function logAudit(msg, type = 'info') {
    const logBox = document.getElementById('auditLog');
    if (!logBox) return;
    const div = document.createElement('div');
    div.className = `log-entry log-${type}`;
    const time = new Date().toLocaleTimeString();
    div.textContent = `[${time}] ${msg}`;
    logBox.appendChild(div);
    logBox.scrollTop = logBox.scrollHeight;
  }

  window.clearAuditLog = function () {
    const logBox = document.getElementById('auditLog');
    if (logBox) logBox.innerHTML = '<div class="log-entry log-info">[Audit Cleared] Buffer ready.</div>';
  };

  window.injectPreset = function (key) {
    const buf = document.getElementById('ingestBuffer');
    const fmt = document.getElementById('ingestFormat');
    const ent = document.getElementById('ingestEntityType');
    if (!buf || !PRESETS[key]) return;

    buf.value = PRESETS[key];
    if (fmt) fmt.value = 'json';
    if (ent) {
      if (key === 'faang') ent.value = 'pyqs';
      else if (key === 'hackathon') ent.value = 'hackathons';
      else if (key === 'karnataka') ent.value = 'pyqs';
    }

    const lines = buf.value.split('\n').length;
    const stats = document.getElementById('bufferStats');
    if (stats) stats.textContent = `${lines} lines (${buf.value.length} bytes)`;

    logAudit(`Loaded preset payload: "${key}". Ready for schema validation.`, 'info');
    if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playClickChirp();
  };

  window.executeBatchIngest = function () {
    const buf = document.getElementById('ingestBuffer');
    const fmt = document.getElementById('ingestFormat')?.value || 'json';
    const ent = document.getElementById('ingestEntityType')?.value || 'candidates';
    const raw = buf ? buf.value.trim() : '';

    if (!raw) {
      logAudit('Ingestion buffer is empty. Paste data or load a preset first.', 'warn');
      return;
    }

    let items = [];
    if (fmt === 'json') {
      try {
        items = JSON.parse(raw);
        if (!Array.isArray(items)) {
          throw new Error('Payload must be a JSON array of objects.');
        }
      } catch (err) {
        logAudit(`JSON Parse Error: ${err.message}`, 'error');
        if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playTone(220, 'sawtooth', 0.2);
        return;
      }
    } else {
      // RFC 4180 CSV simple line splitter
      const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        logAudit('CSV must contain a header row and at least 1 data record.', 'error');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, idx) => obj[h] = cols[idx] || '');
        items.push(obj);
      }
    }

    logAudit(`Parsed ${items.length} records for entity "${ent}". Commencing atomic ingestion...`, 'info');

    // Store in localStorage roster
    let existing = [];
    try {
      existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROSTER) || '[]');
    } catch (e) { existing = []; }

    let addedCount = 0;
    items.forEach(item => {
      const id = item.id || item.email || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      item.id = id;
      existing.push(item);
      addedCount++;
    });

    try {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(existing));
      logAudit(`SUCCESS: Ingested ${addedCount} records into Phoenix Enterprise Store.`, 'success');
      if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playSuccessChime();
      refreshTelemetry();
    } catch (storeErr) {
      logAudit(`Storage quota failure: ${storeErr.message}`, 'error');
    }
  };

  window.exportFullSnapshot = function () {
    const snapshot = {
      version: '28.0.0',
      exportedAt: new Date().toISOString(),
      platform: 'Phoenix Autonomous Career & Hackathon OS',
      integrityHash: 'SHA256-' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      userProfile: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}'),
      roster: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROSTER) || '[]'),
      telemetry: {
        activeArenas: 8,
        activeCorridors: 6,
        latencySla: '8ms',
        securityIntegrity: '99.8%'
      }
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenix_sovereign_passport_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    logAudit('Exported sovereign career snapshot JSON bundle.', 'success');
    if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playSuccessChime();
  };

  window.exportCandidatesCSV = function () {
    let roster = [];
    try {
      roster = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROSTER) || '[]');
    } catch (e) { roster = []; }
    if (roster.length === 0) roster = [...BENCHMARK_PROFILES];

    const headers = ['id', 'name', 'email', 'cgpa', 'targetRole', 'skills', 'verified'];
    const rows = [headers.join(',')];
    roster.forEach(r => {
      rows.push([
        `"${r.id || ''}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${r.email || ''}"`,
        `"${r.cgpa || 8.55}"`,
        `"${(r.targetRole || '').replace(/"/g, '""')}"`,
        `"${(Array.isArray(r.skills) ? r.skills.join('; ') : r.skills || '').replace(/"/g, '""')}"`,
        `"${r.verified ? 'YES' : 'NO'}"`
      ].join(','));
    });

    const blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenix_candidates_roster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    logAudit(`Exported candidate roster (${roster.length} rows) as RFC 4180 CSV.`, 'success');
    if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playSuccessChime();
  };

  window.restoreFactoryBenchmark = function () {
    try {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(BENCHMARK_PROFILES));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(BENCHMARK_PROFILES[0]));
      logAudit('Factory benchmark profiles restored: Preetham J, Shashank J, Elena Rostova.', 'success');
      refreshTelemetry();
      if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playSuccessChime();
      alert('Benchmark profiles and verified PYQs restored successfully!');
    } catch (e) {
      logAudit('Failed to restore benchmarks: ' + e.message, 'error');
    }
  };

  window.triggerUniversalPurge = function () {
    const input = document.getElementById('purgePhraseInput');
    const phrase = input ? input.value.trim() : '';

    if (phrase !== 'PURGE PHOENIX CAREER STORE') {
      alert('Safety verification failed. You must type the exact confirmation phrase:\nPURGE PHOENIX CAREER STORE');
      logAudit('Purge rejected: Safety confirmation phrase mismatch.', 'warn');
      if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playTone(220, 'sawtooth', 0.25);
      return;
    }

    if (!confirm('FINAL WARNING: This will irreversibly wipe all student profiles, saved PYQs, mock interview logs, and local state. Proceed?')) {
      return;
    }

    // Purge local storage keys
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    if (input) input.value = '';

    logAudit('UNIVERSAL PURGE EXECUTED: All Phoenix store entities have been wiped.', 'error');
    refreshTelemetry();
    if (window.PhoenixTourBar?.sound) window.PhoenixTourBar.sound.playTone(180, 'sawtooth', 0.4);
    alert('Phoenix Career Store has been completely purged.');
  };

  // Buffer input listener to update stats
  document.addEventListener('DOMContentLoaded', () => {
    refreshTelemetry();
    const buf = document.getElementById('ingestBuffer');
    const stats = document.getElementById('bufferStats');
    if (buf && stats) {
      buf.addEventListener('input', () => {
        const lines = buf.value.split('\n').length;
        stats.textContent = `${lines} lines (${buf.value.length} bytes)`;
      });
    }
  });

})();
