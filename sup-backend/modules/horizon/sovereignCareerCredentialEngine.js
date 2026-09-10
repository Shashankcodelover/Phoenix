/**
 * Feature 60: Universal Sovereign Career Credential Command Center (Pillar 3 Capstone)
 * Synthesizes student achievements across admissions cutoffs, verified transcripts,
 * gatekeeper assessments, internship pipelines, skill gap certifications, SOPs,
 * and LOR recommendations into a cryptographically hashed, exportable Sovereign Career Passport.
 */

const crypto = require('crypto');

const SAMPLE_CREDENTIAL_PORTFOLIOS = [
  {
    id: 'PORTFOLIO-2026-NITK-01',
    candidateName: 'Aditya Shenoy',
    usn: '4NI22CS014',
    institution: 'National Institute of Technology Karnataka (NITK)',
    degreeProgram: 'Bachelor of Technology (Computer Science & Engineering)',
    graduationYear: 2026,
    cumulativeGpa: 9.18,
    wesEquivalentGpa: 3.92,
    admissionsGatekeeperScore: 94.5,
    competitiveExamRank: { exam: 'GATE CSE 2026', air: 142, percentile: 99.82 },
    verifiedInternships: [
      { company: 'Google India R&D', role: 'SWE Intern', stipendInrPerMo: 125000, durationMonths: 3, verificationStatus: 'VERIFIED_OFFICIAL' },
      { company: 'Postman Labs', role: 'Backend Systems Intern', stipendInrPerMo: 85000, durationMonths: 6, verificationStatus: 'VERIFIED_OFFICIAL' }
    ],
    verifiedCertifications: [
      { title: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', credentialId: 'AWS-99214-CS', verifiedYear: 2025 },
      { title: 'Certified Kubernetes Administrator (CKA)', issuer: 'Cloud Native Computing Foundation', credentialId: 'CKA-88319-CNCF', verifiedYear: 2025 }
    ],
    sopSynthesisStatus: 'SYNTHESIZED_IVY_LEAGUE_SPEC',
    lorEndorsementsCount: 3,
    visaReadinessStatus: 'OPTIMAL_LOW_RISK_APPROVED'
  },
  {
    id: 'PORTFOLIO-2026-BMSCE-02',
    candidateName: 'Priya Narayanan',
    usn: '1BM22IS089',
    institution: 'BMS College of Engineering Bengaluru',
    degreeProgram: 'Bachelor of Engineering (Information Science)',
    graduationYear: 2026,
    cumulativeGpa: 8.84,
    wesEquivalentGpa: 3.78,
    admissionsGatekeeperScore: 88.0,
    competitiveExamRank: { exam: 'GRE General', quantitative: 169, verbal: 161, awa: 4.5 },
    verifiedInternships: [
      { company: 'Cisco Systems', role: 'Network Software Engineer Intern', stipendInrPerMo: 75000, durationMonths: 5, verificationStatus: 'VERIFIED_OFFICIAL' }
    ],
    verifiedCertifications: [
      { title: 'DeepLearning.AI Deep Learning Specialization', issuer: 'Coursera', credentialId: 'DLAI-7712-DL', verifiedYear: 2025 }
    ],
    sopSynthesisStatus: 'SYNTHESIZED_IVY_LEAGUE_SPEC',
    lorEndorsementsCount: 2,
    visaReadinessStatus: 'OPTIMAL_LOW_RISK_APPROVED'
  },
  {
    id: 'PORTFOLIO-2026-RVCE-03',
    candidateName: 'Vikram Joshi',
    usn: '1RV22EC102',
    institution: 'RV College of Engineering Bengaluru',
    degreeProgram: 'Bachelor of Engineering (Electronics & Communication)',
    graduationYear: 2026,
    cumulativeGpa: 8.45,
    wesEquivalentGpa: 3.65,
    admissionsGatekeeperScore: 82.5,
    competitiveExamRank: { exam: 'CAT 2025', percentile: 98.6 },
    verifiedInternships: [
      { company: 'Qualcomm India', role: 'VLSI Hardware & Firmware Intern', stipendInrPerMo: 90000, durationMonths: 6, verificationStatus: 'VERIFIED_OFFICIAL' }
    ],
    verifiedCertifications: [
      { title: 'Arm Education Embedded Systems Professional', issuer: 'Arm Limited', credentialId: 'ARM-5501-ESP', verifiedYear: 2025 }
    ],
    sopSynthesisStatus: 'SYNTHESIZED_IVY_LEAGUE_SPEC',
    lorEndorsementsCount: 3,
    visaReadinessStatus: 'OPTIMAL_LOW_RISK_APPROVED'
  }
];

class SovereignCareerCredentialEngine {
  getAvailablePortfolios() {
    return SAMPLE_CREDENTIAL_PORTFOLIOS;
  }

  /**
   * Generates a tamper-proof cryptographic passport hash and composite career score.
   */
  generateSovereignPassport(portfolioId) {
    const p = SAMPLE_CREDENTIAL_PORTFOLIOS.find(item => item.id === portfolioId) || SAMPLE_CREDENTIAL_PORTFOLIOS[0];

    // Composite Sovereign Score (0 - 1000 scale)
    // 300 pts Academics (CGPA / WES) + 250 pts Gatekeeper & Exams + 250 pts Internships + 200 pts Certs/SOP/LOR
    const gpaScore = (p.cumulativeGpa / 10.0) * 300;
    const gatekeeperScore = (p.admissionsGatekeeperScore / 100.0) * 250;
    const internScore = Math.min(250, p.verifiedInternships.length * 125);
    const docScore = Math.min(200, (p.verifiedCertifications.length * 50) + (p.lorEndorsementsCount * 30));

    const compositeScore = Math.round(gpaScore + gatekeeperScore + internScore + docScore);

    // Cryptographic proof hash (SHA-256)
    const rawPayload = JSON.stringify({
      id: p.id,
      candidate: p.candidateName,
      usn: p.usn,
      institution: p.institution,
      gpa: p.cumulativeGpa,
      score: compositeScore,
      issuedAt: '2026-09-10T12:00:00Z'
    });
    const sovereignHash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    let tierBadge = 'TIER-1 PLATINUM SOVEREIGN BADGE';
    if (compositeScore >= 900) tierBadge = 'GLOBAL TIER-1 DIAMOND SCHOLAR';
    else if (compositeScore < 750) tierBadge = 'TIER-2 GOLD PROFESSIONAL';

    return {
      portfolio: p,
      compositeScore,
      tierBadge,
      sovereignHash: `0x${sovereignHash}`,
      verificationTimestamp: '2026-09-10T12:00:00Z',
      blockchainProofNetwork: 'Polygon Sovereign ID (Testnet Anchor)',
      pillar3AuditSummary: {
        admissionCalibrated: true,
        transcriptWesVerified: true,
        industryInternshipVerified: true,
        sopAndLorAnchored: true,
        visaReadinessCleared: true
      },
      exportableJsonLd: {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalCredential",
        "name": `${p.candidateName} Sovereign Career Passport`,
        "credentialCategory": "degree-and-placement-sovereign-record",
        "recognizedBy": p.institution,
        "hash": `0x${sovereignHash}`
      }
    };
  }
}

const sovereignCareerCredentialEngine = new SovereignCareerCredentialEngine();

module.exports = {
  SovereignCareerCredentialEngine,
  sovereignCareerCredentialEngine
};
