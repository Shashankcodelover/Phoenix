/**
 * Phoenix Horizon — Verified Resource & Link Repository Engine
 * Module 4: Curated, verified learning resources per domain and phase.
 */

const RESOURCE_DATABASE = {
  fullstack_web: [
    { resourceId: 'fw_r01', title: 'MDN Web Docs — HTML/CSS/JS Reference', url: 'https://developer.mozilla.org/', type: 'documentation', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'fw_r02', title: 'The Odin Project — Full Stack Curriculum', url: 'https://www.theodinproject.com/', type: 'course', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'fw_r03', title: 'freeCodeCamp — Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'course', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'fw_r04', title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'documentation', free: true, phase: 2, quality: 'GOLD' },
    { resourceId: 'fw_r05', title: 'Node.js Official Getting Started Guide', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', type: 'documentation', free: true, phase: 2, quality: 'GOLD' },
    { resourceId: 'fw_r06', title: 'NeetCode 150 — DSA Interview Prep', url: 'https://neetcode.io/practice', type: 'practice', free: true, phase: 4, quality: 'GOLD' },
  ],
  ca_foundation: [
    { resourceId: 'ca_r01', title: 'ICAI Official Study Material', url: 'https://www.icai.org/post/students-study-material', type: 'documentation', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'ca_r02', title: 'CA Foundation by Unacademy', url: 'https://unacademy.com/goal/ca-foundation/JTSOJ', type: 'course', free: false, phase: 2, quality: 'SILVER' },
    { resourceId: 'ca_r03', title: 'ICAI Revision Test Papers (RTP)', url: 'https://www.icai.org/post/revision-test-papers', type: 'practice', free: true, phase: 4, quality: 'GOLD' },
  ],
  neet_biology: [
    { resourceId: 'neet_r01', title: 'NCERT Biology Textbook PDF (Class 11 & 12)', url: 'https://ncert.nic.in/textbook.php', type: 'textbook', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'neet_r02', title: 'Allen NEET Biology Video Lectures', url: 'https://www.allen.ac.in/', type: 'course', free: false, phase: 2, quality: 'SILVER' },
    { resourceId: 'neet_r03', title: 'PYQ Chapter-wise NEET Questions (Embibe)', url: 'https://www.embibe.com/exams/neet-previous-year-papers/', type: 'practice', free: true, phase: 3, quality: 'GOLD' },
  ],
  dsa_algorithms: [
    { resourceId: 'dsa_r01', title: 'Striver A2Z DSA Course/Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', type: 'course', free: true, phase: 1, quality: 'GOLD' },
    { resourceId: 'dsa_r02', title: 'LeetCode — Problem Practice Platform', url: 'https://leetcode.com/', type: 'practice', free: true, phase: 2, quality: 'GOLD' },
    { resourceId: 'dsa_r03', title: 'Abdul Bari Algorithms YouTube', url: 'https://www.youtube.com/@abdul_bari', type: 'video', free: true, phase: 1, quality: 'GOLD' },
  ],
  cyber_security: [
    { resourceId: 'cs_r01', title: 'TryHackMe — Learn Cyber Security', url: 'https://tryhackme.com/', type: 'lab', free: true, phase: 2, quality: 'GOLD' },
    { resourceId: 'cs_r02', title: 'HackTheBox Academy', url: 'https://academy.hackthebox.com/', type: 'lab', free: true, phase: 3, quality: 'GOLD' },
    { resourceId: 'cs_r03', title: 'OWASP Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', type: 'documentation', free: true, phase: 2, quality: 'GOLD' },
  ],
};

function getResources({ domainKey, phase, freeOnly }) {
  let resources = RESOURCE_DATABASE[domainKey];
  if (!resources) {
    return { success: false, error: `No resources for domain "${domainKey}".` };
  }

  if (phase) {
    resources = resources.filter(r => r.phase === phase);
  }
  if (freeOnly) {
    resources = resources.filter(r => r.free === true);
  }

  return { success: true, domainKey, count: resources.length, resources };
}

module.exports = { getResources, RESOURCE_DATABASE };
