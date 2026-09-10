/**
 * facultyLorDrafterEngine.js
 * Feature 55: Faculty Recommendation Letter (LOR) Drafter
 * 
 * Provides:
 *  - Formal academic & industry recommendation letter synthesis.
 *  - Quantified peer benchmarking (top 1-5% class cohort).
 *  - Concrete anecdotal project & research evidence integration.
 *  - Endorsement Strength evaluation and institutional verification checklist.
 */

const LOR_ARCHETYPES = [
  {
    id: 'ACADEMIC_RESEARCH_PROFESSOR',
    name: 'Research Mentor / Lab Director LOR',
    focus: 'Research Rigor, Empirical Methodologies, Paper Publications & Independent Problem Solving',
    recommendedFor: 'Global MS/PhD with Thesis & Research Assistantship Applications'
  },
  {
    id: 'COURSEWORK_FACULTY_HOD',
    name: 'Department HOD / Core Coursework Professor LOR',
    focus: 'Academic Mastery, Class Ranking, Capstone Project Execution & Academic Integrity',
    recommendedFor: 'Graduate Admissions & Fellowship Committees'
  },
  {
    id: 'INDUSTRY_TECH_LEAD_MANAGER',
    name: 'Industry Engineering Manager / Tech Lead LOR',
    focus: 'Production Systems, Code Velocity, Cross-Functional Collaboration & Technical Leadership',
    recommendedFor: 'Professional Master Degrees, MBA, and Full-Time Lateral Hiring'
  }
];

const PRESETS = [
  {
    id: 'research_mentor_top1',
    label: 'Undergraduate Research Mentor (Top 1% + EMNLP Paper)',
    archetypeId: 'ACADEMIC_RESEARCH_PROFESSOR',
    candidateName: 'Akash Narayanan',
    recommenderName: 'Dr. S. K. Ramanathan',
    recommenderTitle: 'Professor & Head of Intelligent Systems Lab',
    institution: 'National Institute of Technology (NIT)',
    relationshipDuration: '2 years as undergraduate research assistant',
    courseOrLabTaught: 'Deep Learning & Natural Language Processing Lab',
    candidateRankPercentile: 'Top 1% among 180 students',
    keyProjectHighlight: 'Formulated a novel speculative decoding pipeline for 70B LLMs, resulting in an accepted workshop paper at EMNLP 2025 and 42% inference latency reduction.',
    softSkills: 'Intellectual fearlessness, rapid assimilation of mathematical proofs, and collaborative lab leadership.',
    targetDegree: 'M.S. / Ph.D. in Computer Science'
  },
  {
    id: 'hod_coursework_top2',
    label: 'Department HOD (Advanced Operating Systems Top Ranker)',
    archetypeId: 'COURSEWORK_FACULTY_HOD',
    candidateName: 'Rhea Chakraborty',
    recommenderName: 'Dr. Meenakshi Sundaram',
    recommenderTitle: 'Head of Department, Computer Science & Engineering',
    institution: 'RV College of Engineering',
    relationshipDuration: '3 academic semesters as course instructor and project evaluator',
    courseOrLabTaught: 'Advanced Operating Systems & Distributed Architecture',
    candidateRankPercentile: 'Rank 2 out of 145 students (Top 1.5%)',
    keyProjectHighlight: 'Engineered a Raft-replicated transactional key-value store in Modern C++ with multi-threaded RPC engines sustaining 180k ops/sec.',
    softSkills: 'Exemplary academic discipline, active participation in seminars, and mentoring junior batchmates.',
    targetDegree: 'M.S. in Computer Science'
  },
  {
    id: 'industry_manager_swe',
    label: 'Big Tech Engineering Manager (SWE Summer Intern)',
    archetypeId: 'INDUSTRY_TECH_LEAD_MANAGER',
    candidateName: 'Sanjay Krishnan',
    recommenderName: 'Vikramaditya Sengupta',
    recommenderTitle: 'Staff Engineering Manager, Cloud Infrastructure',
    institution: 'Microsoft India R&D',
    relationshipDuration: '3-month summer internship manager',
    courseOrLabTaught: 'Core Azure Reliability & Kubernetes Orchestration Team',
    candidateRankPercentile: 'Top 5% among summer intern cohort of 40',
    keyProjectHighlight: 'Shipped an automated canary rollout validator in Go that caught 3 critical regressions prior to staging deployment.',
    softSkills: 'Production engineering mindset, high receptiveness to code review feedback, and crisp technical communication.',
    targetDegree: 'Master of Engineering / Professional MS'
  }
];

class FacultyLorDrafterEngine {
  getLorArchetypes() {
    return LOR_ARCHETYPES;
  }

  getPresets() {
    return PRESETS;
  }

  /**
   * Synthesizes a formal, high-impact recommendation letter
   */
  draftLOR(params) {
    const {
      archetypeId = 'ACADEMIC_RESEARCH_PROFESSOR',
      candidateName = 'Candidate',
      recommenderName = 'Dr. Recommender',
      recommenderTitle = 'Professor of Computer Science',
      institution = 'University Department of Computer Science',
      relationshipDuration = '2 years',
      courseOrLabTaught = 'Advanced Algorithms',
      candidateRankPercentile = 'Top 2% of the class',
      keyProjectHighlight = 'Engineered distributed systems capstone with outstanding benchmarks.',
      softSkills = 'Strong analytical curiosity and teamwork.',
      targetDegree = 'M.S. in Computer Science'
    } = params;

    const archetype = LOR_ARCHETYPES.find(a => a.id === archetypeId) || LOR_ARCHETYPES[0];

    const salutation = 'To the Graduate Admissions Committee,';

    // Paragraph 1: Recommender relationship and unequivocal endorsement
    const para1 = `It is with the utmost enthusiasm that I write this letter of recommendation for ${candidateName}, who is applying to your esteemed ${targetDegree} program. I write in my capacity as ${recommenderTitle} at ${institution}, having known and mentored ${candidateName} for over ${relationshipDuration} in ${courseOrLabTaught}. Over my decades of teaching and mentoring promising young engineers, only a select handful have displayed the intellectual depth and research tenacity that ${candidateName} consistently demonstrates. In terms of academic aptitude and problem-solving capability, I place ${candidateName} unequivocally in the ${candidateRankPercentile}.`;

    // Paragraph 2: Academic rigor and intellectual curiosity
    const para2 = `During our academic interactions in ${courseOrLabTaught}, ${candidateName} demonstrated a rare appetite for first-principles reasoning. Rather than merely mastering textbook methodologies, ${candidateName} repeatedly investigated edge conditions and non-trivial algorithmic complexities. In classroom discussions, questions posed by ${candidateName} often elevated the intellectual discourse of the entire lecture cohort, reflecting a maturity well beyond undergraduate expectations.`;

    // Paragraph 3: Research crucible and concrete project impact
    const para3 = `The clearest demonstration of ${candidateName}'s capabilities materialized in a major project milestone under my oversight: ${keyProjectHighlight}. What impressed me most was not merely the successful final benchmark, but the systematic engineering rigor with which roadblocks were navigated. ${candidateName} tackled performance bottlenecks with scientific precision, conducting controlled profiling experiments and validating hypotheses through reproducible tests.`;

    // Paragraph 4: Soft skills, character, and collaboration
    const para4 = `Beyond technical acumen, ${candidateName} possesses exceptional interpersonal character. Marked by ${softSkills}, ${candidateName} seamlessly balances fierce individual curiosity with generous team collaboration. Fellow students and lab colleagues frequently turned to ${candidateName} for clarity on intricate concepts, a testament to an innate ability to deconstruct complexity into lucid insights.`;

    // Paragraph 5: Concluding absolute recommendation
    const para5 = `In summary, ${candidateName} embodies every attribute required to thrive in a demanding, research-intensive graduate environment. I offer my highest, unreserved recommendation and have no doubt that ${candidateName} will make distinguished, lasting contributions to your academic community. Please do not hesitate to contact me should you require any additional perspectives.`;

    const signoff = [
      'Sincerely,',
      recommenderName,
      recommenderTitle,
      institution,
      'Email: [Official Institutional .edu Address]',
      'Phone: [Department Office Direct]'
    ].join('\n');

    const fullLetter = [
      salutation,
      para1,
      para2,
      para3,
      para4,
      para5,
      signoff
    ].join('\n\n');

    const wordCount = fullLetter.trim().split(/\s+/).length;

    // Endorsement strength evaluation (0-100)
    let endorsementScore = 94;
    if (candidateRankPercentile.toLowerCase().includes('top 1') || candidateRankPercentile.toLowerCase().includes('top 2')) {
      endorsementScore += 3;
    }
    if (keyProjectHighlight.length > 50) {
      endorsementScore += 2;
    }

    return {
      candidateName,
      recommenderName,
      recommenderTitle,
      institution,
      archetype: archetype.name,
      wordCount,
      endorsementScore: Math.min(100, endorsementScore),
      quantifiedClassStanding: candidateRankPercentile,
      sections: {
        salutation,
        introduction: para1,
        academicRigor: para2,
        concreteEvidence: para3,
        characterAndLeadership: para4,
        conclusion: para5,
        signatureBlock: signoff
      },
      fullLetter,
      verificationChecklist: [
        'Class cohort ranking is precisely quantified (avoids vague "one of the best" rhetoric).',
        'Specific project anecdote with measurable results included to satisfy top-tier admissions rubric.',
        'Faculty signature block prepared for official letterhead printing and institutional .edu submission.'
      ]
    };
  }
}

module.exports = new FacultyLorDrafterEngine();
