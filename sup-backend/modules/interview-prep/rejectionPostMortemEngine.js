/**
 * Phoenix OS: Pillar 1 • Feature 19
 * Company Rejection Post-Mortem & Gap Tracker Engine
 *
 * Provides diagnostic intake, failure root cause taxonomy, cooldown re-apply
 * countdown calculation, and prescriptive 14-day remediation pathways for
 * candidates who faced FAANG/Tier-1 rejections.
 */

const COMPANY_COOLDOWNS_MONTHS = {
  google: 6,
  meta: 12,
  amazon: 6,
  apple: 6,
  microsoft: 6,
  netflix: 12,
  stripe: 6,
  uber: 6,
  airbnb: 12,
  default: 6
};

const PRESET_DEBRIEFS = [
  {
    id: 'google_l5_sysdesign',
    title: 'Google L5 — System Design (Cache Stampede & Sharding)',
    company: 'Google',
    role: 'Senior Software Engineer (L5)',
    roundType: 'System Design',
    rejectionDate: '2026-08-15',
    failureTags: ['Cache Stampede', 'Database Sharding Hotspots', 'Lack of Backpressure'],
    notes: 'Interviewer asked to design a globally distributed real-time metrics aggregator for YouTube live streams. I failed to properly handle thundering herd cache stampedes when hot video channels spike. The interviewer noted that my consistent hashing scheme caused extreme partition skew and I did not address write backpressure or Kafka consumer lag recovery.'
  },
  {
    id: 'meta_e4_coding',
    title: 'Meta E4 — Coding Round (DP Timeout & Graph Edge Cases)',
    company: 'Meta',
    role: 'Software Engineer II (E4)',
    roundType: 'Coding & Algorithms',
    rejectionDate: '2026-08-20',
    failureTags: ['Time Limit Exceeded', 'Suboptimal Big-O', 'Missed Graph Cycle'],
    notes: 'In problem 2, I was asked to find the minimum cost flight path with at most K stops. I jumped straight to DFS without memoization which resulted in exponential O(2^N) time complexity. When prompted to optimize to Bellman-Ford or BFS with state pruning, I panicked, ran out of time, and forgot to handle directed cycles with negative edge weights.'
  },
  {
    id: 'amazon_sde2_behavioral',
    title: 'Amazon SDE-2 — Bar Raiser (Customer Obsession & Ownership)',
    company: 'Amazon',
    role: 'SDE II',
    roundType: 'Behavioral & Leadership Principles',
    rejectionDate: '2026-08-10',
    failureTags: ['Vague STAR Metrics', 'Defensive Attitude', 'Lack of Ownership'],
    notes: 'During the Bar Raiser round, the interviewer drilled deep into a production outage story. I used "we" throughout the answer instead of specifying what I personally owned. When questioned about why testing did not catch the null pointer exception, I blamed the QA team, violating the Customer Obsession and Ownership leadership principles.'
  }
];

// In-memory ledger of past post-mortems for session tracking
let candidateDebriefHistory = [
  {
    id: 'hist_1',
    company: 'Uber',
    role: 'Software Engineer II',
    roundType: 'Low-Level Design',
    date: '2026-07-10',
    severity: 'MODERATE',
    rootCause: 'Violated Single Responsibility Principle in Ride Matching Service',
    reapplyDate: '2027-01-10',
    status: 'Remediation Active'
  }
];

class RejectionPostMortemEngine {
  /**
   * Get preset test debriefs for quick demonstration
   */
  getPresets() {
    return PRESET_DEBRIEFS;
  }

  /**
   * Analyze interview debrief and construct comprehensive remediation package
   */
  analyzeDebrief(payload = {}) {
    const {
      company = 'Google',
      role = 'Software Engineer',
      roundType = 'System Design',
      rejectionDate = new Date().toISOString().split('T')[0],
      failureTags = [],
      notes = ''
    } = payload;

    const compKey = (company || 'default').toLowerCase().trim();
    const cooldownMonths = COMPANY_COOLDOWNS_MONTHS[compKey] || COMPANY_COOLDOWNS_MONTHS.default;

    // Calculate reapply date
    const rejDateObj = new Date(rejectionDate);
    const validDate = isNaN(rejDateObj.getTime()) ? new Date() : rejDateObj;
    const reapplyDate = new Date(validDate);
    reapplyDate.setMonth(reapplyDate.getMonth() + cooldownMonths);
    const reapplyDateStr = reapplyDate.toISOString().split('T')[0];

    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((reapplyDate - today) / (1000 * 60 * 60 * 24)));

    // Taxonomy & Root Cause Extraction
    const { rootCause, severity, failureTaxonomy, gaps } = this._diagnoseRootCause(roundType, failureTags, notes);

    // 14-Day Prescriptive Remediation Plan
    const remediationPlan = this._buildRemediationPlan(roundType, rootCause, company);

    // Recommended Practice Modules
    const recommendedDrills = this._getRecommendedDrills(roundType, failureTags);

    const postMortemEntry = {
      id: `pm_${Date.now()}`,
      company,
      role,
      roundType,
      rejectionDate: validDate.toISOString().split('T')[0],
      cooldownMonths,
      reapplyDate: reapplyDateStr,
      daysRemaining,
      severity,
      rootCause,
      failureTaxonomy,
      gaps,
      remediationPlan,
      recommendedDrills,
      timestamp: new Date().toISOString()
    };

    // Store in history
    candidateDebriefHistory.unshift({
      id: postMortemEntry.id,
      company: postMortemEntry.company,
      role: postMortemEntry.role,
      roundType: postMortemEntry.roundType,
      date: postMortemEntry.rejectionDate,
      severity: postMortemEntry.severity,
      rootCause: postMortemEntry.rootCause,
      reapplyDate: postMortemEntry.reapplyDate,
      status: 'Remediation Active'
    });

    return {
      success: true,
      data: postMortemEntry
    };
  }

  /**
   * Return candidate post-mortem history with summary statistics
   */
  getHistory() {
    const total = candidateDebriefHistory.length;
    const breakdown = {
      'System Design': candidateDebriefHistory.filter(h => h.roundType.toLowerCase().includes('design')).length,
      'Coding & Algorithms': candidateDebriefHistory.filter(h => h.roundType.toLowerCase().includes('coding') || h.roundType.toLowerCase().includes('algo')).length,
      'Behavioral': candidateDebriefHistory.filter(h => h.roundType.toLowerCase().includes('behavioral') || h.roundType.toLowerCase().includes('star')).length
    };

    return {
      success: true,
      totalEntries: total,
      breakdown,
      history: candidateDebriefHistory
    };
  }

  /**
   * Internal root cause diagnosis
   */
  _diagnoseRootCause(roundType, tags = [], notes = '') {
    const text = `${tags.join(' ')} ${notes}`.toLowerCase();
    let severity = 'MODERATE';
    let rootCause = 'General Inefficiency in Technical Execution';
    const gaps = [];
    const failureTaxonomy = [];

    if (roundType.toLowerCase().includes('system') || text.includes('cache') || text.includes('shard') || text.includes('scale')) {
      failureTaxonomy.push({ category: 'Distributed Architecture', flaw: 'Hotspot Partitioning & Cache Coherence' });
      if (text.includes('cache stampede') || text.includes('thundering herd')) {
        rootCause = 'Vulnerability to Thundering Herd Cache Stampede & Lack of Mutual Exclusion Locking';
        gaps.push('Failed to implement probabilistic early expiration (XFetch) or Redis mutex locks');
        severity = 'CRITICAL';
      } else if (text.includes('sharding') || text.includes('skew')) {
        rootCause = 'Suboptimal Partitioning Key resulting in Hotspot Partition Skew';
        gaps.push('Did not utilize virtual nodes or compound routing keys');
        severity = 'HIGH';
      } else {
        rootCause = 'Insufficient Non-Functional Requirements (SLA/Throughput) Scoping';
        gaps.push('Rushed into architecture without quantifying QPS, network bandwidth, or storage growth');
      }
    } else if (roundType.toLowerCase().includes('coding') || text.includes('timeout') || text.includes('dfs') || text.includes('dp')) {
      failureTaxonomy.push({ category: 'Computational Complexity', flaw: 'Exponential Time Complexity & Lack of Memoization' });
      if (text.includes('timeout') || text.includes('o(2^n)') || text.includes('exponential')) {
        rootCause = 'O(2^N) Branching Factor Exponential Recursion Without Dynamic Programming State Table';
        gaps.push('Missed overlapping subproblem recurrence relation; failed to establish base cases');
        severity = 'CRITICAL';
      } else if (text.includes('cycle') || text.includes('edge case')) {
        rootCause = 'Neglected Directed Cycle Invariant & Boundary Value Conditions';
        gaps.push('Did not test empty arrays, single-node loops, or negative edge weights');
        severity = 'HIGH';
      } else {
        rootCause = 'Suboptimal Data Structure Selection ($O(N)$ lookup vs $O(1)$ Hash Map)';
        gaps.push('Inefficient linear searches inside nested iteration');
      }
    } else {
      failureTaxonomy.push({ category: 'Executive Alignment', flaw: 'Weak Personal Ownership & Ambiguous Impact' });
      if (text.includes('blamed') || text.includes('defensive') || text.includes('ownership')) {
        rootCause = 'Violated Radical Ownership Principle: Externalized Responsibility During Crisis Post-Mortem';
        gaps.push('Attributed production vulnerability to QA team instead of establishing proactive systemic guardrails');
        severity = 'CRITICAL';
      } else if (text.includes('we') || text.includes('vague')) {
        rootCause = 'Passive "We" Narrative Without Quantified Individual Dollar/Latency Impact';
        gaps.push('Lacked measurable STAR metrics (e.g. reduced P99 latency by 45ms or saved $120k/yr)');
        severity = 'HIGH';
      } else {
        rootCause = 'Failure to Articulate Long-Term Trade-offs and Lessons Learned';
        gaps.push('Answer concluded abruptly without continuous improvement takeaway');
      }
    }

    return { rootCause, severity, failureTaxonomy, gaps };
  }

  /**
   * Generate 14-day remediation pathway
   */
  _buildRemediationPlan(roundType, rootCause, company) {
    if (roundType.toLowerCase().includes('system')) {
      return [
        { day: 'Day 1-2', phase: 'Theoretical Foundation', focus: 'Distributed Caching Architectures (Cache-Aside, Write-Through, XFetch & SingleFlight)', task: 'Read ByteByteGo Cache Stampede mitigation papers and review Redis Sentinel failover mechanisms.' },
        { day: 'Day 3-5', phase: 'Deep Dive Architecture', focus: 'Consistent Hashing & Virtual Node Partitioning', task: 'Design a distributed rate limiter and distributed key-value store handling 100k QPS without partition hotspots.' },
        { day: 'Day 6-9', phase: 'Resiliency & Chaos Engineering', focus: 'Backpressure, Circuit Breakers, and Graceful Degradation', task: 'Simulate database replica crash and test Envoy retry policies with exponential backoff and jitter.' },
        { day: 'Day 10-12', phase: 'Full-Scope Mock Simulations', focus: 'End-to-End Latency Estimation & SLA Rigor', task: 'Complete 2 timed 45-minute whiteboard mock interviews on Phoenix System Design Sandbox targeting YouTube/Netflix scale.' },
        { day: 'Day 13-14', phase: 'Executive Bar-Raiser Review', focus: `Company Specific Calibration (${company})`, task: `Calibrate architecture patterns specifically against ${company}\'s published engineering whitepapers and core tech stack.` }
      ];
    } else if (roundType.toLowerCase().includes('coding')) {
      return [
        { day: 'Day 1-2', phase: 'Foundational Recurrence', focus: 'Dynamic Programming State Formulation & Memoization', task: 'Solve 6 1D DP problems (House Robber, Coin Change) strictly proving state transition equations.' },
        { day: 'Day 3-5', phase: '2D & Multi-Dimensional DP', focus: 'Grid Traversal, Edit Distance, and 0/1 Knapsack Variants', task: 'Implement bottom-up tabular optimization and space-reduction from O(M*N) to O(N).' },
        { day: 'Day 6-9', phase: 'Graph Algorithms & Cycle Detection', focus: 'Topological Sort, Tarjan Bridges, and Dijkstra Shortest Path', task: 'Solve 8 graph traversal problems handling edge cases: self-loops, disconnected components, and negative cycles.' },
        { day: 'Day 10-12', phase: 'Time-Boxed Pressure Coding', focus: 'Microsecond Assertions & Invariant Dry Running', task: 'Simulate 3 back-to-back 45-minute rounds on Phoenix Proctored Arena without external IDE syntax assistance.' },
        { day: 'Day 13-14', phase: 'Mock Assessment Bar-Raiser', focus: `${company} High-Frequency Pattern Taxonomy`, task: `Complete top 10 most frequent questions asked at ${company} over the last 90 days from Phoenix Radar.` }
      ];
    } else {
      return [
        { day: 'Day 1-2', phase: 'STAR Story Deconstruction', focus: 'Audit All Stories Against Amazon / FAANG Leadership Principles', task: 'Rewrite 5 core technical achievements isolating personal contribution from team actions.' },
        { day: 'Day 3-5', phase: 'Metric Quantification Audit', focus: 'Attach Precise Engineering Metrics ($ Saved, QPS, P99 ms, Downtime %)', task: 'Eliminate vague adjectives ("significantly improved", "faster") and replace with verified statistical proofs.' },
        { day: 'Day 6-9', phase: 'Failure & Conflict Engineering', focus: 'The "Biggest Mistake" and "Disagree and Commit" Scenarios', task: 'Refactor production outage narrative into a proactive root-cause learning story with radical accountability.' },
        { day: 'Day 10-12', phase: 'Prosody & Pacing Calibration', focus: 'Speech Rate (130-150 WPM) and Elimination of Defensive Filler Words', task: 'Record 5 STAR responses through Phoenix Speech Biofeedback ensuring confidence score > 85.' },
        { day: 'Day 13-14', phase: 'Bar-Raiser Simulation', focus: `Direct Alignment with ${company} Cultural Values`, task: `Conduct 2 45-minute behavioral mock interviews with cross-examination on technical trade-offs.` }
      ];
    }
  }

  /**
   * Curate targeted drills based on failures
   */
  _getRecommendedDrills(roundType, tags) {
    if (roundType.toLowerCase().includes('system')) {
      return [
        { title: 'YouTube Live Chat High-Throughput Aggregator', type: 'System Design Canvas', timeEstimate: '45 mins', url: '/interview-prep/system-design.html' },
        { title: 'Distributed Rate Limiter with Sliding Window Counter', type: 'Concurrency & Latency', timeEstimate: '30 mins', url: '/interview-prep/concurrency.html' },
        { title: 'Consistent Hashing Ring with Virtual Replicas', type: 'Micro-Drill Challenge', timeEstimate: '15 mins', url: '/interview-prep/micro-drills.html' }
      ];
    } else if (roundType.toLowerCase().includes('coding')) {
      return [
        { title: 'LeetCode 787: Cheapest Flights Within K Stops', type: 'Graph BFS / Bellman-Ford', timeEstimate: '35 mins', url: '/interview-prep/google-studio.html' },
        { title: 'LeetCode 322: Coin Change (State Space Optimization)', type: 'Dynamic Programming', timeEstimate: '25 mins', url: '/interview-prep/graph-dp-tracer.html' },
        { title: 'LeetCode 207: Course Schedule (DAG Cycle Detection)', type: 'Topological Sort', timeEstimate: '25 mins', url: '/interview-prep/graph-dp-tracer.html' }
      ];
    } else {
      return [
        { title: 'STAR Narrative Builder: P0 Outage Post-Mortem', type: 'Behavioral Vault', timeEstimate: '20 mins', url: '/interview-prep/star-vault.html' },
        { title: 'Speech Prosody & Nervous Filler Eliminator', type: 'Audio Biofeedback', timeEstimate: '15 mins', url: '/interview-prep/speech-pace.html' },
        { title: 'AI Peer Mock Interview: Bar-Raiser Cross Examination', type: 'AI Voice Examiner', timeEstimate: '45 mins', url: '/interview-prep/mock-interview.html' }
      ];
    }
  }
}

const rejectionPostMortemEngine = new RejectionPostMortemEngine();

module.exports = {
  RejectionPostMortemEngine,
  rejectionPostMortemEngine,
  COMPANY_COOLDOWNS_MONTHS,
  PRESET_DEBRIEFS
};