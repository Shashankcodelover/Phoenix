/**
 * Phoenix Hackathon Room Store & State Synchronizer (Dynamic N-Member Support)
 * 
 * Dynamically scales to arbitrary team sizes (N >= 1) with zero hardcoded limits.
 * Mathematically distributes hackathon workloads, sprint deliverables,
 * foundation documents, and role-based AI copilots across all active teammates.
 */

class HackathonRoomStore {
  constructor() {
    this.rooms = new Map(); // roomId -> RoomState
  }

  /**
   * Creates a new unique squad room initialized with the leader.
   */
  createRoom(payload = {}) {
    const {
      squadName = 'Team Phoenix Nexus',
      leaderName = 'Shashank J',
      leaderRole = 'Lead Full-Stack & Systems Architect',
      leaderSkills = 'React, Node.js, WebRTC, Distributed Systems',
      hackathonName = 'National AI Breakthrough Hackathon 2026'
    } = payload;

    const roomId = `ROOM-APEX-${Math.floor(1000 + Math.random() * 9000)}`;

    const room = {
      roomId,
      squadName,
      hackathonName,
      createdAt: new Date().toISOString(),
      currentRound: 'ROUND_1_INCEPTION', // 'ROUND_1_INCEPTION' | 'ROUND_2_MENTORING' | 'ROUND_3_STAGE_PITCH' | 'ROUND_4_FINALE'
      posterData: {
        hackathonName,
        registrationClose: 'In 3 Days',
        pptIdeaSubmission: 'In 7 Days',
        sprintKickoff: 'In 10 Days',
        finalDemoAndJudging: 'In 12 Days',
        prizeTracks: [
          { id: 't1', name: '🤖 Multimodal AI & Autonomous Agents', prize: '$10,000' },
          { id: 't2', name: '⚡ Distributed Systems & Offline P2P', prize: '$7,500' },
          { id: 't3', name: '🏥 HealthTech & Patient Triage', prize: '$5,000' },
          { id: 't4', name: '🛡️ FinTech & Zero-Knowledge Verification', prize: '$5,000' }
        ]
      },
      members: [
        {
          id: 'mem_1',
          name: leaderName,
          role: leaderRole,
          skills: leaderSkills,
          avatar: '👨‍💻',
          isLeader: true,
          status: 'Online',
          joinedAt: new Date().toISOString()
        }
      ],
      activeDomain: 'AI & Developer Tools',
      lockedProblemStatement: 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE',
      selectedFeatures: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f10', 'f13'],
      ideaVotes: { idea_1: 1 },
      chatMessages: [
        {
          id: 'msg_init',
          channelId: 'general-squad',
          sender: 'AI Central Copilot',
          role: 'CENTRAL_AGENT',
          avatar: '🤖',
          text: `Squad Server initialized for "${squadName}" with Room ID: ${roomId}. Dynamic member scaling is active. Share your invite link to add teammates.`,
          timestamp: 'Just now'
        }
      ]
    };

    this.rooms.set(roomId, room);
    return { success: true, room };
  }

  /**
   * Retrieves live room state.
   */
  getRoom(roomId) {
    if (!roomId) return null;
    let room = this.rooms.get(roomId);
    if (!room) {
      const created = this.createRoom({ squadName: 'Team Phoenix Nexus' });
      room = created.room;
      this.rooms.set(roomId, room);
    }
    return room;
  }

  /**
   * Adds an arbitrary teammate into the room with custom role & skills.
   */
  joinRoom(roomId, memberPayload = {}) {
    const room = this.getRoom(roomId);
    if (!room) return { success: false, error: 'ROOM_NOT_FOUND' };

    const memberIndex = room.members.length + 1;
    const defaultAvatars = ['👨‍💻', '🎨', '⚙️', '🎤', '🚀', '🧠', '🛡️', '📱'];
    const defaultRoles = [
      'Lead Full-Stack & Systems Architect',
      'Frontend & Interaction Specialist',
      'Backend, DB & RAG Engineer',
      'Pitch Specialist & Product Storyteller',
      'DevOps, Cloud & Infrastructure Lead',
      'AI/ML Research & Embeddings Specialist',
      'Cybersecurity & Smart Contract Auditor',
      'Mobile & PWA Specialist'
    ];

    const newMember = {
      id: `mem_${Date.now()}_${memberIndex}`,
      name: memberPayload.name || `Teammate ${memberIndex}`,
      role: memberPayload.role || defaultRoles[(memberIndex - 1) % defaultRoles.length],
      skills: memberPayload.skills || 'React, Node.js, WebSockets, Python, Fastify',
      avatar: memberPayload.avatar || defaultAvatars[(memberIndex - 1) % defaultAvatars.length],
      isLeader: false,
      status: 'Online',
      joinedAt: new Date().toISOString()
    };

    room.members.push(newMember);

    // Announce in universal squad chat
    room.chatMessages.push({
      id: `msg_join_${Date.now()}`,
      channelId: 'general-squad',
      sender: 'AI Central Copilot',
      role: 'CENTRAL_AGENT',
      avatar: '🤖',
      text: `🎉 ${newMember.name} has joined as ${newMember.role}! Active squad size: ${room.members.length} members. Workload & foundation docs automatically rebalanced.`,
      timestamp: 'Just now'
    });

    return {
      success: true,
      member: newMember,
      room
    };
  }

  /**
   * Resets squad back to 1 member (Leader).
   */
  resetSquad(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return { success: false };
    room.members = [room.members[0]];
    return { success: true, room };
  }

  /**
   * Updates scanned poster data in the room.
   */
  updatePosterData(roomId, posterData) {
    const room = this.getRoom(roomId);
    if (!room) return { success: false };
    room.posterData = { ...room.posterData, ...posterData };
    if (posterData.hackathonName) {
      room.hackathonName = posterData.hackathonName;
    }
    return { success: true, room };
  }

  /**
   * Sets current hackathon preparation round (Round 1, 2, 3, 4).
   */
  setRound(roomId, roundKey) {
    const room = this.getRoom(roomId);
    if (!room) return { success: false };
    room.currentRound = roundKey;

    const roundNames = {
      ROUND_1_INCEPTION: 'Round 1: Inception & PPT Idea Submission',
      ROUND_2_MENTORING: 'Round 2: Mid-Sprint Mentorship & Architecture Check',
      ROUND_3_STAGE_PITCH: 'Round 3: Grand Stage Pitching & Demo Rehearsal',
      ROUND_4_FINALE: 'Round 4: Grand Finale & Production Deployment'
    };

    room.chatMessages.push({
      id: `msg_round_${Date.now()}`,
      channelId: 'general-squad',
      sender: 'AI Central Copilot',
      role: 'CENTRAL_AGENT',
      avatar: '🏆',
      text: `🚀 Squad milestone updated: Now preparing for "${roundNames[roundKey] || roundKey}". Specialized deliverables and scripts generated!`,
      timestamp: 'Just now'
    });

    return { success: true, room };
  }

  /**
   * Locks winning problem statement and broadcasts deep architectural breakdown in #general-squad.
   */
  lockProblemStatement(roomId, problemStatement, domain = 'AI & Developer Tools') {
    const room = this.getRoom(roomId);
    if (!room) return { success: false };

    room.lockedProblemStatement = problemStatement;
    room.activeDomain = domain;

    // Detailed architectural broadcast in universal squad chat
    const broadcastText = `🔒 **WINNING PROBLEM STATEMENT LOCKED BY LEADER**
📌 **Core Theme**: ${domain}
🏆 **Project Title**: ${problemStatement}
👥 **Active Squad**: ${room.members.length} Members (${room.members.map(m => m.name).join(', ')})

⚡ **High-Impact Features to Build**:
1. Sub-300ms WebRTC Mesh Data & Audio Engine (Zero Server Transcoding)
2. In-Memory Vector Whiteboard with Conflict-Free CRDT Synchronizer
3. Native AI Senior Copilot with sub-50ms Context Probing
4. Stage-Ready 180s Teleprompter with Cadence Guidance
5. Devpost Markdown & PDF Architecture Auto-Exporter

All 6 Foundation Documents and Sprint Plans are now calibrated for our ${room.members.length} active teammates!`;

    room.chatMessages.push({
      id: `msg_lock_${Date.now()}`,
      channelId: 'general-squad',
      sender: 'AI Central Copilot',
      role: 'CENTRAL_AGENT',
      avatar: '🤖',
      text: broadcastText,
      timestamp: 'Just now'
    });

    return { success: true, room };
  }

  /**
   * Casts a live vote on an idea in the room enforcing 1-vote-per-member invariant.
   */
  castVote(roomId, ideaId, memberId = 'mem_1') {
    const room = this.getRoom(roomId);
    if (!room) return { success: false };
    
    if (!room.memberVotes) room.memberVotes = {};

    // If member already voted for this idea, toggle it off
    if (room.memberVotes[memberId] === ideaId) {
      delete room.memberVotes[memberId];
    } else {
      // Shift vote to new idea
      room.memberVotes[memberId] = ideaId;
    }

    // Recompute clean counts from memberVotes
    const newIdeaVotes = {};
    Object.values(room.memberVotes).forEach((id) => {
      newIdeaVotes[id] = (newIdeaVotes[id] || 0) + 1;
    });

    room.ideaVotes = newIdeaVotes;
    return { success: true, votes: room.ideaVotes, memberVotes: room.memberVotes, room };
  }


  /**
   * Mathematically distributes 100% of the hackathon deliverables across all N members.
   */
  distributeWorkloadAcrossMembers(members = [], problemStatement = '') {
    const n = members.length;
    if (n === 0) return [];

    return members.map((member, index) => {
      const role = member.role || 'Full-Stack Engineer';
      let assignedTasks = [];

      const r = role.toLowerCase();
      if (r.includes('frontend') || r.includes('ui') || r.includes('ux') || r.includes('interaction')) {
        assignedTasks = [
          'Scaffold Next.js 16 UI with Radiant Light & Dark Theme system.',
          'Build WebAudio 12-bar real-time visualizer canvas node.',
          'Implement multi-cursor collaborative presence indicators.'
        ];
      } else if (r.includes('backend') || r.includes('rag') || r.includes('database') || r.includes('api')) {
        assignedTasks = [
          'Implement Express 5 + Socket.IO signaling server for ephemeral rooms.',
          'Build Gemini 2.5 flash semantic RAG pipeline & vector query engine.',
          'Setup in-memory caching and offline cache sync fallback.'
        ];
      } else if (r.includes('pitch') || r.includes('story') || r.includes('present') || r.includes('demo')) {
        assignedTasks = [
          'Draft 180s timestamped stage pitch script with compelling opening hook.',
          'Build 5-slide visual Marp deck (Problem, Architecture, Traction, Moat).',
          'Coordinate judge counter-defense rehearsals and Devpost markdown story.'
        ];
      } else if (r.includes('devops') || r.includes('cloud') || r.includes('infra') || r.includes('docker')) {
        assignedTasks = [
          'Configure Docker Compose multi-container staging environment.',
          'Implement GitHub Actions CI pipeline running 88/88 test suite.',
          'Setup Vercel edge deployment with automated DNS failover.'
        ];
      } else if (r.includes('ml') || r.includes('ai') || r.includes('research') || r.includes('data')) {
        assignedTasks = [
          'Train/fine-tune local WebAssembly embeddings for client-side search.',
          'Evaluate prompt latency and optimize token throughput.',
          'Synthesize empirical benchmark data and fairness validation charts.'
        ];
      } else if (r.includes('lead') || r.includes('architect') || member.isLeader) {
        assignedTasks = [
          'Design overall System Topology & WebRTC P2P Data Mesh.',
          'Enforce $0.00 Zero-Cloud-Egress Cost & P99 < 35ms Latency Invariants.',
          'Review code PRs from teammates and orchestrate final integration demo.'
        ];
      } else {
        assignedTasks = [
          `Own Feature Module #${index + 1} for ${problemStatement.slice(0, 25)}.`,
          'Write unit and integration tests ensuring 100% test pass rate.',
          'Assist with live demo recordings and edge-case stress testing.'
        ];
      }

      return {
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role,
        avatar: member.avatar || '👨‍💻',
        assignedTasks
      };
    });
  }

  /**
   * Generates peak-quality 6 Foundation Documents dynamically tailored for all N members.
   */
  getConnectedFoundationDocs(roomId) {
    const room = this.getRoom(roomId);
    const statement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice & CRDT IDE';
    const members = room?.members || [];
    const memberCount = members.length;
    const workloadDistribution = this.distributeWorkloadAcrossMembers(members, statement);

    // Format sprint plan key points dynamically
    const sprintKeyPoints = workloadDistribution.map(w => (
      `• **${w.memberName} (${w.memberRole})**: ${w.assignedTasks.join(' ')}`
    ));

    return {
      success: true,
      roomId: room?.roomId,
      memberCount,
      activeMembers: members,
      workloadDistribution,
      problemStatement: statement,
      documents: [
        {
          id: 'doc_prd',
          number: '01',
          title: '📄 Product Requirement Document (PRD)',
          category: 'National Hackathon Product Spec',
          leadOwner: members[0]?.name || 'Lead Architect',
          summary: `National-hackathon standard PRD for "${statement}", mathematically dividing deliverables across ${memberCount} active team member(s).`,
          keyPoints: [
            `Active Squad Roster (${memberCount} Members): ${members.map(m => `${m.name} [${m.role}]`).join(' | ')}`,
            'Core MVP Scope: Sub-300ms peer audio mesh, collaborative CRDT vector whiteboard, AI senior copilot, 180s stage teleprompter.',
            'Target User Empathy: Distributed hackathon teams and remote software engineers experiencing context loss across multi-tab tools.',
            'Zero Cloud Egress Invariant: 100% P2P WebRTC data transmission with $0.00 recurring infrastructure cost.'
          ]
        },
        {
          id: 'doc_uiux',
          number: '02',
          title: '🎨 UI / UX Interaction Flow Spec',
          category: 'Design System & User Flows',
          leadOwner: members.find(m => m.role?.toLowerCase().includes('frontend') || m.role?.toLowerCase().includes('ui'))?.name || members[0]?.name,
          summary: 'State-of-the-art glassmorphic design system featuring radiant light and sleek dark mode themes with sub-16ms render loops.',
          keyPoints: [
            'Design Tokens: Radiant Ice-Blue (#38BDF8), Emerald Green (#34D399), Crisp Glass (rgba(255,255,255,0.88)).',
            'Screen Flow: Instant 1-Click Lobby Entry ➔ Split-Pane IDE/Canvas Workspace ➔ Fullscreen 180s Rehearsal Stage.',
            'Accessibility: WCAG 2.1 AAA high-contrast typography with instant keyboard shortcut navigation (Space for Mute, Esc for Canvas Reset).'
          ]
        },
        {
          id: 'doc_arch',
          number: '03',
          title: '⚡ Technical Scalability & Architecture Doc',
          category: 'System Topology & Performance',
          leadOwner: members[0]?.name,
          summary: 'High-throughput P2P mesh topology, Socket.IO WebRTC signaling loop, and Gemini 2.5 flash AI RAG pipeline.',
          keyPoints: [
            'Client Architecture: Next.js 16 + React 19 + Tailwind CSS + WebAudio API DSP Audio Worklet.',
            'Backend Topology: Express 5 + Socket.IO Ephemeral Signaling Rooms + Gemini Semantic Vector Prober.',
            'Scalability Invariant: P99 Latency < 35ms across all connected peers with 0 database bottlenecks during live audio sessions.'
          ]
        },
        {
          id: 'doc_persona',
          number: '04',
          title: '🎯 Target User Persona & Pain-Point Map',
          category: 'Empirical Market Validation',
          leadOwner: members.find(m => m.role?.toLowerCase().includes('pitch'))?.name || members[memberCount - 1]?.name,
          summary: 'Deep empathy segmentation demonstrating product-market fit against existing commercial tools.',
          keyPoints: [
            'Primary Persona: "Alex — Hackathon Lead & CS Student" participating in 24-hour sprints with multi-tab cognitive overload.',
            'Pain Point: 40% loss of technical context between Discord voice calls, Excalidraw whiteboards, and VSCode.',
            'Empirical Before vs After: 7 open browser tabs ➔ 1 unified workspace with automated milestone checklists and synchronized teleprompter.'
          ]
        },
        {
          id: 'doc_moat',
          number: '05',
          title: '🛡️ Competitive Moat & Unfair Advantage Doc',
          category: 'Judge Defense & Defensibility',
          leadOwner: members[0]?.name,
          summary: 'Defensibility analysis proving why this prototype beats commercial SaaS (Zoom/Miro) and standard hackathon clones.',
          keyPoints: [
            'Cost Moat: Commercial SaaS charges $15-$30/user/mo vs NexusAudio 100% Free & Open-Source P2P architecture.',
            'Latency Moat: Sub-300ms WebAssembly Audio DSP operating directly client-side without cloud media relay overhead.',
            'Reliability Moat: 88/88 automated unit and integration tests ensuring zero demo crashes during judging.'
          ]
        },
        {
          id: 'doc_sprint',
          number: '06',
          title: `⏱️ 24-Hour Sprint Plan (${memberCount} Active Teammate${memberCount > 1 ? 's' : ''})`,
          category: 'Dynamic Squad Workload Balancing',
          leadOwner: 'All Active Squad Members',
          summary: `Workload mathematically divided across all ${memberCount} active teammate(s) in Room ${room?.roomId}.`,
          keyPoints: sprintKeyPoints
        }
      ]
    };
  }

  /**
   * Generates Round-Specific Stage Pitching & Demonstration Assets.
   */
  getRoundSpecificAssets(roomId, roundKey = 'ROUND_3_STAGE_PITCH') {
    const room = this.getRoom(roomId);
    const statement = room?.lockedProblemStatement || 'NexusAudio IDE';
    const members = room?.members || [];
    const memberCount = members.length;

    return {
      success: true,
      roomId: room?.roomId,
      roundKey,
      statement,
      memberCount,
      // Round 3 Stage Script
      stageScript180s: {
        totalDurationSeconds: 180,
        targetWpm: 135,
        sections: [
          {
            timestamp: '00:00 - 00:30',
            speaker: members[0]?.name || 'Lead Presenter',
            phase: 'Hook & Problem Statement',
            script: `"Respected judges, every remote engineering team loses 40% of their architectural context switching between Zoom calls, Figma whiteboards, and code editors. Existing SaaS tools charge $30/month and suffer from over 600ms of audio lag. Today, we built ${statement} — a unified, zero-cloud-egress workspace with sub-300ms WebRTC voice and collaborative CRDT canvas, running at $0.00 cloud infrastructure spend."`
          },
          {
            timestamp: '00:30 - 01:15',
            speaker: members[1]?.name || members[0]?.name,
            phase: 'Live Working Demonstration',
            script: `"Let us show you this live. Here are our ${memberCount} team members connected across independent browsers in Room ${room?.roomId}. As I draw this system topology node on the canvas, delta vectors replicate instantly to all peers in under 20ms using conflict-free replicated data types. Notice our live 12-bar WebAudio visualizer processing acoustic noise directly in WebAssembly."`
          },
          {
            timestamp: '01:15 - 02:15',
            speaker: members[2]?.name || members[0]?.name,
            phase: 'Technical Architecture & Moat',
            script: `"Under the hood, we eliminate cloud media servers completely. All audio chunks and canvas vectors travel directly peer-to-peer over WebRTC data channels. When an engineer asks a design question, our embedded Gemini AI Senior Copilot evaluates CAP theorem trade-offs in sub-50 milliseconds. We verified our architecture with an automated 88-test validation suite."`
          },
          {
            timestamp: '02:15 - 03:00',
            speaker: members[0]?.name,
            phase: 'Future Vision & Q&A Transition',
            script: `"NexusAudio is completely free, open-source, and offline-resilient. We are ready to take your questions on system scalability, concurrency, and security!"`
          }
        ]
      },
      // Top 5 Tough Judge Objections & Counter-Defenses
      judgeCounterDefense: [
        {
          id: 'q1',
          judgeQuestion: '"How does your WebRTC mesh scale when a team grows beyond 10 members?"',
          counterDefense: '"For hackathon squads (2-6 members), full P2P mesh offers lowest latency (<30ms) at $0 cost. For larger enterprise rooms, our architecture transitions to a Selective Forwarding Unit (SFU) using mediasoup with zero client-side architectural rewrites."',
          confidenceScore: 98
        },
        {
          id: 'q2',
          judgeQuestion: '"What happens if the venue Wi-Fi crashes midway through your presentation?"',
          counterDefense: '"We designed an offline-first LocalStorage and IndexedDB emergency cache. All local canvas changes and audio buffers queue locally and auto-reconcile using Merkle trees once connection recovers."',
          confidenceScore: 96
        },
        {
          id: 'q3',
          judgeQuestion: '"Why wouldn\'t users just use Discord voice combined with Excalidraw?"',
          counterDefense: '"Discord and Excalidraw have zero code AST context. Our Central AI Copilot reads live code state and whiteboards simultaneously to generate architectural follow-ups in real time."',
          confidenceScore: 95
        }
      ]
    };
  }
}

const hackathonRoomStore = new HackathonRoomStore();
module.exports = { HackathonRoomStore, hackathonRoomStore };
