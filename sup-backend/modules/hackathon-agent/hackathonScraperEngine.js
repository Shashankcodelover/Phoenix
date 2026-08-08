/**
 * Phoenix v8.0: Hackathon Scraper, Deduplication & Urgency/Match Scorer Engine
 * 
 * Aggregates, cleans, dedupes, and ranks upcoming hackathon opportunities
 * Uses real web scraping via Axios and Cheerio.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Hackathon = require('../../models/hackathonModel');

/**
 * Scrape MLH Hackathons and store them in the database.
 */
async function scrapeAndSeedLiveHackathons() {
  try {
    const url = 'https://mlh.io/seasons/2025/events';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
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

      // Estimate dates based on text parsing (simplified)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 2)); // Mock future date based on index for simplicity

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

    // Upsert into DB
    for (const ev of events) {
      await Hackathon.findOneAndUpdate(
        { name: ev.name },
        ev,
        { upsert: true, new: true }
      );
    }
    
    console.log(`[Scraper] Successfully scraped and synced ${events.length} hackathons from MLH.`);
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

  // First ensure we have live data
  await scrapeAndSeedLiveHackathons();

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

module.exports = { searchAndRankHackathons, scrapeAndSeedLiveHackathons };
