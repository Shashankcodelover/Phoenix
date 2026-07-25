/**
 * Phoenix: STAR Story Miner & Interview Suitability Scorer (V20).
 * Extracts structured behavioral answers (Situation, Task, Action, Result) from raw project descriptions.
 */

const SENTENCE_SEPARATORS = /[.!?]+/;

/**
 * Parses raw hackathon description text and maps paragraphs to STAR columns.
 */
function mineSTARStory(rawText) {
    const cleanText = rawText || "";
    const sentences = cleanText.split(SENTENCE_SEPARATORS).map(s => s.trim()).filter(s => s.length > 0);
    
    const star = {
        situation: [],
        task: [],
        action: [],
        result: []
    };

    // Keyword indicators for mapping
    const patterns = {
        situation: ['built', 'created', 'started', 'context', 'during', 'hackathon', 'problem'],
        task: ['needed to', 'required', 'goal', 'challenge', 'objective', 'task', 'had to'],
        action: ['implemented', 'wrote', 'designed', 'optimized', 'integrated', 'used', 'coded', 'built'],
        result: ['result', 'outcome', 'led to', 'reduced', 'saved', 'achieved', 'won', 'improved', 'speedup']
    };

    sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        let mapped = false;
        
        // Match against indicators
        if (patterns.result.some(kw => lowerSentence.includes(kw))) {
            star.result.push(sentence);
            mapped = true;
        } else if (patterns.action.some(kw => lowerSentence.includes(kw))) {
            star.action.push(sentence);
            mapped = true;
        } else if (patterns.task.some(kw => lowerSentence.includes(kw))) {
            star.task.push(sentence);
            mapped = true;
        } else if (patterns.situation.some(kw => lowerSentence.includes(kw))) {
            star.situation.push(sentence);
            mapped = true;
        }

        // Fallback: distribute evenly if not matched
        if (!mapped) {
            if (star.situation.length <= star.task.length) {
                star.situation.push(sentence);
            } else {
                star.action.push(sentence);
            }
        }
    });

    return {
        situation: star.situation.join(". ") + (star.situation.length ? "." : ""),
        task: star.task.join(". ") + (star.task.length ? "." : ""),
        action: star.action.join(". ") + (star.action.length ? "." : ""),
        result: star.result.join(". ") + (star.result.length ? "." : "")
    };
}

/**
 * Rates the strength of the mined STAR story (0 to 100).
 */
function rateStoryStrength(starStory) {
    let score = 20; // baseline

    if (starStory.situation.length > 20) score += 20;
    if (starStory.task.length > 20) score += 20;
    if (starStory.action.length > 30) score += 20;
    if (starStory.result.length > 20) score += 20;

    // Check for metrics (numbers) in the result (e.g. 20% speedup, ₹500 saved)
    const hasNumbers = /\d+/.test(starStory.result);
    if (hasNumbers) {
        score += 10; // extra points for quantified outcomes
    }

    return Math.min(100, score);
}

module.exports = {
    mineSTARStory,
    rateStoryStrength
};
