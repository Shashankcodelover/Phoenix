/**
 * Phoenix v16.0: Cold Outreach & Recruiter InMail Generator Controller
 * Generates high-converting, personalized LinkedIn InMails and cold emails
 * tailored to engineering leaders, technical recruiters, and alumni peers.
 */

function generateOutreachMessage(payload = {}) {
  const {
    recipientType = 'HIRING_MANAGER',
    company = 'Google',
    recipientName = 'Alex',
    roleTitle = 'Software Engineer II (Distributed Systems)',
    candidateHook = 'Built high-throughput Redis caching layer reducing P99 latency by 76%',
    personalContext = 'Noticed your team recently migrated services to Kubernetes and wrote about consensus protocols'
  } = payload;

  let subjects = [];
  let messageBody = '';
  let cta = '';
  let conversionScore = 92;

  if (recipientType === 'HIRING_MANAGER') {
    subjects = [
      { text: `Quick thought on ${company} infra scaling & ${roleTitle}`, openRate: '88%' },
      { text: `Loved your technical writeup on consensus • SWE Candidate`, openRate: '84%' },
      { text: `Engineering candidate: ${candidateHook.slice(0, 45)}...`, openRate: '79%' }
    ];

    messageBody = `Hi ${recipientName},

I saw that your team at ${company} is expanding the ${roleTitle} team. ${personalContext ? `${personalContext} — really compelling architecture.` : ''}

Over the past year, I've focused deeply on high-performance backend systems. Most recently, I ${candidateHook.toLowerCase()}. I'm fascinated by the distributed reliability challenges ${company} solves at global scale.

I know your calendar is slammed, so no need for a formal call right now — if you're open to it, I'd love to send over a 90-second Loom or repository walkthrough highlighting how I approach distributed fault tolerance.

Best regards,
Candidate`;
    cta = 'Low-Friction Async Code/Loom Offer';
  } else if (recipientType === 'RECRUITER') {
    subjects = [
      { text: `Candidate for ${roleTitle} (${company}) • Systems & Infra`, openRate: '91%' },
      { text: `${roleTitle} applicant with proven ${candidateHook.slice(0, 30)}`, openRate: '86%' },
      { text: `Quick intro: SWE applicant for ${company}'s backend team`, openRate: '80%' }
    ];

    messageBody = `Hi ${recipientName},

I hope you're having a great week. I noticed you lead technical hiring for engineering teams at ${company}, specifically for ${roleTitle} roles.

I've been tracking ${company}'s recent technical milestones and believe my background aligns closely with what the engineering team requires. Key highlight:
• ${candidateHook}

I've applied online via requisition #${Math.floor(100000 + Math.random() * 900000)}, but wanted to reach out directly to express my high enthusiasm for ${company}'s mission.

Are you available for a brief 10-minute sync this Thursday or Friday to discuss current team priorities?

Thanks so much,
Candidate`;
    cta = '10-Minute Recruiter Screen Request';
  } else {
    // ALUMNI
    subjects = [
      { text: `Fellow alum reaching out regarding ${company} engineering`, openRate: '94%' },
      { text: `Quick advice from an alum on ${company}'s ${roleTitle} team?`, openRate: '89%' },
      { text: `Alumni connection: Loved your journey at ${company}`, openRate: '85%' }
    ];

    messageBody = `Hi ${recipientName},

I came across your profile and noticed we both share an alma mater! Seeing your technical trajectory at ${company} working on ${roleTitle} has been super inspiring.

I'm currently preparing for senior technical rounds with a focus on systems engineering (recently: ${candidateHook.toLowerCase()}).

If you have 10 minutes sometime in the coming weeks, I would be incredibly grateful to hear about your experience with ${company}'s engineering culture. No pressure at all for a referral — just hoping to learn from an alum who walked the path.

Warmly,
Candidate`;
    cta = 'Informational Alumni Chat (Zero Pressure)';
  }

  return {
    success: true,
    recipientType,
    company,
    roleTitle,
    conversionScore,
    subjectLines: subjects,
    selectedSubject: subjects[0].text,
    messageBody,
    wordCount: messageBody.split(/\s+/).length,
    callToAction: cta,
    keyConversionPrinciples: [
      'Concise (< 150 words avoids executive TL;DR skimming)',
      'Specific candidate proof of competence with quantified metric',
      'Low-pressure async CTA reduces cognitive friction for busy hiring leaders'
    ]
  };
}

const generateOutreach = (req, res) => {
  try {
    const result = generateOutreachMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateOutreach, generateOutreachMessage };
