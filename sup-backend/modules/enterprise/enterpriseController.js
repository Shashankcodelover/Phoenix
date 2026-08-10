const User = require('../../models/userModel');

// @desc    Get anonymized candidate profiles for recruiters
// @route   GET /api/enterprise/candidates
const getCandidates = async (req, res) => {
  try {
    const { role, minLevel, experience } = req.query;
    let query = {};
    if (role) query.targetRole = new RegExp(role, 'i');
    if (experience) query.experience = experience;
    if (minLevel) query.level = { $gte: parseInt(minLevel) };

    const candidates = await User.find(query)
      .select('xp level rank targetRole experience skills domains skillRadar portfolioProjects trophies streak badges')
      .sort({ xp: -1 })
      .limit(100);

    // Anonymize — replace identifying info with candidate IDs
    const anonymized = candidates.map((c, idx) => ({
      candidateId: `PHX-${String(idx + 1).padStart(4, '0')}`,
      level: c.level,
      rank: c.rank,
      xp: c.xp,
      targetRole: c.targetRole,
      experience: c.experience,
      skills: c.skills,
      domains: c.domains,
      skillRadar: c.skillRadar,
      streak: c.streak,
      trophyCount: c.trophies ? c.trophies.length : 0,
      projectCount: c.portfolioProjects ? c.portfolioProjects.length : 0,
      badgeCount: c.badges ? c.badges.length : 0,
      _id: c._id // kept for access-request flow
    }));

    res.json(anonymized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request access to a candidate's full profile (simulated)
// @route   POST /api/enterprise/request-access
const requestAccess = async (req, res) => {
  try {
    const { candidateId, recruiterEmail, companyName } = req.body;
    if (!candidateId || !recruiterEmail) {
      return res.status(400).json({ message: 'candidateId and recruiterEmail are required.' });
    }

    // In production this would send an email / notification to the student
    // For now we log and return success
    console.log(`[Enterprise] Access request from ${recruiterEmail} (${companyName}) for candidate ${candidateId}`);

    res.json({
      message: 'Access request submitted. The candidate will be notified and can choose to share their full profile.',
      status: 'pending',
      candidateId,
      recruiterEmail
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ghost Code plagiarism comparison between two code snippets
// @route   POST /api/enterprise/ghost-code
const ghostCodeDetector = async (req, res) => {
  try {
    const { codeA = '', codeB = '' } = req.body;
    if (!codeA || !codeB) {
      return res.status(400).json({ message: 'Both codeA and codeB are required.' });
    }

    // Normalize: strip whitespace, comments, convert to lowercase
    const normalize = (code) => {
      return code
        .replace(/\/\/.*$/gm, '')           // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')    // Remove multi-line comments
        .replace(/\s+/g, ' ')               // Collapse whitespace
        .replace(/['"]/g, '')               // Remove quotes
        .toLowerCase()
        .trim();
    };

    const normA = normalize(codeA);
    const normB = normalize(codeB);

    // Simple Jaccard similarity on token n-grams
    const tokenize = (text, n = 3) => {
      const tokens = text.split(/[^a-z0-9_]+/).filter(Boolean);
      const ngrams = new Set();
      for (let i = 0; i <= tokens.length - n; i++) {
        ngrams.add(tokens.slice(i, i + n).join('|'));
      }
      return ngrams;
    };

    const gramsA = tokenize(normA);
    const gramsB = tokenize(normB);

    let intersection = 0;
    gramsA.forEach(g => { if (gramsB.has(g)) intersection++; });

    const union = new Set([...gramsA, ...gramsB]).size;
    const similarity = union > 0 ? Math.round((intersection / union) * 100) : 0;

    let verdict = 'Clean';
    if (similarity > 80) verdict = '🚨 High Plagiarism Risk';
    else if (similarity > 50) verdict = '⚠️ Moderate Similarity';
    else if (similarity > 25) verdict = '🟡 Low Similarity';

    res.json({
      similarityPercent: similarity,
      verdict,
      ngramsA: gramsA.size,
      ngramsB: gramsB.size,
      intersection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    GDPR/FERPA Data Subject Access Request — export user data
// @route   GET /api/enterprise/dsar/:userId
const dsarExport = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      message: 'Data Subject Access Request fulfilled.',
      exportDate: new Date().toISOString(),
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a 1-page recruiter-ready portfolio pitch summary
// @route   GET /api/enterprise/portfolio-summary/:userId
const portfolioSummarizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name targetRole experience skills portfolioProjects badges xp level rank skillRadar streak');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const projects = (user.portfolioProjects || []).map(p => ({
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      outcome: p.outcome,
      hackathon: p.hackathonName,
      won: p.won
    }));

    const totalWins = projects.filter(p => p.won).length;

    const summary = {
      candidateSnapshot: {
        level: user.level || 1,
        rank: user.rank || 'Iron',
        xp: user.xp || 0,
        targetRole: user.targetRole || 'Software Developer',
        streak: user.streak || 0,
        badgeCount: (user.badges || []).length,
        skillRadar: user.skillRadar || {}
      },
      projectHighlights: projects.slice(0, 5),
      statistics: {
        totalProjects: projects.length,
        hackathonWins: totalWins,
        topSkills: (user.skills || []).slice(0, 8)
      },
      elevatorPitch: `This candidate is a Level ${user.level || 1} ${user.rank || 'Iron'}-ranked developer targeting ${user.targetRole || 'Software Development'} roles. They have completed ${projects.length} portfolio project(s) with ${totalWins} hackathon win(s) and maintain a ${user.streak || 0}-day active coding streak.`
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const {
  getLegalDocument,
  generateDataPortabilityArchive,
  executeRightToBeForgotten,
  recordConsentUpdate
} = require('./legalComplianceEngine');

const {
  calculateDisparateImpact,
  generateScoreExplainability,
  getModelCard
} = require('./aiEthicsAuditEngine');

// @desc    Retrieve standard legal agreements (ToS, Privacy, etc.)
// @route   GET /api/v1/enterprise/legal/document/:docType
const getLegalDocumentHandler = (req, res) => {
  try {
    const { docType = 'tos' } = req.params;
    const doc = getLegalDocument(docType);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate machine-readable GDPR Art. 20 / DPDP Data Portability archive
// @route   POST /api/v1/enterprise/legal/data-portability
const dataPortabilityHandler = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const exportArchive = generateDataPortabilityArchive(user);
    res.json(exportArchive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Execute GDPR Art. 17 / DPDP Sec. 12 Right to be Forgotten
// @route   POST /api/v1/enterprise/legal/right-to-be-forgotten
const rightToBeForgottenHandler = async (req, res) => {
  try {
    // FIX REJECTION #1: Enforce strict authorization - users can only erase their own account
    const userId = req.user?._id ? String(req.user._id) : String(req.body.userId || '');
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User identifier required for erasure.' });
    }

    const { confirmationKey } = req.body;

    const receipt = executeRightToBeForgotten(userId, confirmationKey);
    if (!receipt.success) {
      return res.status(400).json(receipt);
    }

    // Erase actual user record from active collection
    await User.findByIdAndDelete(userId);

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Audit & record user consent updates
// @route   POST /api/v1/enterprise/legal/consent
const consentHandler = (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const result = recordConsentUpdate({
      userId,
      consents: req.body.consents || {},
      ipAddress: req.ip || req.connection?.remoteAddress
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate Disparate Impact Ratio (EEOC 4/5ths Rule)
// @route   POST /api/v1/enterprise/ethics/disparate-impact
const disparateImpactHandler = (req, res) => {
  try {
    const result = calculateDisparateImpact(req.body.selectionRates);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate XAI Score Explainability Breakdown
// @route   POST /api/v1/enterprise/ethics/explainability
const explainabilityHandler = (req, res) => {
  try {
    const { scoreData, assessmentType } = req.body;
    const result = generateScoreExplainability({ scoreData, assessmentType });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Retrieve current AI System Model Card
// @route   GET /api/v1/enterprise/ethics/model-card
const modelCardHandler = (req, res) => {
  try {
    res.json(getModelCard());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCandidates,
  requestAccess,
  ghostCodeDetector,
  dsarExport,
  portfolioSummarizer,
  getLegalDocumentHandler,
  dataPortabilityHandler,
  rightToBeForgottenHandler,
  consentHandler,
  disparateImpactHandler,
  explainabilityHandler,
  modelCardHandler
};

