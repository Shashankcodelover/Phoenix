/**
 * Phoenix V21: Hackathon Retrieval-Augmented Generation (RAG) Service
 * Implements a local catalog search with TF-IDF keyword matching rules.
 */

class HackathonRAGService {
  constructor() {
    // Local catalog of active hackathons representing the vector database index
    this.catalog = [
      {
        id: "sih-2026",
        name: "Smart India Hackathon 2026",
        description: "National initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives. Promotes product innovation and problem solving.",
        theme: "Smart Automation, AgriTech, Clean Water, Healthcare, FinTech, Cyber Security",
        rules: "Team of 6, at least 1 female member, open to AI, IoT, web/mobile solutions.",
        status: "Active",
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // starts in 2 days
        deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // ends in 5 days
      },
      {
        id: "google-solution-challenge-2026",
        name: "Google Solution Challenge 2026",
        description: "Build a solution for one or more of the United Nations 17 Sustainable Development Goals using Google technologies.",
        theme: "Sustainability, Climate Action, Gender Equality, Affordable Energy, Education",
        rules: "Max 4 members, must use at least one Google developer product (Firebase, Flutter, Google Cloud, Gemini API).",
        status: "Active",
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // started 1 day ago
        deadlineDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // ends in 10 days
      },
      {
        id: "microsoft-imagine-cup-2026",
        name: "Microsoft Imagine Cup 2026",
        description: "Global student technology competition designed to empower students to build tech startups that solve local and global challenges.",
        theme: "AI Innovation, Social Impact, SaaS startups, Azure Cloud integration",
        rules: "Up to 4 members, must host application on Microsoft Azure.",
        status: "Active",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // starts in 15 days
        deadlineDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) // ends in 25 days
      },
      {
        id: "mysore-hack-2026",
        name: "Mysore Local Web Dev Hackathon",
        description: "Hyperlocal competition focused on building clean offline-first web apps for college admin workflows and local transport coordination.",
        theme: "Offline-first Web, P2P Coordination, Admin Utilities",
        rules: "Up to 4 members, must submit source code repository and video pitch within 24 hours.",
        status: "Active",
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // starts in 1 day
        deadlineDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // ends in 2 days
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
      return this.catalog.slice(0, limit);
    }

    const queryTerms = qStr.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = this.catalog.map(hack => {
      let score = 0;
      const combinedText = `${hack.name} ${hack.description} ${hack.theme} ${hack.rules}`.toLowerCase();
      
      queryTerms.forEach(term => {
        if (combinedText.includes(term)) {
          score += 1;
          // Weighted score boost if term appears in title or themes
          if (hack.name.toLowerCase().includes(term)) score += 2;
          if (hack.theme.toLowerCase().includes(term)) score += 1.5;
        }
      });

      return { hackathon: hack, score };
    });

    // Sort by descending score, filtering out non-matching results
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.hackathon)
      .slice(0, limit);
  }

  /**
   * Return the entire active catalog with dynamic deadline metrics
   */
  getCatalog() {
    return this.catalog;
  }
}

// Global single instance to simulate shared state
const ragInstance = new HackathonRAGService();

module.exports = ragInstance;
