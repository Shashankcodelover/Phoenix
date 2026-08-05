/**
 * Phoenix V21: Hackathon Retrieval-Augmented Generation (RAG) Service
 * Implements a local catalog search with TF-IDF keyword matching rules.
 */

const { retrieveWinningProjects, WINNING_PROJECTS } = require('./hackathonWinnersData');

class HackathonRAGService {
  constructor() {
    // Expanded catalog of 12 active hackathons across India & globally
    this.catalog = [
      {
        id: "sih-2026",
        name: "Smart India Hackathon 2026",
        description: "National initiative to provide students with a platform to solve pressing problems in daily life. Promotes product innovation and problem solving.",
        theme: "Smart Automation, AgriTech, Clean Water, Healthcare, FinTech, Cyber Security",
        rules: "Team of 6, at least 1 female member, open to AI, IoT, web/mobile solutions.",
        status: "Active",
        platform: "SIH Portal",
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: "google-solution-challenge-2026",
        name: "Google Solution Challenge 2026",
        description: "Build a solution for one or more of the United Nations 17 Sustainable Development Goals using Google technologies.",
        theme: "Sustainability, Climate Action, Gender Equality, Affordable Energy, Education",
        rules: "Max 4 members, must use at least one Google developer product (Firebase, Flutter, Google Cloud, Gemini API).",
        status: "Active",
        platform: "GDSC",
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: "microsoft-imagine-cup-2026",
        name: "Microsoft Imagine Cup 2026",
        description: "Global student technology competition designed to empower students to build tech startups that solve local and global challenges.",
        theme: "AI Innovation, Social Impact, SaaS startups, Azure Cloud integration",
        rules: "Up to 4 members, must host application on Microsoft Azure.",
        status: "Active",
        platform: "Imagine Cup",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      },
      {
        id: "devfolio-ethIndia-2026",
        name: "ETHIndia 2026 (Devfolio)",
        description: "Asia's largest Ethereum hackathon. Build decentralized applications, DeFi protocols, or Web3 tools in 36 hours.",
        theme: "Web3, DeFi, NFTs, DAOs, Layer 2 Scaling, ZK Proofs",
        rules: "Max 5 members, must deploy on Ethereum or compatible L2. Open source required.",
        status: "Active",
        platform: "Devfolio",
        startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
      },
      {
        id: "hackerearth-innovate-2026",
        name: "HackerEarth Innovate India 2026",
        description: "Pan-India online hackathon focused on building innovative solutions using AI/ML, IoT, and cloud computing for Indian enterprises.",
        theme: "Enterprise AI, Smart Cities, EdTech, HealthTech, FinTech",
        rules: "Max 4 members, submit on HackerEarth platform with working demo.",
        status: "Active",
        platform: "HackerEarth",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: "unstop-techgig-2026",
        name: "Unstop TechGig Code Gladiators 2026",
        description: "India's biggest coding competition with hackathon tracks in AI, blockchain, and full-stack development.",
        theme: "AI/ML, Blockchain, Full-Stack, DevOps, Cybersecurity",
        rules: "Individual or team of 3, multiple rounds (online coding + hackathon).",
        status: "Active",
        platform: "Unstop",
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      },
      {
        id: "angelhack-global-2026",
        name: "AngelHack Global Hackathon Series 2026",
        description: "International hackathon series running in 150+ cities worldwide. Focus on community-driven innovation and startup building.",
        theme: "Social Impact, Climate Tech, FinTech, HealthTech, Open Innovation",
        rules: "Max 5 members, must present live demo. Prizes include accelerator spots.",
        status: "Active",
        platform: "AngelHack",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000)
      },
      {
        id: "nasa-spaceapps-2026",
        name: "NASA Space Apps Challenge 2026",
        description: "World's largest annual global hackathon using NASA's open data to solve real-world space and Earth science challenges.",
        theme: "Earth Observation, Space Exploration, Climate Data, Geospatial Analysis",
        rules: "Max 6 members, must use at least one NASA open dataset. Remote participation available.",
        status: "Active",
        platform: "SpaceApps",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
      },
      {
        id: "mlh-ghw-2026",
        name: "MLH Global Hack Week 2026",
        description: "Week-long virtual hackathon by Major League Hacking with daily challenges, workshops, and mini-projects.",
        theme: "Open Innovation, Data Science, Web Dev, Game Dev, Hardware Hacks",
        rules: "Individual or team, daily submissions for points, global leaderboard.",
        status: "Active",
        platform: "MLH",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      },
      {
        id: "flipkart-grid-2026",
        name: "Flipkart GRiD 6.0 — Software Development Challenge",
        description: "Flagship engineering hackathon by Flipkart for pre-final and final year students. Winning teams get PPIs at Flipkart.",
        theme: "E-commerce, Logistics Optimization, Recommendation Systems, GenAI",
        rules: "Team of 3, college verification required. Multiple elimination rounds.",
        status: "Active",
        platform: "Unstop",
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: "hackmit-2026",
        name: "HackMIT 2026",
        description: "MIT's premier annual hackathon. 1000+ hackers build innovative projects in 24 hours at the MIT campus.",
        theme: "Open Innovation, Social Good, Developer Tools, Creative Tech",
        rules: "Max 4 members, must be a current student. Travel reimbursement available.",
        status: "Active",
        platform: "HackMIT",
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000)
      },
      {
        id: "razorpay-ftx-2026",
        name: "Razorpay FTX 2026 — FinTech Hackathon",
        description: "Build the future of payments and financial infrastructure using Razorpay APIs. Top teams get internship offers.",
        theme: "Payments, UPI, Lending, Insurance Tech, Neobanking",
        rules: "Max 4 members, must integrate at least one Razorpay API. Working demo required.",
        status: "Active",
        platform: "Razorpay",
        startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  /**
   * Registers a fresh scraped hackathon into the RAG index database catalog
   */
  indexHackathon(hackathon) {
    if (!hackathon || !hackathon.name) return;
    const item = {
      id: hackathon.id || `hack-${Date.now()}`,
      name: hackathon.name,
      description: hackathon.description || '',
      theme: hackathon.theme || hackathon.tags?.join(', ') || 'General',
      rules: hackathon.rules || 'Standard rules',
      status: hackathon.status || 'Active',
      platform: hackathon.platform || 'Custom',
      startDate: hackathon.startDate ? new Date(hackathon.startDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      deadlineDate: hackathon.deadlineDate ? new Date(hackathon.deadlineDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    this.catalog.push(item);
    console.log(`[RAG Service] Successfully indexed: ${item.name}`);
  }

  /**
   * Retrieves top N hackathons sorted by relevance matching keywords in query terms
   */
  retrieveHackathons(query = '', limit = 3) {
    const qStr = typeof query === 'string' ? query : '';
    if (!qStr) {
      return this.getCatalogWithDeadlines().slice(0, limit);
    }

    const queryTerms = qStr.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = this.catalog.map(hack => {
      let score = 0;
      const combinedText = `${hack.name} ${hack.description} ${hack.theme} ${hack.rules}`.toLowerCase();
      
      queryTerms.forEach(term => {
        if (combinedText.includes(term)) {
          score += 1;
          if (hack.name.toLowerCase().includes(term)) score += 2;
          if (hack.theme.toLowerCase().includes(term)) score += 1.5;
        }
      });

      return { hackathon: this._addDeadlineCountdown(hack), score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.hackathon)
      .slice(0, limit);
  }

  /**
   * Retrieves past hackathon winner project blueprints using keyword RAG matching
   */
  retrieveWinnerSolutions(query = '', limit = 2) {
    return retrieveWinningProjects(query, limit);
  }

  /**
   * Return the entire active catalog with dynamic deadline metrics
   */
  getCatalog() {
    return this.catalog;
  }

  /**
   * Return catalog with computed daysUntilDeadline
   */
  getCatalogWithDeadlines() {
    return this.catalog.map(h => this._addDeadlineCountdown(h));
  }

  /**
   * Add computed deadline countdown fields to a hackathon object
   */
  _addDeadlineCountdown(hack) {
    const now = Date.now();
    const daysUntilStart = Math.max(0, Math.ceil((new Date(hack.startDate).getTime() - now) / (1000 * 60 * 60 * 24)));
    const daysUntilDeadline = Math.max(0, Math.ceil((new Date(hack.deadlineDate).getTime() - now) / (1000 * 60 * 60 * 24)));
    const urgency = daysUntilDeadline <= 2 ? 'CRITICAL' : daysUntilDeadline <= 7 ? 'HIGH' : 'NORMAL';

    return {
      ...hack,
      daysUntilStart,
      daysUntilDeadline,
      urgency
    };
  }
}

// Global single instance to simulate shared state
const ragInstance = new HackathonRAGService();

module.exports = ragInstance;

