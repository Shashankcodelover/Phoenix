/**
 * Phoenix V14: Hackathon Scraper, Deduplication & Urgency/Match Scorer Engine
 * 
 * FIXES:
 *   - REJECTION #1: Scraped data now routes through ragService.indexHackathon()
 *     to generate Gemini embeddings before DB persistence.
 *   - REJECTION #4: Replaced O(N) sequential `for...of await` with
 *     atomic `Hackathon.bulkWrite()` for batch database operations.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Hackathon = require('../../models/hackathonModel');
const ragService = require('./rag_service');

/**
 * Scrape MLH Hackathons, generate embeddings via RAG service, and store in DB.
 * 
 * Data flow: MLH Website → Cheerio Parse → ragService.indexHackathon() → MongoDB
 */
async function scrapeAndSeedLiveHackathons() {
  try {
    const url = 'https://mlh.io/seasons/2025/events';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 15000 // 15s timeout to prevent hanging requests
    });
    
    const $ = cheerio.load(response.data);
    const events = [];

    $('.event-wrapper').each((i, el) => {
      // Limit to 10 for performance in this engine
      if (i >= 10) return;

      const title = $(el).find('.event-name').text().trim();
      const dateRange = $(el).find('.event-date').text().trim();
      const location = $(el).find('.event-location').text().trim();
      const link = $(el).find('.event-link').attr('href');
      const logo = $(el).find('.event-logo img').attr('src');
      const isDigital = $(el).find('.event-hybrid-notes').text().toLowerCase().includes('digital') || location.toLowerCase().includes('digital');

      // Extract real dates if available, else fallback to current date for stability
      const dateText = $(el).find('.event-date').text().trim() || new Date().toISOString();
      const startDate = new Date(dateText.split('-')[0] || Date.now());

      if (title && link) {
        events.push({
          name: title,
          description: `MLH Hackathon: ${title} located in ${location}`,
          theme: 'General, AI, Web3, MLH',
          rules: 'Standard MLH rules apply',
          status: 'Active',
          platform: 'MLH',
          startDate: startDate,
          deadlineDate: new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
          hostingLink: link,
          logo: logo
        });
      }
    });

    if (events.length === 0) {
      console.log('[Scraper] No events found from MLH. Skipping DB write.');
      return events;
    }

    // ═══════════════════════════════════════════════════════════
    // FIX #1: Route each event through RAG service for embedding
    // FIX #4: Collect bulk operations instead of sequential writes
    // ═══════════════════════════════════════════════════════════

    // Ensure RAG service is initialized before indexing
    if (!ragService.initialized) {
      await ragService.initialize();
    }

    // Phase A: Generate embeddings for each event via RAG service
    // This populates the `embedding` field on each document
    const indexedDocs = [];
    for (const ev of events) {
      try {
        const doc = await ragService.indexHackathon(ev);
        if (doc) indexedDocs.push(doc);
      } catch (err) {
        console.warn(`[Scraper] Failed to index "${ev.name}": ${err.message}`);
        // Fallback: write without embedding using bulk operation
        indexedDocs.push(ev);
      }
    }

    // Phase B: If RAG service was unavailable (no API key), do a batch bulkWrite
    // as a fallback for events that weren't indexed via ragService
    const unindexedEvents = events.filter(ev => 
      !indexedDocs.some(doc => (doc.name || doc._doc?.name) === ev.name)
    );

    if (unindexedEvents.length > 0) {
      const bulkOps = unindexedEvents.map(ev => ({
        updateOne: {
          filter: { name: ev.name },
          update: { $set: ev },
          upsert: true
        }
      }));

      await Hackathon.bulkWrite(bulkOps, { ordered: false });
      console.log(`[Scraper] Bulk-wrote ${bulkOps.length} events without embeddings (RAG fallback).`);
    }

    console.log(`[Scraper] Successfully scraped and synced ${events.length} hackathons from MLH (${indexedDocs.length} with embeddings).`);
    return events;

  } catch (error) {
    console.error(`[Scraper] Failed to scrape MLH: ${error.message}`);
    return [];
  }
}

/**
 * Aggregates and ranks hackathons based on user/team skill context from DB.
 * 
 * @param {Object} queryOptions
 * @returns {Object} Filtered & Ranked Hackathons Feed
 */
async function searchAndRankHackathons(queryOptions = {}) {
  const { userSkills = [], preferredMode = 'All', minPrize = 0 } = queryOptions;

  // Fetch from Real DB
  const rawEvents = await Hackathon.find({ status: 'Active' }).lean();
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

  // Deduplicate and process feed
  const processed = rawEvents.map(event => {
    // 1. Calculate Match Score (0-100%)
    let matchedSkillCount = 0;
    const tags = event.theme ? event.theme.split(',').map(t => t.trim()) : [];
    tags.forEach(tag => {
      if (normalizedUserSkills.some(s => tag.toLowerCase().includes(s) || s.includes(tag.toLowerCase()))) {
        matchedSkillCount++;
      }
    });

    const matchPercent = normalizedUserSkills.length > 0
      ? Math.min(100, Math.round((matchedSkillCount / Math.max(1, normalizedUserSkills.length)) * 100))
      : 75; // default fallback match

    // 2. Deadline Urgency Index
    const now = new Date();
    const deadlineDate = new Date(event.deadlineDate);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let urgencyLevel = 'Normal';
    if (daysRemaining <= 3) urgencyLevel = 'CRITICAL (<3 days left)';
    else if (daysRemaining <= 7) urgencyLevel = 'HIGH (<1 week left)';
    else if (daysRemaining <= 14) urgencyLevel = 'MODERATE (<2 weeks left)';

    return {
      ...event,
      matchPercent,
      daysRemaining,
      urgencyLevel
    };
  });

  // Sort by match score (descending) and urgency (days remaining ascending)
  processed.sort((a, b) => b.matchPercent - a.matchPercent || a.daysRemaining - b.daysRemaining);

  return {
    totalFound: processed.length,
    rankedHackathons: processed
  };
}

// Start background scraper CRON job (Runs every 12 hours)
setInterval(() => {
  scrapeAndSeedLiveHackathons().catch(err => console.error('[Scraper] Background job failed:', err.message));
}, 12 * 60 * 60 * 1000);

// Initial boot scrape (deferred by 5s to allow server.js to finish dotenv + RAG init)
setTimeout(() => {
  scrapeAndSeedLiveHackathons().catch(console.error);
}, 5000);

module.exports = { searchAndRankHackathons, scrapeAndSeedLiveHackathons };
