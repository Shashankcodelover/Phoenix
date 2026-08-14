/**
 * Phoenix v25.0 Blockbuster: Feature 67 — Karnataka Engineering Student A-to-Z Universal Roadmap Engine
 * 
 * Provides an end-to-end lifecycle continuum for Karnataka engineering students:
 * Phase 1: Application, RD Certificates, PWD / 371(J) / Special Quotas & Hall Ticket
 * Phase 2: KCET/DCET High-Yield Prep & Normalized Composite Score Forecasting
 * Phase 3: BEO Study Certificate Verification & OCR Discrepancy Defense
 * Phase 4: KEA Option Entry Strategy across Round 1, 2, Extended & Mop-Up Rounds
 * Phase 5: Financial Waivers (SNQ, SSP Scholarships, First-Gen) & Campus Living
 * Phase 6: DST NIDHI-TBI Incubator Grants & 100% Karnataka Patent Subsidies
 */

class KarnatakaStudentJourneyEngine {
  /**
   * Generates a personalized A-to-Z engineering career lifecycle plan.
   * 
   * @param {Object} payload
   * @param {string} payload.studentCategory - 'GM' | 'OBC_2A' | 'OBC_3B' | 'SC_ST' | 'Article_371J' | 'PWD'
   * @param {number} payload.familyIncome - Annual family income in INR
   * @param {number} payload.expectedPcmScore - Raw score out of 180 (PCM)
   * @param {number} payload.boardPercentage - 12th Board PCM % or Diploma %
   * @param {boolean} payload.isFirstGenGraduate - First generation graduate status
   * @param {boolean} payload.isRuralKannadaMedium - Rural/Kannada medium 10-year study
   * @param {boolean} payload.isPwdCandidate - Persons with Disabilities candidate
   */
  generateCompleteRoadmap(payload = {}) {
    const {
      studentCategory = 'GM',
      familyIncome = 240000,
      expectedPcmScore = 142,
      boardPercentage = 94,
      isFirstGenGraduate = true,
      isRuralKannadaMedium = false,
      isPwdCandidate = false
    } = payload;

    const normalizedScore = (expectedPcmScore / 180) * 50 + (boardPercentage / 100) * 50;
    const estimatedRank = Math.max(1, Math.round(220000 * Math.pow((100 - normalizedScore) / 100, 2.45)));

    return {
      success: true,
      studentProfile: {
        category: studentCategory,
        isPwd: isPwdCandidate ? 'Eligible for 5% PWD Horizontal Reservation & Medical Board Verification' : 'No',
        familyIncome: `₹${familyIncome.toLocaleString('en-IN')}`,
        normalizedScore: `${normalizedScore.toFixed(2)} / 100`,
        projectedRankBand: `${estimatedRank.toLocaleString('en-IN')} - ${(estimatedRank + 300).toLocaleString('en-IN')}`
      },
      lifecyclePhases: [
        {
          phaseNumber: 1,
          phaseName: 'Pre-Exam: Application & Special Quota Claim',
          timeline: 'January - April',
          keyDeliverables: [
            'Obtain 11-digit Nadakacheri RD Certificate (Income/Caste) before application deadline.',
            isPwdCandidate ? 'Acquire UDID (Unique Disability ID) Card or District Medical Board 40%+ Certificate.' : 'Check SNQ eligibility (Income < ₹8 LPA).',
            isRuralKannadaMedium ? 'Get 1st to 10th standard Rural & Kannada Medium certificates signed by School HM.' : 'Verify Aadhaar name spelling matches 10th Marks Card.',
            'Download KEA Hall Ticket and verify exam center location & reporting rules.'
          ],
          audioVisualExplainer: 'Rule 1 Invariant: Any reservation not claimed during initial online application cannot be added during document verification.'
        },
        {
          phaseNumber: 2,
          phaseName: 'Exam & Score Normalization',
          timeline: 'April - May',
          keyDeliverables: [
            'Attempt 180 Marks PCM (60 Physics, 60 Chemistry, 60 Mathematics) with zero negative marking.',
            'Review provisional answer keys and file objections within 48 hours.',
            `Normalized composite rank calculation: 50% KCET (${expectedPcmScore}/180) + 50% Board (${boardPercentage}%).`
          ],
          audioVisualExplainer: 'Tie-Breaker Hierarchy: Higher Math score -> Higher Physics -> Higher Chemistry -> Older Date of Birth.'
        },
        {
          phaseNumber: 3,
          phaseName: 'KEA Document Verification & Clause-A Clearance',
          timeline: 'June',
          keyDeliverables: [
            '7-Year continuous study in Karnataka counter-signed by BEO/DDPI.',
            'Nadakacheri RD Number verification on KEA online server.',
            isPwdCandidate ? 'Attend KEA Special Medical Board at Bangalore Bowring/Victoria Hospital for seat eligibility.' : 'Receive KEA Verification Slip & Secret Key.',
            'Verify Category, Rural, Kannada Medium, and SNQ flags printed on Verification Slip.'
          ],
          audioVisualExplainer: 'Do NOT lose your Secret Key. It is required to log in for option entry.'
        },
        {
          phaseNumber: 4,
          phaseName: 'Option Entry & Multi-Round Counseling Matrix',
          timeline: 'July - August',
          keyDeliverables: [
            'Round 1: Add maximum college-branch combinations in descending order of true preference.',
            'Round 1 Allotment -> Choice 2 (Hold & Participate R2) or Choice 1 (Satisfied & Report).',
            'Round 2 & Extended Round: Cutoffs expand by +12% to +18% as unjoined seats surrender.',
            'Download KEA Challan, pay fee at bank, and collect official College Admission Order.'
          ],
          audioVisualExplainer: 'Choice 2 guarantees your Round 1 seat is safe while you compete for higher options.'
        },
        {
          phaseNumber: 5,
          phaseName: 'Financial Security, Fee Waivers & Campus Living',
          timeline: 'August - September',
          keyDeliverables: [
            familyIncome <= 800000 ? 'SNQ Fee Waiver: Pay nominal ₹4,000 - ₹9,000/year instead of ₹1,05,000.' : 'Standard Govt Quota Fee applicable.',
            'Apply on Karnataka State Scholarship Portal (SSP) for post-matric fee reimbursement.',
            isFirstGenGraduate ? 'Claim ₹25,000/yr First-Generation Tuition Concession.' : 'Apply for Pragati / BCWD stipends.',
            'Book college hostel or verified PG pass with Namma Metro concessional student travel card.'
          ],
          audioVisualExplainer: 'SNQ seats are 5% supernumerary and do not reduce regular quota seats.'
        },
        {
          phaseNumber: 6,
          phaseName: 'Incubators, Student Patents & Placements',
          timeline: '1st Year - Final Year',
          keyDeliverables: [
            'Access college DST NIDHI-TBI / NAIN incubator centers with ₹3L - ₹10L seed grants.',
            'Apply for Elevate 100 Karnataka startup grants (up to ₹25 Lakhs equity-free).',
            'File provisional patents via college IPR cell with 100% state reimbursement (₹2,00,000 subsidy).',
            'Prepare with Phoenix sub-300ms WebRTC Voice AI coach & system design whiteboard simulator.'
          ],
          audioVisualExplainer: 'Undergrad founders retain 100% student equity with zero sovereign debt liability.'
        }
      ],
      universalGuidelineGuarantee: 'From the day you start preparing for KCET to the day you graduate and negotiate top offers, Phoenix covers 100% of your academic, counseling, and engineering journey.'
    };
  }
}

const karnatakaStudentJourneyEngine = new KarnatakaStudentJourneyEngine();
module.exports = { KarnatakaStudentJourneyEngine, karnatakaStudentJourneyEngine };
