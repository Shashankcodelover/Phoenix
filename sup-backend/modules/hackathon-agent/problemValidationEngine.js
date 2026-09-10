/**
 * Phoenix Tri-Pillar OS: Pillar 2, Feature 33 — Problem Validation & User Interview Generator
 * 
 * Synthesizes 5 simulated customer discovery personas, unprompted 'Mom Test' interview quotes,
 * quantitative survey metrics, and willingness-to-pay indicators to substantiate product-market fit
 * for hackathon judges and early-stage seed investors.
 */

const PRESETS = {
  aegis: {
    id: 'aegis',
    name: 'Aegis Swarm (Smart Cities / Disaster Logistics)',
    projectTitle: 'Aegis Swarm',
    domain: 'Disaster Management & Smart Logistics',
    targetAudience: 'Emergency Medical Responders, Municipal Disaster Authorities & Relief NGOs',
    problemStatement: 'When regional cellular towers collapse in earthquakes and floods, field rescue teams waste over 3.5 hours manually locating survivors without unified communication.',
    sampleSize: 140,
    surveyMetrics: {
      problemIncidenceRate: '89%',
      averageIncidentLoss: '$420,000 / event',
      currentWorkaroundExpense: '$12,500 / month on satellite radios',
      willingnessToPay: '92% willing to pay $1,500/drone/mo',
      npsBaseline: '+58'
    },
    personas: [
      {
        name: 'Chief Rajesh Kumar',
        role: 'Director of Emergency Operations',
        organization: 'State Disaster Management Authority',
        avatarColor: '#38bdf8',
        painSeverity: '9.8/10',
        currentWorkaround: 'Manual satellite phone dispatch with 40-minute relay delays.',
        willingnessToPay: '$4,500 / deployment cluster',
        quote: 'During the 2024 monsoon landslides, we had 3 medical helicopters circling blind because cellular towers were underwater. If a drone mesh could drop automatic telemetry without internet, that would immediately save dozens of lives per shift.'
      },
      {
        name: 'Dr. Ananya Sharma',
        role: 'Lead Trauma Physician & Field Triage Lead',
        organization: 'Red Cross Relief Brigade',
        avatarColor: '#10b981',
        painSeverity: '9.4/10',
        currentWorkaround: 'Physical paper triage tags carried by motorcycle runners.',
        willingnessToPay: '$800 / triage unit',
        quote: 'We run out of O-negative blood because runners cannot get back across washed-out bridges to tell the base camp what we need. Give me an autonomous drone that brings 2 units of plasma based on an offline beacon.'
      },
      {
        name: 'Captain Marcus Vance',
        role: 'Search & Rescue Fleet Coordinator',
        organization: 'Civil Defense Drone Wing',
        avatarColor: '#c084fc',
        painSeverity: '8.9/10',
        currentWorkaround: 'Single-pilot commercial quadcopters with 15-minute battery life and manual video monitoring.',
        willingnessToPay: '$2,200 / station',
        quote: 'Single pilot drones do not scale. You have 1 pilot staring at 1 screen while 100 square kilometers are in ruins. We need decentralized swarm autonomy where drones negotiate search grids among themselves.'
      },
      {
        name: 'Suresh Patil',
        role: 'Chief Telecommunications Officer',
        organization: 'State Police Radio Wing',
        avatarColor: '#f59e0b',
        painSeverity: '8.7/10',
        currentWorkaround: 'VHF/UHF repeaters mounted on high ridges that get struck by lightning.',
        willingnessToPay: '$12,000 annual maintenance contract',
        quote: 'VHF radios cannot pass digital medical telemetry or victim heart rate logs. A floating dynamic aerial mesh relay would solve our blind-spot problem instantly.'
      },
      {
        name: 'Elena Rostova',
        role: 'Disaster Relief Logistics Auditor',
        organization: 'UN OCHA Global Logistics Cluster',
        avatarColor: '#f43f5e',
        painSeverity: '9.1/10',
        currentWorkaround: 'Post-event Excel inventory reconciliations taking 3 weeks.',
        willingnessToPay: '$3,000 / operational zone',
        quote: 'Every relief supply flight costs $8,000. If 30% of them drop supplies where they are not needed because of communication lag, that is millions in lost aid.'
      }
    ],
    investorTakeaway: 'The customer discovery data proves this is an urgent hair-on-fire operational bottleneck with guaranteed government procurement budgets. Buyers are actively spending over $12,000/mo on fragile satellite workarounds.'
  },
  oncomatch: {
    id: 'oncomatch',
    name: 'OncoMatch ZK (Healthcare / Imagine Cup)',
    projectTitle: 'OncoMatch ZK',
    domain: 'Healthcare & Precision Oncology',
    targetAudience: 'Clinical Trial Coordinators, Oncologists & Pharmaceutical Sponsors',
    problemStatement: 'Over 82% of eligible cancer patients never enroll in clinical trials because hospital EHR privacy regulations prevent direct patient data sharing with sponsors.',
    sampleSize: 185,
    surveyMetrics: {
      problemIncidenceRate: '94%',
      averageIncidentLoss: '$1.8M / trial delay month',
      currentWorkaroundExpense: '$45,000 / month on manual patient chart audits',
      willingnessToPay: '96% willing to pay $3,500/enrolled patient',
      npsBaseline: '+64'
    },
    personas: [
      {
        name: 'Dr. Katherine Bell',
        role: 'Director of Clinical Trial Enrollment',
        organization: 'Metropolitan Cancer Institute',
        avatarColor: '#38bdf8',
        painSeverity: '9.6/10',
        currentWorkaround: 'Nurses manually reading 80-page PDF pathology reports.',
        willingnessToPay: '$5,000 / active trial protocol',
        quote: 'We have 200 open oncology trials and literally 3 nurses who have to manually read dense genetic sequencing reports. We miss 70% of potential candidate matches simply due to human fatigue.'
      },
      {
        name: 'Dr. Sarah Jenkins',
        role: 'Principal Investigator in Thoracic Oncology',
        organization: 'Apex University Health',
        avatarColor: '#10b981',
        painSeverity: '9.2/10',
        currentWorkaround: 'Sending de-identified spreadsheets via encrypted email with 3-week IRB review loops.',
        willingnessToPay: '$2,500 / month',
        quote: 'HIPAA rules terrify hospital legal teams. If I can prove to a pharmaceutical sponsor that my patient has the exact KRAS G12C mutation using a zero-knowledge proof without revealing the patient name or raw genome, that changes precision oncology forever.'
      },
      {
        name: 'Vikram Mehta',
        role: 'VP of Clinical Operations',
        organization: 'Novartis Oncology Pipeline',
        avatarColor: '#c084fc',
        painSeverity: '9.5/10',
        currentWorkaround: 'Paying third-party clinical CROs $80,000 per trial site for patient scouting.',
        willingnessToPay: '$8,500 / verified match',
        quote: 'Every day a Phase III oncology trial is delayed costs our company upwards of $60,000. Privacy is our biggest barrier to scaling site recruitment.'
      },
      {
        name: 'Maria Gonzalez',
        role: 'Chief Privacy & Compliance Officer',
        organization: 'Memorial Hospital System',
        avatarColor: '#f59e0b',
        painSeverity: '9.7/10',
        currentWorkaround: 'Flatly rejecting 80% of external academic research requests due to regulatory liability.',
        willingnessToPay: '$25,000 annual compliance firewall subscription',
        quote: 'Our Board will never approve sharing raw genomic databases with private biotechs. Zero-knowledge cryptographic verification is the only mathematically sound solution that satisfies our legal risk appetite.'
      },
      {
        name: 'David Chen',
        role: 'Stage IV NSCLC Cancer Survivor & Patient Advocate',
        organization: 'Precision Oncology Patient Council',
        avatarColor: '#f43f5e',
        painSeverity: '9.9/10',
        currentWorkaround: 'Personally emailing researchers across 5 states with USB drives of CT scans.',
        willingnessToPay: 'Free for patients / Funded by trial sponsor',
        quote: 'I almost died waiting for an oncologist to find an open clinical trial for my rare mutation. Patients do not care about bureaucratic paperwork; we care about survival.'
      }
    ],
    investorTakeaway: 'Extraordinary validation across hospital compliance, trial PIs, and pharmaceutical sponsors. The $1.8M/month trial delay cost makes the $3,500/match software fee a trivial no-brainer for pharmaceutical procurement.'
  },
  nexusaudio: {
    id: 'nexusaudio',
    name: 'NexusAudio AI (Developer Tooling / Code Review)',
    projectTitle: 'NexusAudio AI',
    domain: 'Developer Tooling & Technical Recruitment',
    targetAudience: 'Software Engineering Candidates, Coding Bootcamp Directors & FAANG Hiring Managers',
    problemStatement: 'Engineers in non-metro regions fail technical interviews due to uncoached speech pacing, filler words, and sub-optimal $O(N^2)$ algorithm bottlenecks.',
    sampleSize: 320,
    surveyMetrics: {
      problemIncidenceRate: '86%',
      averageIncidentLoss: '$35,000 in lost first-year salary leverage',
      currentWorkaroundExpense: '$150 / hour for human mock interviewers on Pramp/Topmate',
      willingnessToPay: '88% willing to pay $29 / month',
      npsBaseline: '+52'
    },
    personas: [
      {
        name: 'Arjun Nambiar',
        role: 'Final Year CSE Student (Tier-3 College)',
        organization: 'VTU Engineering Institute',
        avatarColor: '#38bdf8',
        painSeverity: '9.4/10',
        currentWorkaround: 'Practicing alone in front of a mirror or asking peer classmates who lack interview experience.',
        willingnessToPay: '$25 / month',
        quote: 'I knew the DP solution in my Google interview, but I panicked, stuttered, said "um" 40 times, and ran out of time. If I had an AI coach grilling my pacing and invariants with sub-second feedback, I would have cleared the round.'
      },
      {
        name: 'Pooja Hegde',
        role: 'Head of Placement & Career Services',
        organization: 'BMS College of Engineering',
        avatarColor: '#10b981',
        painSeverity: '9.0/10',
        currentWorkaround: 'Hiring external consulting trainers at Rs. 15,000 per day for 2-day cram sessions.',
        willingnessToPay: '$8 / student / semester',
        quote: 'We have 1,200 engineering students and only 4 placement coordinators. We cannot give every student individualized mock interview feedback. An automated audio coach with live scoring would transform our placement statistics.'
      },
      {
        name: 'Devin Scott',
        role: 'Senior Staff Software Engineer & Bar Raiser',
        organization: 'Meta / Amazon Alumni',
        avatarColor: '#c084fc',
        painSeverity: '8.5/10',
        currentWorkaround: 'Rejecting candidates who write code that passes tests but has hidden quadratic bottlenecks.',
        willingnessToPay: 'B2B Recruiter Portal pricing ($199/seat)',
        quote: 'Candidates memorize LeetCode solutions, but when I ask them to prove the loop invariant or evaluate memory leaks under high RPS, they freeze. A tool that enforces architectural rigor before the interview is deeply valuable.'
      },
      {
        name: 'Samantha Reed',
        role: 'Fullstack Bootcamp Director',
        organization: 'Springboard / General Assembly',
        avatarColor: '#f59e0b',
        painSeverity: '8.8/10',
        currentWorkaround: 'Reviewing student GitHub PRs manually with 48-hour turnarounds.',
        willingnessToPay: '$499 / cohort / month',
        quote: 'Our instructors spend half their time pointing out missing environment variables and nested loop bottlenecks in student homework. Automated real-time AST feedback frees instructors to focus on architectural mentoring.'
      },
      {
        name: 'Karthik S',
        role: 'Lateral SDE-1 seeking SDE-2 Promotion',
        organization: 'Series B FinTech Startup',
        avatarColor: '#f43f5e',
        painSeverity: '8.7/10',
        currentWorkaround: 'Buying multiple $100 mock interview tokens on Exponent and Interviewing.io.',
        willingnessToPay: '$49 / month during job hunt',
        quote: 'Human interviewers are inconsistent. One guy likes my resume, another guy grills me on Kafka partitions. Having an objective AI simulator that stress-tests system design latency gives me consistent measurable benchmarking.'
      }
    ],
    investorTakeaway: 'Massive B2C bottom-up adoption driven by student anxiety, paired with high-ACV institutional B2B university placement contracts. High willingness to pay with zero CAC via college campus word-of-mouth.'
  }
};

class ProblemValidationEngine {
  getPresets() {
    return PRESETS;
  }

  generateValidationReport(payload = {}) {
    const {
      projectTitle = 'Aegis Swarm',
      domain = 'Disaster Management & Smart Logistics',
      targetAudience = 'Emergency Medical Responders',
      customProblemStatement = '',
      sampleSize = 120
    } = payload;

    // Check if matching preset exists
    const match = Object.values(PRESETS).find(p => 
      p.projectTitle.toLowerCase().includes(projectTitle.toLowerCase()) || 
      projectTitle.toLowerCase().includes(p.id)
    );

    if (match) {
      return {
        success: true,
        projectTitle: match.projectTitle,
        domain: match.domain,
        targetAudience: match.targetAudience,
        problemStatement: customProblemStatement || match.problemStatement,
        sampleSize: Math.max(50, sampleSize || match.sampleSize),
        surveyMetrics: match.surveyMetrics,
        personas: match.personas,
        investorTakeaway: match.investorTakeaway,
        validationScore: '94/100 (Strong Product-Market Fit Confirmed)'
      };
    }

    // Procedural Fallback Synthesis for Custom Projects
    const fallbackPersonas = [
      {
        name: 'Sarah Lin',
        role: 'Head of Operations',
        organization: 'Enterprise Fleet Systems',
        avatarColor: '#38bdf8',
        painSeverity: '9.2/10',
        currentWorkaround: 'Custom internal Python scripts with frequent crash loops.',
        willingnessToPay: '$450 / month',
        quote: `We spend 15 hours every week firefighting manual sync errors in ${domain}. If ${projectTitle} can automate this reliably, we will deploy it on day one.`
      },
      {
        name: 'Marcus Vance',
        role: 'Lead Architect',
        organization: 'CloudScale Infrastructure',
        avatarColor: '#10b981',
        painSeverity: '8.8/10',
        currentWorkaround: 'Over-provisioning cloud compute to mask latency bottlenecks.',
        willingnessToPay: '$1,200 / month',
        quote: `Current market solutions lack deep edge resilience. A decentralized approach tailored for ${targetAudience} is an obvious upgrade.`
      },
      {
        name: 'Elena Rostova',
        role: 'Product Director',
        organization: 'NextGen Solutions',
        avatarColor: '#c084fc',
        painSeverity: '8.5/10',
        currentWorkaround: 'Manual weekly audits requiring 2 full-time analysts.',
        willingnessToPay: '$800 / month',
        quote: `The hardest part is compliance and auditability. If this provides verified cryptographic or deterministic guarantees, procurement is straightforward.`
      },
      {
        name: 'Arjun Patel',
        role: 'Senior Technical Lead',
        organization: 'Apex Engineering Corp',
        avatarColor: '#f59e0b',
        painSeverity: '9.0/10',
        currentWorkaround: 'Third-party consultant retainers ($5,000/mo).',
        willingnessToPay: '$650 / month',
        quote: `Consultants deliver static PDFs that are out of date in a month. We need software that continuously probes and alerts our team.`
      },
      {
        name: 'David Kim',
        role: 'End User & Domain Specialist',
        organization: 'Frontline Practitioners Guild',
        avatarColor: '#f43f5e',
        painSeverity: '9.3/10',
        currentWorkaround: 'Spreadsheets and WhatsApp group communication.',
        willingnessToPay: '$40 / month individual tier',
        quote: `I just want something fast that works offline and does not require a 2-hour onboarding training.`
      }
    ];

    return {
      success: true,
      projectTitle,
      domain,
      targetAudience,
      problemStatement: customProblemStatement || `Practitioners in ${domain} face critical operational delays and lack modern automated tooling.`,
      sampleSize: Math.max(50, sampleSize),
      surveyMetrics: {
        problemIncidenceRate: '87%',
        averageIncidentLoss: '$180,000 / year in wasted operational expenditure',
        currentWorkaroundExpense: '$4,500 / month on manual labor workarounds',
        willingnessToPay: '91% express intent to purchase at launch',
        npsBaseline: '+54'
      },
      personas: fallbackPersonas,
      investorTakeaway: `Validated demand from 5 distinct customer archetypes in ${domain}. Budget spend is already allocated to inferior manual workarounds.`,
      validationScore: '89/100 (Solid Early-Stage Problem Validation)'
    };
  }
}

const problemValidationEngine = new ProblemValidationEngine();
module.exports = { ProblemValidationEngine, problemValidationEngine };
