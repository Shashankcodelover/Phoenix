/**
 * Phoenix Apex Ultra: Feature 60 — Karnataka Incubator Seed Grants & Patent Subsidy Engine
 * 
 * Matches engineering students with DST NIDHI-TBI college incubators, Elevate 100 grants (₹25L),
 * and Karnataka Startup Policy patent filing reimbursements.
 */

const COLLEGE_INCUBATOR_REGISTRY = {
  'RVCE': {
    incubatorName: 'RV Centre for Innovation, Incubation & Entrepreneurship (CIIL)',
    dstNidhiGrant: '₹10,00,000 (DST NIDHI-EIR / PRAYAS)',
    patentReimbursement: '₹2,00,000 via Karnataka Startup Policy 2022-2027',
    institutionalEquityCap: '0% (Non-dilutive for active undergrads)',
    alumniNetwork: 'RVCE Alumni Angel Syndicate (DeepTech & SaaS Focus)'
  },
  'BMSCE': {
    incubatorName: 'BMS Centre for Innovation, Incubation & Entrepreneurship',
    dstNidhiGrant: '₹7,50,000 (NIDHI TBI Seed Support)',
    patentReimbursement: '₹2,00,000 State Subsidy',
    institutionalEquityCap: '0% - 2% depending on lab IP usage',
    alumniNetwork: 'BMS Global Alumni Network'
  },
  'PESU': {
    incubatorName: 'PESU Venture Labs (PVL) Seed Fund',
    dstNidhiGrant: '₹15,00,000 Pre-Seed Accelerator Grant',
    patentReimbursement: '₹1,50,000 University IP Fund',
    institutionalEquityCap: '3% Advisory Warrant',
    alumniNetwork: 'PESU Angel Syndicate (Fintech & AI)'
  }
};

class IncubatorGrantEngine {
  /**
   * Matches college startup with institutional grant pools and patent subsidies.
   */
  matchGrants(payload = {}) {
    const { collegeKey = 'RVCE', startupDomain = 'AI & Developer Tools' } = payload;
    const incubator = COLLEGE_INCUBATOR_REGISTRY[collegeKey] || COLLEGE_INCUBATOR_REGISTRY['RVCE'];

    return {
      success: true,
      collegeKey,
      startupDomain,
      incubatorDetails: {
        centreName: incubator.incubatorName,
        availableGrantPool: incubator.dstNidhiGrant,
        patentFilingSubsidy: incubator.patentReimbursement,
        capTableEquityTerms: incubator.institutionalEquityCap,
        alumniSyndicate: incubator.alumniNetwork
      },
      karnatakaElevateFastTrack: {
        scheme: 'Elevate Karnataka 100',
        maximumGrant: '₹25,00,000 (Equity-Free State Grant)',
        eligibility: 'Registered Karnataka Private Limited / LLP with Tech Prototype'
      },
      patentFilingRoadmap: [
        'Step 1: File Provisional Patent with Controller General of Patents, Designs and Trade Marks (CGPDTM)',
        'Step 2: Submit Grant Application to Karnataka Innovation and Technology Society (KITS)',
        'Step 3: Receive 100% reimbursement of patent attorney and statutory fees up to ₹2.0 Lakhs'
      ]
    };
  }
}

const incubatorGrantEngine = new IncubatorGrantEngine();
module.exports = { IncubatorGrantEngine, incubatorGrantEngine, COLLEGE_INCUBATOR_REGISTRY };
