/**
 * industryInternshipTrackerEngine.js
 * Feature 52: Industry Internship Pipeline & Stipend Tracker
 * 
 * Provides:
 *  - Curated internship directory across Big Tech, Quant/HFT, Unicorns, and Research.
 *  - Real-time monthly stipend indices and PPO conversion tracking.
 *  - Pipeline Kanban state management (Saved -> Applied -> OA -> Tech -> Offer).
 *  - Personalized cold outreach & employee referral note synthesizer.
 */

const INTERNSHIP_DIRECTORY = [
  {
    id: 'google_swe_intern',
    company: 'Google',
    logo: '🔵',
    role: 'Software Engineering Intern (Summer 2027)',
    category: 'Big Tech',
    type: 'Off-Campus & On-Campus',
    stipendMonthlyInr: 125000,
    ppoConversionRatePct: 78,
    location: 'Bengaluru / Hyderabad',
    durationWeeks: 12,
    eligibility: {
      minCgpa: 8.0,
      gradYears: [2027, 2028],
      branches: ['CSE', 'ECE', 'IT', 'Related STEM']
    },
    perks: ['Free Gourmet Meals', 'Relocation Flight & 2-Week 5-Star Hotel', '₹50,000 WFH Setup', 'Health Insurance'],
    referralFeasibility: 'High (10,000+ Alumni across India)',
    applicationDeadline: 'October 30',
    selectionRounds: ['Resume Screen & CodeSignal OA', 'Technical Round 1 (DSA)', 'Technical Round 2 (System/Algorithms)', 'Googlyness Fit']
  },
  {
    id: 'deshaw_quant_intern',
    company: 'D. E. Shaw & Co.',
    logo: '💎',
    role: 'Quantitative Analysis & Software Intern',
    category: 'Quant/HFT',
    type: 'On-Campus Tier-1 & Off-Campus Guild',
    stipendMonthlyInr: 350000,
    ppoConversionRatePct: 85,
    location: 'Hyderabad',
    durationWeeks: 8,
    eligibility: {
      minCgpa: 8.5,
      gradYears: [2027],
      branches: ['CSE', 'EE', 'Math & Computing']
    },
    perks: ['Executive Housing in Hyderabad', 'Round-trip Airfare', 'Discretionary Performance Bonus', 'Dedicated 1:1 Quant Mentor'],
    referralFeasibility: 'Selective (Requires Strong Math/CP Profile)',
    applicationDeadline: 'September 15',
    selectionRounds: ['Aptitude & Advanced Math OA', 'Technical Round (C++ / Systems / Probability)', 'Hiring Manager Behavioral']
  },
  {
    id: 'microsoft_swe_intern',
    company: 'Microsoft',
    logo: '🟩',
    role: 'Software Development Engineering Intern',
    category: 'Big Tech',
    type: 'Off-Campus & On-Campus',
    stipendMonthlyInr: 125000,
    ppoConversionRatePct: 74,
    location: 'Bengaluru / Noida / Hyderabad',
    durationWeeks: 10,
    eligibility: {
      minCgpa: 7.5,
      gradYears: [2027],
      branches: ['Any Engineering Discipline']
    },
    perks: ['Monthly Housing Allowance ₹40k', 'Surface Pro Laptop Provided', 'Comprehensive Health Coverage'],
    referralFeasibility: 'High',
    applicationDeadline: 'November 15',
    selectionRounds: ['Online Assessment (3 LeetCode Medium/Hard)', 'Technical Interview 1', 'Technical Interview 2', 'AA (As Appropriate) Director Round']
  },
  {
    id: 'zepto_unicorn_intern',
    company: 'Zepto',
    logo: '⚡',
    role: 'Backend Engineering Intern (Fast Commerce)',
    category: 'High-Growth Unicorn',
    type: 'Off-Campus Fast Track',
    stipendMonthlyInr: 80000,
    ppoConversionRatePct: 65,
    location: 'Bengaluru',
    durationWeeks: 16,
    eligibility: {
      minCgpa: 7.0,
      gradYears: [2026, 2027],
      branches: ['Open to all']
    },
    perks: ['High Ownership of Tier-0 Microservices', 'Daily Food Reimbursement', 'Fast-Track Senior SWE Promotion post-PPO'],
    referralFeasibility: 'Medium',
    applicationDeadline: 'Rolling Basis',
    selectionRounds: ['Take-Home Machine Coding Task', 'Live System & Architecture Discussion', 'Founder/Tech Lead Culture Round']
  },
  {
    id: 'msr_research_fellow',
    company: 'Microsoft Research India (MSR)',
    logo: '🔬',
    role: 'Research Fellow / Intern',
    category: 'Research Fellowship',
    type: 'Off-Campus Global Selection',
    stipendMonthlyInr: 110000,
    ppoConversionRatePct: 60,
    location: 'Bengaluru',
    durationWeeks: 24,
    eligibility: {
      minCgpa: 8.5,
      gradYears: [2026, 2027],
      branches: ['CSE', 'AI/Data Science', 'Mathematics']
    },
    perks: ['Publish papers at NeurIPS/ICML/SIGCOMM', 'Full Conference Travel Sponsorship', 'Top-10 US PhD Recommendation'],
    referralFeasibility: 'Research Network',
    applicationDeadline: 'December 1',
    selectionRounds: ['Research Statement Review', 'Technical Deep-Dive on Prior Papers', 'Principal Researcher Interview']
  },
  {
    id: 'razorpay_fintech_intern',
    company: 'Razorpay',
    logo: '💳',
    role: 'Payments Engineering Intern',
    category: 'Fintech',
    type: 'Off-Campus',
    stipendMonthlyInr: 90000,
    ppoConversionRatePct: 70,
    location: 'Bengaluru',
    durationWeeks: 12,
    eligibility: {
      minCgpa: 7.5,
      gradYears: [2027],
      branches: ['CSE', 'ECE', 'IT']
    },
    perks: ['Wellness Stipend', 'High-Scale Distributed Systems Experience', 'PPO Base Starting ₹24 LPA'],
    referralFeasibility: 'High',
    applicationDeadline: 'November 30',
    selectionRounds: ['HackerEarth OA', 'DSA & LLD Round', 'Engineering Manager Round']
  }
];

const PRESETS = [
  {
    id: 'big_tech_swe_aspirant',
    label: 'Big Tech SWE Target (Google / Microsoft 1.25L/mo)',
    studentName: 'Tanya Sengupta',
    targetCategory: 'Big Tech',
    minStipend: 100000,
    github: 'https://github.com/tanya-sengupta',
    keySkills: ['Distributed Systems', 'Go / C++', 'LeetCode 450+ Solved', 'Redis']
  },
  {
    id: 'quant_hft_aspirant',
    label: 'Elite Quant & HFT Target (D. E. Shaw 3.5L/mo)',
    studentName: 'Kartik Varma',
    targetCategory: 'Quant/HFT',
    minStipend: 250000,
    github: 'https://github.com/kartik-v',
    keySkills: ['Modern C++20', 'Low Latency Networking', 'Stochastic Calculus', 'Codeforces Master']
  },
  {
    id: 'unicorn_builder_aspirant',
    label: 'High-Velocity Startup Target (Zepto / Razorpay)',
    studentName: 'Aditya Narayan',
    targetCategory: 'High-Growth Unicorn',
    minStipend: 75000,
    github: 'https://github.com/aditya-narayan',
    keySkills: ['Next.js / Node.js', 'PostgreSQL Query Optimization', 'Docker & Kubernetes', 'Kafka']
  }
];

class IndustryInternshipTrackerEngine {
  getInternships(filter = {}) {
    let list = [...INTERNSHIP_DIRECTORY];

    if (filter.category && filter.category !== 'all') {
      list = list.filter(item => item.category.toLowerCase().includes(filter.category.toLowerCase()));
    }

    if (filter.minStipend) {
      const min = parseInt(filter.minStipend, 10);
      if (!isNaN(min)) {
        list = list.filter(item => item.stipendMonthlyInr >= min);
      }
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(item =>
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getStipendIndex() {
    const stipends = INTERNSHIP_DIRECTORY.map(i => i.stipendMonthlyInr);
    const ppos = INTERNSHIP_DIRECTORY.map(i => i.ppoConversionRatePct);

    const avgStipend = Math.round(stipends.reduce((a, b) => a + b, 0) / stipends.length);
    const maxStipend = Math.max(...stipends);
    const minStipend = Math.min(...stipends);
    const avgPpoRate = Math.round(ppos.reduce((a, b) => a + b, 0) / ppos.length);

    // Breakdowns by category
    const categoryStats = {};
    INTERNSHIP_DIRECTORY.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, count: 0 };
      }
      categoryStats[item.category].total += item.stipendMonthlyInr;
      categoryStats[item.category].count += 1;
    });

    const categoryBreakdown = Object.keys(categoryStats).map(cat => ({
      category: cat,
      avgMonthlyStipend: Math.round(categoryStats[cat].total / categoryStats[cat].count)
    }));

    return {
      totalTrackedPrograms: INTERNSHIP_DIRECTORY.length,
      averageMonthlyStipendInr: avgStipend,
      maxMonthlyStipendInr: maxStipend,
      minMonthlyStipendInr: minStipend,
      averagePpoConversionPct: avgPpoRate,
      categoryBreakdown,
      currency: 'INR (₹)'
    };
  }

  getPresets() {
    return PRESETS;
  }

  /**
   * Generates a high-converting cold outreach / referral request message
   */
  generateReferralPitch(params) {
    const {
      candidateName = 'Candidate',
      company = 'Google',
      role = 'Software Engineering Intern',
      keySkills = ['Data Structures', 'C++', 'System Design'],
      githubProfile = 'https://github.com/profile'
    } = params;

    const skillsStr = Array.isArray(keySkills) ? keySkills.join(', ') : keySkills;

    const subjectLine = `Referral Request: ${role} - ${candidateName}`;
    const messageBody = `Hi [Alumni / Senior Engineer],

Hope you are having a productive week!

I am reaching out as a passionate pre-final year CS student with deep admiration for ${company}'s engineering culture and high-scale impact. I am targeting the ${role} opening.

A brief snapshot of my technical background:
• Core proficiencies: ${skillsStr}
• Portfolio & Proof-of-Work: ${githubProfile}
• I have rigorously solved 400+ algorithmic challenges and built distributed microservices.

If you believe my profile represents a solid technical match, would you be open to providing an internal employee referral for this opening? I have attached my 1-page standard ATS resume and job ID for your convenience.

Regardless, thank you so much for your time and guidance!

Warm regards,
${candidateName}`;

    return {
      company,
      role,
      subjectLine,
      messageBody,
      tips: [
        'Always include the exact Job ID link from the company career portal.',
        'Reach out on Tuesday or Wednesday morning (09:00 - 10:30 AM) for highest open rates.',
        'Never ask for a referral in the first sentence without stating your concrete technical credentials.'
      ]
    };
  }

  /**
   * Computes application pipeline metrics from a list of user applications
   */
  summarizePipeline(applications = []) {
    const stageCounts = {
      Saved: 0,
      Applied: 0,
      'OA Scheduled': 0,
      'Technical Round': 0,
      'Offer Received': 0
    };

    applications.forEach(app => {
      if (stageCounts[app.status] !== undefined) {
        stageCounts[app.status] += 1;
      } else {
        stageCounts.Applied += 1;
      }
    });

    const total = applications.length || 1;
    const interviewRate = parseFloat((((stageCounts['Technical Round'] + stageCounts['Offer Received']) / total) * 100).toFixed(1));
    const offerRate = parseFloat(((stageCounts['Offer Received'] / total) * 100).toFixed(1));

    return {
      totalApplications: applications.length,
      stageCounts,
      interviewRatePct: interviewRate,
      offerRatePct: offerRate,
      pipelineHealth: interviewRate >= 20 ? 'Optimal (High-Yield)' : 'Needs Referral Acceleration'
    };
  }
}

module.exports = new IndustryInternshipTrackerEngine();
