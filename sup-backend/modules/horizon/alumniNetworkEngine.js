/**
 * Feature 48: Alumni Mentorship & Career Network Connector
 * Horizon Universal Career & Admissions Engine
 * 
 * Graph-based alumni search across FAANG, Unicorns, Tier-1 Grad Schools,
 * dynamic warm outreach note synthesizer, and interactive 1:1 mentorship booking engine.
 */

const ALUMNI_DIRECTORY = [
  {
    id: 'alum_001',
    name: 'Vikramaditya Rao',
    almaMater: 'RV College of Engineering',
    batchYear: 2019,
    currentRole: 'Staff Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA, USA',
    domain: 'Distributed Systems & Cloud Infrastructure',
    topics: ['System Design Mocks', 'L5/Staff Engineering Paths', 'US H-1B Relocation'],
    bio: 'Ex-Amazon, leads core Borg cluster resource scheduler team at Google. Mentored 40+ junior engineers into Tier-1 product roles.',
    availableSlots: ['Fri 7:00 PM IST', 'Sat 10:30 AM IST', 'Sun 4:00 PM IST']
  },
  {
    id: 'alum_002',
    name: 'Sneha Nandakumar',
    almaMater: 'NITK Surathkal',
    batchYear: 2020,
    currentRole: 'AI Research Scientist',
    company: 'Carnegie Mellon University / Meta AI',
    location: 'Pittsburgh, PA, USA',
    domain: 'Generative AI & Large Language Models',
    topics: ['Top-5 MS/PhD Admissions', 'Research Paper Publishing', 'SOP Review'],
    bio: 'Published in NeurIPS and CVPR. Completed MS in Language Technologies at CMU with full research fellowship.',
    availableSlots: ['Sat 6:30 PM IST', 'Sun 8:00 PM IST']
  },
  {
    id: 'alum_003',
    name: 'Karthik Somayaji',
    almaMater: 'BMS College of Engineering',
    batchYear: 2021,
    currentRole: 'Engineering Manager & Tech Lead',
    company: 'Razorpay',
    location: 'Bangalore, India',
    domain: 'Fintech Payments & High-Throughput Microservices',
    topics: ['Fintech SDE Hiring', 'Resume & GitHub Review', 'Employee Referral'],
    bio: 'Built Razorpay payment gateway orchestration handling 15,000 TPS. Actively hiring SDE-1 and SDE-2 across Bangalore.',
    availableSlots: ['Tue 8:00 PM IST', 'Thu 8:00 PM IST', 'Sat 11:00 AM IST']
  },
  {
    id: 'alum_004',
    name: 'Ananya Deshmukh',
    almaMater: 'Ramaiah Institute of Technology',
    batchYear: 2018,
    currentRole: 'Principal Silicon Design Engineer',
    company: 'Qualcomm',
    location: 'San Diego, CA, USA',
    domain: 'VLSI, FPGA & High-Speed ASIC Architecture',
    topics: ['Hardware/Silicon Careers', 'Semiconductor M.S. Guidance', 'Core ECE Transition'],
    bio: 'Lead architect for Snapdragon 5G baseband modem subsystems. Passionate about empowering hardware engineers.',
    availableSlots: ['Sun 9:00 AM IST', 'Sun 7:00 PM IST']
  },
  {
    id: 'alum_005',
    name: 'Rohan Mehra',
    almaMater: 'RV College of Engineering',
    batchYear: 2022,
    currentRole: 'Founding Engineer',
    company: 'Perplexity AI (Stealth/Seed)',
    location: 'San Francisco, CA, USA',
    domain: 'Full-Stack GenAI & Web Engine Systems',
    topics: ['Y-Combinator Startup Journey', 'Building 0-to-1 Products', 'Hackathon to Startup'],
    bio: 'Won 6 national hackathons at RVCE, moved to SF to co-found generative search startup backed by top angels.',
    availableSlots: ['Mon 9:00 PM IST', 'Wed 9:00 PM IST']
  }
];

const PRESETS = [
  {
    id: 'faang_dist_sys',
    label: 'FAANG Distributed Systems Referral (Google Staff Engineer)',
    alumnusId: 'alum_001',
    studentName: 'Harshith Gowda',
    studentCollege: 'RV College of Engineering',
    studentMajor: 'Computer Science and Engineering',
    targetRole: 'Software Development Engineer - Cloud Systems',
    frameworkKey: 'ALMA_MATER_QUESTION',
    projectHighlight: 'Built an Raft-consensus key-value store in Go with 99.9% uptime test suite'
  },
  {
    id: 'cmu_ai_grad',
    label: 'US Top-5 MS CS Admissions Guidance (CMU Researcher)',
    alumnusId: 'alum_002',
    studentName: 'Nisha V. Rao',
    studentCollege: 'NITK Surathkal',
    studentMajor: 'Information Technology',
    targetRole: 'MS in Computer Science / AI Applicant (Fall 2027)',
    frameworkKey: 'PROJECT_RESEARCH_FEEDBACK',
    projectHighlight: 'Co-authored an IEEE Access paper on parameter-efficient fine-tuning of vision transformers'
  },
  {
    id: 'fintech_unicorn',
    label: 'High-Growth FinTech Unicorn Break-in (Razorpay Lead)',
    alumnusId: 'alum_003',
    studentName: 'Tarun Chandran',
    studentCollege: 'BMS College of Engineering',
    studentMajor: 'Information Science',
    targetRole: 'SDE-1 Payments Backend',
    frameworkKey: 'REFERRAL_POW',
    projectHighlight: 'Engineered a Redis-backed idempotent payment ledger processing 2,500 mock transactions/sec'
  }
];

class AlumniNetworkEngine {
  getDirectory(query = {}) {
    const { company, domain, college } = query;
    let filtered = [...ALUMNI_DIRECTORY];

    if (company) {
      filtered = filtered.filter(a => a.company.toLowerCase().includes(company.toLowerCase()));
    }
    if (domain) {
      filtered = filtered.filter(a => a.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (college) {
      filtered = filtered.filter(a => a.almaMater.toLowerCase().includes(college.toLowerCase()));
    }

    return {
      success: true,
      totalAlumni: ALUMNI_DIRECTORY.length,
      matchedCount: filtered.length,
      alumni: filtered
    };
  }

  getPresets() {
    return PRESETS;
  }

  generateIntroNote(params) {
    const {
      alumnusId = 'alum_001',
      studentName = 'Candidate',
      studentCollege = 'RV College of Engineering',
      studentMajor = 'Computer Science',
      targetRole = 'Software Development Engineer',
      frameworkKey = 'ALMA_MATER_QUESTION',
      projectHighlight = 'Production full-stack distributed application'
    } = params;

    const alumnus = ALUMNI_DIRECTORY.find(a => a.id === alumnusId) || ALUMNI_DIRECTORY[0];

    let subject = '';
    let body = '';
    let estimatedResponseRate = '88%';

    if (frameworkKey === 'ALMA_MATER_QUESTION') {
      subject = `Hello from ${studentCollege} // Question on ${alumnus.domain} from a junior`;
      body = `Hi ${alumnus.name.split(' ')[0]},\n\nI hope you're having a great week! I am a final-year student studying ${studentMajor} at ${studentCollege}, and I came across your journey to ${alumnus.company} as a senior alumnus.\n\nI've been deeply focusing on ${alumnus.domain}, recently building: ${projectHighlight}.\n\nGiven your expertise leading systems at ${alumnus.company}, I would be profoundly grateful for 15 minutes of your guidance or any brief feedback on what specific architectural skills distinguished your transition from campus to ${alumnus.company}.\n\nThank you so much for paying it forward to our alma mater community!\n\nBest regards,\n${studentName}\n${studentCollege} | LinkedIn: [Profile Link]`;
      estimatedResponseRate = '92% (High Alumni Resonance)';
    } else if (frameworkKey === 'PROJECT_RESEARCH_FEEDBACK') {
      subject = `Follow-up on your work at ${alumnus.company} & Technical Feedback Request`;
      body = `Hi ${alumnus.name.split(' ')[0]},\n\nI closely follow your work in ${alumnus.domain} at ${alumnus.company}. As a fellow engineer from ${alumnus.almaMater}, your trajectory inspires me greatly.\n\nI am currently working on ${projectHighlight} and targeting ${targetRole}.\n\nI had a quick question regarding how you approached prerequisite mastery and evaluation rigor when applying from India. If you have 10-15 minutes for a quick mentorship sync, I'd cherish the opportunity to connect.\n\nWarm regards,\n${studentName}`;
      estimatedResponseRate = '87% (Strong Technical Proof-of-Work)';
    } else {
      // REFERRAL_POW
      subject = `Application for ${targetRole} at ${alumnus.company} // Fellow ${studentCollege} Alum`;
      body = `Hi ${alumnus.name.split(' ')[0]},\n\nI noticed an open ${targetRole} role on ${alumnus.company}'s careers portal (Req ID: #TECH-CAMPUS) and wanted to reach out as a junior from ${studentCollege}.\n\nTo demonstrate role alignment, I recently built: ${projectHighlight}. My code, unit tests, and live demo are here: [GitHub/Live URL].\n\nI would be immensely honored if you might consider referring my resume for this position. I have attached my one-page tech resume for your review.\n\nThanks for your time and guidance!\n\nSincerely,\n${studentName}\nPhone: +91 98765 43210 | GitHub: github.com/[handle]`;
      estimatedResponseRate = '85% (Direct & Actionable Referral Request)';
    }

    return {
      success: true,
      alumnus,
      frameworkKey,
      estimatedResponseRate,
      subject,
      body,
      actionTips: [
        'Connect on LinkedIn with this customized note (under 300 characters for connection request, full text for InMail/Email).',
        'Reference mutual college professors, student clubs, or hackathon achievements to maximize warm rapport.',
        'Follow up politely once after 5-7 business days if no reply.'
      ]
    };
  }

  bookSession(params) {
    const {
      alumnusId = 'alum_001',
      studentName = 'Candidate',
      selectedSlot = 'Sat 10:30 AM IST',
      sessionTopic = 'System Design Mocks',
      candidateNotes = 'Review my distributed cache architecture'
    } = params;

    const alumnus = ALUMNI_DIRECTORY.find(a => a.id === alumnusId) || ALUMNI_DIRECTORY[0];

    const bookingRef = `PHX-MENTOR-${Date.now().toString(36).toUpperCase()}`;

    return {
      success: true,
      bookingRef,
      status: 'CONFIRMED',
      sessionDetails: {
        mentorName: alumnus.name,
        mentorCompany: alumnus.company,
        mentorRole: alumnus.currentRole,
        studentName,
        slot: selectedSlot,
        topic: sessionTopic,
        meetingLink: `https://meet.google.com/phx-${bookingRef.toLowerCase().slice(-7)}`,
        candidateNotes
      },
      prepChecklist: [
        'Prepare your 60-second elevator pitch highlighting your college and primary tech stack.',
        'Have your GitHub repository or resume open in a screen-shareable window.',
        'Bring 3 concise, high-impact questions to make best use of the mentor\'s time.'
      ]
    };
  }
}

const alumniNetworkEngine = new AlumniNetworkEngine();

module.exports = {
  alumniNetworkEngine,
  ALUMNI_DIRECTORY,
  PRESETS
};
