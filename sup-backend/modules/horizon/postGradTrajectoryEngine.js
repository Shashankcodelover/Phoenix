/**
 * Feature 59: Post-Graduation Career Trajectory Forecaster
 * Simulates 1-year, 3-year, 5-year, and 10-year career progression, seniority ladders,
 * and compensation expansion across Individual Contributor (IC) vs Engineering Management (EM) tracks,
 * calibrated against historical industry transition matrices (Levels.fyi, Blind, Radford).
 */

const CAREER_TRACKS = {
  INDIVIDUAL_CONTRIBUTOR: {
    key: 'INDIVIDUAL_CONTRIBUTOR',
    name: 'Individual Contributor (Technical Depth Track)',
    ladder: [
      { stepYear: 0, title: 'Associate Software Engineer (L3)', expectedCtcLpa: 16.0, stockPct: 10, responsibilities: 'Feature implementation, unit testing, bug triaging' },
      { stepYear: 1, title: 'Software Development Engineer I (L3+)', expectedCtcLpa: 24.0, stockPct: 15, responsibilities: 'Independent module ownership, code reviews, telemetry' },
      { stepYear: 3, title: 'Software Development Engineer II (L4)', expectedCtcLpa: 42.0, stockPct: 25, responsibilities: 'System architecture, cross-team interfaces, mentoring juniors' },
      { stepYear: 5, title: 'Senior Software Engineer (L5)', expectedCtcLpa: 68.0, stockPct: 35, responsibilities: 'Domain technical lead, distributed scale, reliability SLOs' },
      { stepYear: 10, title: 'Staff / Principal Engineer (L6+)', expectedCtcLpa: 125.0, stockPct: 45, responsibilities: 'Company-wide architectural strategy, patents, tech steering' }
    ]
  },
  ENGINEERING_MANAGEMENT: {
    key: 'ENGINEERING_MANAGEMENT',
    name: 'Engineering Management (Leadership & Org Scale Track)',
    ladder: [
      { stepYear: 0, title: 'Software Engineer (L3)', expectedCtcLpa: 16.0, stockPct: 10, responsibilities: 'Technical foundations, agile execution, team ceremonies' },
      { stepYear: 1, title: 'Senior SDE / Tech Lead Track (L4)', expectedCtcLpa: 28.0, stockPct: 15, responsibilities: 'Sprint planning, project management, technical mentoring' },
      { stepYear: 3, title: 'Engineering Manager (EM 1)', expectedCtcLpa: 52.0, stockPct: 30, responsibilities: 'People management, hiring pipeline, team delivery OKRs' },
      { stepYear: 5, title: 'Senior Engineering Manager (EM 2)', expectedCtcLpa: 82.0, stockPct: 40, responsibilities: 'Multi-team management, headcount budgeting, stakeholder alignment' },
      { stepYear: 10, title: 'Director of Engineering / VP (L7+)', expectedCtcLpa: 150.0, stockPct: 50, responsibilities: 'Departmental P&L, strategic roadmaps, org culture leadership' }
    ]
  },
  AI_RESEARCH_SCIENTIST: {
    key: 'AI_RESEARCH_SCIENTIST',
    name: 'AI / Applied Research Scientist Track',
    ladder: [
      { stepYear: 0, title: 'Research Engineer / Associate (L3)', expectedCtcLpa: 22.0, stockPct: 15, responsibilities: 'Data pipeline engineering, model training benchmarks' },
      { stepYear: 1, title: 'Applied Scientist I (L4)', expectedCtcLpa: 36.0, stockPct: 25, responsibilities: 'Fine-tuning LLMs, novel loss formulations, conference submissions' },
      { stepYear: 3, title: 'Applied Scientist II (L5)', expectedCtcLpa: 62.0, stockPct: 35, responsibilities: 'Leading research initiatives, productionizing frontier models' },
      { stepYear: 5, title: 'Senior Applied Scientist (L6)', expectedCtcLpa: 95.0, stockPct: 45, responsibilities: 'Frontier AI foundational research, academic partnerships' },
      { stepYear: 10, title: 'Principal Research Scientist (L7)', expectedCtcLpa: 180.0, stockPct: 55, responsibilities: 'Lab leadership, groundbreaking architecture design, industry keynote' }
    ]
  }
};

const TRAJECTORY_PRESETS = [
  {
    id: 'faang_ic_pathway',
    label: 'Tier-1 Product / FAANG (IC Track: SDE 1 to Staff Engineer)',
    startingDomain: 'Cloud Distributed Systems',
    trackKey: 'INDIVIDUAL_CONTRIBUTOR',
    startingCtcLpa: 22.0,
    upskillCadence: 'HIGH (Quarterly Open-Source / Certifications)'
  },
  {
    id: 'startup_to_em_pathway',
    label: 'High-Growth Tech Startup (IC to Engineering Management)',
    startingDomain: 'Full Stack & Product Engineering',
    trackKey: 'ENGINEERING_MANAGEMENT',
    startingCtcLpa: 18.0,
    upskillCadence: 'MODERATE (Leadership & Architecture)'
  },
  {
    id: 'genai_research_pathway',
    label: 'Frontier AI Lab (Research Engineer to Principal Scientist)',
    startingDomain: 'Deep Learning & Foundation Models',
    trackKey: 'AI_RESEARCH_SCIENTIST',
    startingCtcLpa: 25.0,
    upskillCadence: 'VERY HIGH (NeurIPS/ICLR Publications)'
  }
];

class PostGradTrajectoryEngine {
  getCareerTracks() {
    return Object.values(CAREER_TRACKS);
  }

  getPresets() {
    return TRAJECTORY_PRESETS;
  }

  /**
   * Forecasts multi-year progression curve based on starting CTC and selected track.
   */
  forecastTrajectory(params) {
    const {
      trackKey = 'INDIVIDUAL_CONTRIBUTOR',
      startingCtcLpa = 18.0,
      upskillCadence = 'HIGH'
    } = params;

    const track = CAREER_TRACKS[trackKey] || CAREER_TRACKS.INDIVIDUAL_CONTRIBUTOR;
    const baseFirstYear = Math.max(5.0, parseFloat(startingCtcLpa) || 18.0);

    // Multiplier for upskilling cadence
    let growthMultiplier = 1.0;
    if (upskillCadence.includes('VERY HIGH')) growthMultiplier = 1.25;
    else if (upskillCadence.includes('HIGH')) growthMultiplier = 1.15;
    else if (upskillCadence.includes('LOW')) growthMultiplier = 0.85;

    const forecastTimeline = track.ladder.map(milestone => {
      // Scale milestone CTC relative to starting compensation
      const baselineLadderStart = track.ladder[0].expectedCtcLpa;
      const ratio = milestone.expectedCtcLpa / baselineLadderStart;
      const computedCtc = parseFloat((baseFirstYear * ratio * (milestone.stepYear === 0 ? 1.0 : growthMultiplier)).toFixed(1));
      const equityComponentLpa = parseFloat(((computedCtc * milestone.stockPct) / 100).toFixed(1));
      const cashComponentLpa = parseFloat((computedCtc - equityComponentLpa).toFixed(1));

      return {
        year: milestone.stepYear,
        label: milestone.stepYear === 0 ? 'Year 0 (Entry Grad)' : `Year ${milestone.stepYear}`,
        title: milestone.title,
        totalCtcLpa: computedCtc,
        cashComponentLpa,
        equityComponentLpa,
        equityPct: milestone.stockPct,
        responsibilities: milestone.responsibilities
      };
    });

    const yr5Ctc = forecastTimeline.find(m => m.year === 5)?.totalCtcLpa || 65.0;
    const yr10Ctc = forecastTimeline.find(m => m.year === 10)?.totalCtcLpa || 120.0;
    const cagr10Yr = parseFloat(((Math.pow(yr10Ctc / baseFirstYear, 1 / 10) - 1) * 100).toFixed(1));

    return {
      trackKey: track.key,
      trackName: track.name,
      startingCtcLpa: baseFirstYear,
      upskillCadence,
      cagr10YrPct: cagr10Yr,
      fiveYearTargetCtcLpa: yr5Ctc,
      tenYearTargetCtcLpa: yr10Ctc,
      timeline: forecastTimeline,
      strategicInsights: [
        `Compound Annual Growth Rate (CAGR) over 10 years is forecasted at ${cagr10Yr}%.`,
        `By Year 5, equity / ESOP allocation expands to 35-40% of total compensation.`,
        `Transitioning from L4 to L5 at Year 3-5 represents the highest non-linear compensation leap.`
      ]
    };
  }
}

const postGradTrajectoryEngine = new PostGradTrajectoryEngine();

module.exports = {
  PostGradTrajectoryEngine,
  postGradTrajectoryEngine
};
