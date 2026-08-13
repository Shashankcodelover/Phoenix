const { describe, it } = require('node:test');
const assert = require('node:assert');

const { KarnatakaRankMatrixEngine } = require('../modules/horizon/karnatakaRankMatrixEngine');

describe('V24 Quality Focus: Feature 8 — Karnataka KCET & DCET Rank Matrix & College Seat Forecaster', () => {
  const engine = new KarnatakaRankMatrixEngine();

  it('forecasts elite state rank bracket for high-scoring KCET candidate and matches RVCE CSE', () => {
    const forecast = engine.forecastRankAndColleges({
      stream: 'KCET',
      entranceMarks: 165,
      boardPercentage: 98,
      category: 'GM'
    });

    assert.strictEqual(forecast.success, true);
    assert.strictEqual(forecast.stream, 'KCET');
    assert.ok(forecast.baseRankEstimated <= 1200);
    assert.ok(forecast.counselingAdvice.includes('RVCE'));
    assert.ok(forecast.topMatchedColleges.some(c => c.college.includes('RVCE') && c.matchProbability.includes('High Probability')));
  });

  it('forecasts DCET lateral entry admission across OBC reservation thresholds', () => {
    const dcetForecast = engine.forecastRankAndColleges({
      stream: 'DCET',
      entranceMarks: 82,
      boardPercentage: 90,
      category: 'OBC'
    });

    assert.strictEqual(dcetForecast.success, true);
    assert.strictEqual(dcetForecast.category, 'OBC');
    assert.ok(dcetForecast.estimatedRankBracket.includes('-'));
    assert.ok(dcetForecast.topMatchedColleges.length >= 5);
  });
});
