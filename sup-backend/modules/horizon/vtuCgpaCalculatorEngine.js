/**
 * Phoenix Apex Ultra: Feature 39 — VTU CBCS CGPA to Percentage & Eligibility Engine
 * 
 * Computes official VTU 2018/2021/2022 scheme conversion [Percentage = (CGPA - 0.75) * 10]
 * and benchmarks institutional placement drive eligibility across Service, Tier-1, and FAANG tiers.
 */

class VtuCgpaCalculatorEngine {
  /**
   * Converts VTU CBCS CGPA to percentage and evaluates company placement eligibility.
   */
  convertCgpa(payload = {}) {
    const {
      cgpa = 8.42,
      scheme = '2022 Scheme CBCS',
      activeBacklogs = 0,
      historicalBacklogs = 0
    } = payload;

    // Official VTU CBCS conversion formula: (CGPA - 0.75) * 10
    const rawPercentage = (cgpa - 0.75) * 10;
    const percentage = Math.max(0, Math.min(100, parseFloat(rawPercentage.toFixed(2))));

    const eligibilityProfiles = [
      {
        tier: 'Mass Recruiters (TCS, Infosys, Wipro, Accenture)',
        minimumCgpa: 6.75,
        minimumPercentage: 60.0,
        maxActiveBacklogs: 0,
        isEligible: cgpa >= 6.75 && activeBacklogs === 0
      },
      {
        tier: 'Tier-1 Product Tech (Cisco, Oracle, Dell, SAP, PhonePe)',
        minimumCgpa: 7.75,
        minimumPercentage: 70.0,
        maxActiveBacklogs: 0,
        isEligible: cgpa >= 7.75 && activeBacklogs === 0
      },
      {
        tier: 'FAANG & Global High-Frequency Trading (Google, Microsoft, Uber)',
        minimumCgpa: 8.0,
        minimumPercentage: 72.5,
        maxActiveBacklogs: 0,
        isEligible: cgpa >= 8.0 && activeBacklogs === 0
      }
    ];

    return {
      success: true,
      cgpa,
      scheme,
      percentage: `${percentage}%`,
      conversionFormula: 'Percentage = (CGPA - 0.75) * 10 (VTU CBCS Circular)',
      classAwarded: percentage >= 70 ? 'First Class with Distinction (FCD)' : percentage >= 60 ? 'First Class (FC)' : 'Second Class',
      backlogStatus: activeBacklogs === 0 ? 'Clean Record (0 Active Backlogs)' : `⚠️ ${activeBacklogs} Active Backlog(s) Flagged`,
      eligibilityProfiles
    };
  }
}

const vtuCgpaCalculatorEngine = new VtuCgpaCalculatorEngine();
module.exports = { VtuCgpaCalculatorEngine, vtuCgpaCalculatorEngine };
