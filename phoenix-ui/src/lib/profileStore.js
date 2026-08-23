'use client';

/**
 * Phoenix Domain-Aware Profile Store
 * Segregates candidate profile data by domain so Interview, Hackathon, and Horizon do not conflict.
 */

const STORAGE_KEY = 'phoenix_domain_profile_v25';

export const defaultProfile = {
  // Global / Identity
  name: 'Shashank J',
  email: 'shashank@phoenix.os',
  activeDomain: 'interview', // 'interview' | 'hackathon' | 'horizon'
  
  // 💼 PILLAR 1: Placement & Voice AI Profile
  interviewProfile: {
    targetRole: 'Senior Distributed Systems & Full-Stack Engineer',
    targetCompanyTier: 'FAANG / Tier-1 Tech (Google, Uber, Stripe)',
    experienceLevel: 'Final Year Engineering / L4 Candidate',
    primaryStack: ['TypeScript', 'Node.js', 'React', 'Go', 'Distributed Systems', 'Redis'],
    dsaProficiency: 'Advanced (LeetCode 350+ Solved)',
    systemDesignFocus: 'Distributed Caching, Rate Limiters, WebSockets & CRDTs',
    starStoryHeadline: 'Architected offline-first P2P geofencing mesh reducing cloud egress by $0.00'
  },

  // 🏆 PILLAR 2: Hackathon OS Profile
  hackathonProfile: {
    teamName: 'Team Phoenix Apex',
    hackathonName: 'Global AI & Web3 Breakthrough Hackathon 2026',
    targetTrack: 'Best Multimodal AI & Real-Time Collaboration Hack',
    squadRole: 'Lead Full-Stack & Systems Architect', // 'Lead Architect' | 'Frontend Lead' | 'Backend / AI' | 'Pitch Specialist'
    githubOrg: 'https://github.com/shashank-phoenix',
    devpostHandle: 'shashank_apex',
    deadlineHoursLeft: 36,
    activeIdea: 'NexusAudio — Sub-300ms Multimodal Voice Coaching & CRDT IDE'
  },

  // 🌅 PILLAR 3: Horizon Admissions Profile
  horizonProfile: {
    stream: 'KCET', // 'KCET' | 'DCET' | 'COMEDK'
    candidateRank: 1850,
    categoryQuota: '2A', // 'GM' | '1G' | '2A' | '2B' | '3A' | '3B' | 'SC' | 'ST'
    hyderabadKarnataka371J: true,
    ruralReservation: true,
    kannadaMedium: false,
    preferredBranches: ['Computer Science & Eng (CSE)', 'Information Science (ISE)', 'AI & Machine Learning'],
    targetColleges: ['RVCE Bengaluru', 'BMSCE Bengaluru', 'MSRIT Bengaluru', 'PES University RR Campus']
  }
};

export function getStoredProfile() {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile,
      ...parsed,
      interviewProfile: { ...defaultProfile.interviewProfile, ...(parsed.interviewProfile || {}) },
      hackathonProfile: { ...defaultProfile.hackathonProfile, ...(parsed.hackathonProfile || {}) },
      horizonProfile: { ...defaultProfile.horizonProfile, ...(parsed.horizonProfile || {}) }
    };
  } catch {
    return defaultProfile;
  }
}

export function saveStoredProfile(updated) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredProfile();
    const merged = { ...current, ...updated };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('phoenix_profile_updated', { detail: merged }));
    }
    return merged;
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}
