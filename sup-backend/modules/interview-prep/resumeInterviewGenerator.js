/**
 * Phoenix V14: Resume-Driven Interview Question Generator
 * 
 * Analyzes a candidate's resume text + job description to generate
 * context-aware, role-specific interview questions. This is a key
 * competitive differentiator — competitors like ResumiQ and Kickresume
 * charge for this as a premium feature.
 * 
 * Capabilities:
 *   - Technical gap analysis questions
 *   - Behavioral STAR-method probes targeting specific resume claims
 *   - Role-specific system design challenges
 *   - "Deep-dive" questions that probe metrics/claims authenticity
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate tailored interview questions from resume + job description context.
 * 
 * @param {Object} params
 * @param {string} params.resumeText - Candidate's resume content
 * @param {string} params.jobDescription - Target job description/posting
 * @param {string} params.targetRole - Role title (e.g., "Senior Backend Engineer")
 * @param {string} params.targetCompany - Optional company name for culture alignment
 * @param {number} params.questionCount - Number of questions to generate (default: 10)
 * @returns {Object} Structured question bank with categories and difficulty levels
 */
async function generateResumeInterviewQuestions({
  resumeText = '',
  jobDescription = '',
  targetRole = 'Software Engineer',
  targetCompany = '',
  questionCount = 10
}) {
  // Validate inputs
  if (!resumeText || resumeText.trim().length < 50) {
    return {
      success: false,
      error: 'Resume text must be at least 50 characters for meaningful analysis.',
      questions: []
    };
  }

  const companyContext = targetCompany
    ? `The target company is "${targetCompany}". Factor in their known interview style, culture, and engineering values.`
    : '';

  const jdContext = jobDescription
    ? `\n\nJOB DESCRIPTION:\n${jobDescription}`
    : '';

  const prompt = `You are a senior technical interviewer conducting a deep analysis of a candidate's resume against a target role.

TARGET ROLE: ${targetRole}
${companyContext}

CANDIDATE RESUME:
${resumeText}
${jdContext}

Generate exactly ${questionCount} high-quality interview questions tailored to THIS specific candidate. Categorize each question.

Return a raw JSON object with this structure:
{
  "candidateProfile": {
    "identifiedStrengths": ["strength1", "strength2", "strength3"],
    "identifiedGaps": ["gap1", "gap2"],
    "roleAlignment": "HIGH|MEDIUM|LOW",
    "alignmentReason": "brief explanation"
  },
  "questions": [
    {
      "id": 1,
      "category": "TECHNICAL|BEHAVIORAL|SYSTEM_DESIGN|DEEP_DIVE|CULTURE_FIT",
      "difficulty": "EASY|MEDIUM|HARD|EXPERT",
      "question": "the actual question text",
      "intent": "what the interviewer is trying to assess",
      "idealAnswer": "key points the candidate should hit",
      "followUp": "a natural follow-up question",
      "resumeReference": "which part of the resume triggered this question"
    }
  ]
}

IMPORTANT RULES:
- At least 2 BEHAVIORAL questions targeting specific claims/metrics in the resume
- At least 2 TECHNICAL questions probing claimed skills
- At least 1 SYSTEM_DESIGN question relevant to the target role
- At least 1 DEEP_DIVE question that challenges a specific metric or achievement
- Every question MUST reference a specific part of the resume
- Do NOT generate generic questions — every question must be uniquely tied to this candidate
- Return strict valid JSON only. No markdown wrapping.`;

  const systemInstruction = 'You are an elite technical interviewer. Generate uniquely tailored questions based on resume analysis. Return strict raw JSON only.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'resume-interview-gen');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
      return {
        success: false,
        error: 'AI returned malformed response. Please retry.',
        questions: []
      };
    }

    // Enrich each question with metadata
    const enrichedQuestions = parsed.questions.map((q, idx) => ({
      ...q,
      id: idx + 1,
      generatedFor: targetRole,
      generatedAt: new Date().toISOString()
    }));

    return {
      success: true,
      targetRole,
      targetCompany: targetCompany || 'General',
      candidateProfile: parsed.candidateProfile || null,
      totalQuestions: enrichedQuestions.length,
      questions: enrichedQuestions,
      metadata: {
        engine: 'Phoenix Resume Interview Generator v14',
        generatedAt: new Date().toISOString()
      }
    };

  } catch (err) {
    console.error('[Resume Interview Generator] AI call failed:', err.message);
    return {
      success: false,
      error: `AI generation failed: ${err.message}`,
      questions: []
    };
  }
}

/**
 * Analyze resume-JD alignment score without generating full questions.
 * Lightweight endpoint for quick compatibility checks.
 */
async function analyzeResumeAlignment({ resumeText = '', jobDescription = '' }) {
  if (!resumeText || !jobDescription) {
    return { score: 0, reason: 'Both resume and job description are required.' };
  }

  const prompt = `Analyze the alignment between this resume and job description.
  
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return a JSON object:
{
  "alignmentScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "verdict": "STRONG_MATCH|MODERATE_MATCH|WEAK_MATCH|NO_MATCH"
}

Return strict valid JSON only.`;

  try {
    const raw = await callAIForFeature(prompt, 'Analyze resume-JD alignment. Return JSON.', 'resume-alignment');
    return parseAIJson(raw) || { score: 0, reason: 'Parse failed' };
  } catch (err) {
    return { score: 0, reason: err.message };
  }
}

module.exports = { generateResumeInterviewQuestions, analyzeResumeAlignment };
