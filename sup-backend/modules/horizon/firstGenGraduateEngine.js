/**
 * Phoenix Apex Ultra: Feature 46 — First-Generation Engineering Graduate Toolkit Engine
 * 
 * Provides verified first-graduate status diagnostics, fee concession modeling (up to ₹1,00,000/4-yrs),
 * Tahsildar document verification checklists, and tailored 4-year academic mentorship roadmaps.
 */

class FirstGenGraduateEngine {
  /**
   * Evaluates first-generation graduate eligibility, financial concessions, and roadmap.
   */
  evaluateFirstGenProfile(payload = {}) {
    const {
      fatherEducation = '10th Standard',
      motherEducation = '8th Standard',
      siblingGraduates = 0,
      annualFamilyIncomeInr = 350000
    } = payload;

    const isFirstGenEligible = siblingGraduates === 0 &&
      !fatherEducation.toLowerCase().includes('degree') &&
      !fatherEducation.toLowerCase().includes('b.e') &&
      !fatherEducation.toLowerCase().includes('graduate') &&
      !motherEducation.toLowerCase().includes('degree') &&
      !motherEducation.toLowerCase().includes('graduate');

    const annualFeeConcessionInr = isFirstGenEligible ? 25000 : 0;
    const fourYearConcessionInr = annualFeeConcessionInr * 4;

    return {
      success: true,
      isFirstGenEligible,
      concessionBadge: isFirstGenEligible ? 'Verified First-Generation Engineering Scholar' : 'Standard Applicant',
      financialAssistance: {
        annualTuitionConcession: `₹${annualFeeConcessionInr.toLocaleString('en-IN')}/year`,
        totalFourYearSavings: `₹${fourYearConcessionInr.toLocaleString('en-IN')}`,
        applicableScholarships: ['SSP Post-Matric Fee Waiver', 'AICTE Pragati / Saksham Scheme', 'Vidyasiri Hostel Stipend']
      },
      documentChecklist: [
        'First-Generation Graduate Certificate issued by Tahsildar / Revenue Department (RD No.)',
        'Family Tree / Vamshavruksha Affidavit registered with Sub-Registrar',
        'Parents\' School Transfer Certificate (TC) or No-Degree Undertaking',
        'Income & Caste Certificate with RD Validation'
      ],
      academicMilestonePlaybook: [
        'Sem 1-2: Bridge technical vernacular to English CS terms + Core VTU C & Data Structures.',
        'Sem 3-4: Object-Oriented Programming (Java/C++) + Git & GitHub Open-Source Portfolio.',
        'Sem 5-6: FAANG LeetCode Algorithmic Mastery + Live System Design Whiteboard Labs.',
        'Sem 7-8: Tier-1 Campus Placement Drives & Counter-Offer Compensation Negotiation.'
      ]
    };
  }
}

const firstGenGraduateEngine = new FirstGenGraduateEngine();
module.exports = { FirstGenGraduateEngine, firstGenGraduateEngine };
