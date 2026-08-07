/**
 * Phoenix v13 Horizon — Resource Search & Filtering Engine
 * ========================================================
 * Provides real-time searching, domain tag filtering, and quality ranking
 * across all curated free learning materials for PU, Diploma, and Engineering students.
 */

const { PU_CS_RESOURCES } = require('./cs-pu/puCurriculumEngine');
const { DIPLOMA_CS_RESOURCES } = require('./cs-diploma/diplomaCurriculumEngine');

const COMBINED_RESOURCES = [
  ...PU_CS_RESOURCES.map(r => ({ ...r, stream: 'PU_CS' })),
  ...DIPLOMA_CS_RESOURCES.map(r => ({ ...r, stream: 'DIPLOMA_CS' }))
];

function searchLearningResources({ query, stream, type, freeOnly = true }) {
  let list = [...COMBINED_RESOURCES];

  if (freeOnly) {
    list = list.filter(r => r.free === true);
  }

  if (stream) {
    list = list.filter(r => r.stream.toLowerCase() === stream.toLowerCase());
  }

  if (type) {
    list = list.filter(r => r.type.toLowerCase() === type.toLowerCase());
  }

  if (query && typeof query === 'string' && query.trim().length > 0) {
    const q = query.toLowerCase().trim();
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.phase.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  }

  return {
    success: true,
    query: query || '',
    streamFilter: stream || 'ALL',
    count: list.length,
    resources: list
  };
}

module.exports = { searchLearningResources, COMBINED_RESOURCES };
