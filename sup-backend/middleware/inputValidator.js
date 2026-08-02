/**
 * Phoenix v2.0: Input Validation Middleware
 * 
 * Lightweight schema validation for API payloads.
 * Enforces types, string length limits, required fields, and enums.
 * Works with CommonJS — no external dependencies needed.
 * 
 * Usage:
 *   const { validate, schemas } = require('./inputValidator');
 *   router.post('/mock-interview', validate(schemas.mockInterview), controller);
 */

/**
 * Validates a value against a field schema.
 * Returns null if valid, or an error message string if invalid.
 */
function validateField(value, fieldSchema, fieldName) {
  // Check required
  if (fieldSchema.required && (value === undefined || value === null || value === '')) {
    return `"${fieldName}" is required.`;
  }

  // Skip further checks if value is not provided and not required
  if (value === undefined || value === null) return null;

  // Type check
  if (fieldSchema.type) {
    const expectedType = fieldSchema.type;
    if (expectedType === 'array') {
      if (!Array.isArray(value)) return `"${fieldName}" must be an array.`;
    } else if (typeof value !== expectedType) {
      return `"${fieldName}" must be a ${expectedType}, got ${typeof value}.`;
    }
  }

  // String length limits
  if (typeof value === 'string') {
    if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
      return `"${fieldName}" must be at least ${fieldSchema.minLength} characters.`;
    }
    if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      return `"${fieldName}" must be at most ${fieldSchema.maxLength} characters.`;
    }
  }

  // Number range
  if (typeof value === 'number') {
    if (fieldSchema.min !== undefined && value < fieldSchema.min) {
      return `"${fieldName}" must be at least ${fieldSchema.min}.`;
    }
    if (fieldSchema.max !== undefined && value > fieldSchema.max) {
      return `"${fieldName}" must be at most ${fieldSchema.max}.`;
    }
  }

  // Enum check
  if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
    return `"${fieldName}" must be one of: ${fieldSchema.enum.join(', ')}.`;
  }

  // Array items validation
  if (Array.isArray(value) && fieldSchema.items) {
    if (fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
      return `"${fieldName}" must have at most ${fieldSchema.maxItems} items.`;
    }
    for (let i = 0; i < value.length; i++) {
      const itemError = validateField(value[i], fieldSchema.items, `${fieldName}[${i}]`);
      if (itemError) return itemError;
    }
  }

  return null;
}

/**
 * Creates validation middleware from a schema definition.
 * 
 * @param {Object} schema - Object mapping field names to field schemas
 * @param {Object} options
 * @param {boolean} options.stripUnknown - Remove fields not in schema (default: true)
 */
const validate = (schema, options = {}) => {
  const { stripUnknown = true } = options;

  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request body must be a JSON object.'
      });
    }

    const errors = [];

    // Validate each field defined in the schema
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const error = validateField(req.body[fieldName], fieldSchema, fieldName);
      if (error) errors.push(error);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'One or more fields failed validation.',
        details: errors
      });
    }

    // Strip unknown fields (security: prevents unexpected data from reaching controllers)
    if (stripUnknown) {
      const allowedKeys = new Set(Object.keys(schema));
      const cleaned = {};
      for (const key of Object.keys(req.body)) {
        if (allowedKeys.has(key)) {
          cleaned[key] = req.body[key];
        }
      }
      req.body = cleaned;
    }

    next();
  };
};

// --- Pre-defined Schemas for Phoenix Endpoints ---
const schemas = {
  mockInterview: {
    message: { type: 'string', required: true, maxLength: 5000 },
    history: { type: 'array', required: false, maxItems: 50 },
    targetRole: { type: 'string', required: false, maxLength: 200 }
  },

  generateRoadmap: {
    userId: { type: 'string', required: true, maxLength: 100 },
    targetRole: { type: 'string', required: false, maxLength: 200 },
    timeFrame: { required: false },
    resumeText: { type: 'string', required: false, maxLength: 10000 }
  },

  tailorResume: {
    resumeText: { type: 'string', required: true, maxLength: 10000 },
    jobDescription: { type: 'string', required: true, maxLength: 5000 }
  },

  quizSubmit: {
    userId: { type: 'string', required: true, maxLength: 100 },
    answersCorrect: { type: 'number', required: false, min: 0, max: 100 },
    xpEarned: { required: false }
  },

  systemDesign: {
    topic: { type: 'string', required: false, maxLength: 200 }
  },

  awardXp: {
    userId: { type: 'string', required: true, maxLength: 100 },
    amount: { type: 'number', required: true, min: 1, max: 1000 },
    actionType: { type: 'string', required: false, maxLength: 100 },
    skillCategory: { type: 'string', required: false, maxLength: 50 }
  },

  revision: {
    topic: { type: 'string', required: true, maxLength: 500 },
    category: { type: 'string', required: true, maxLength: 100 }
  },

  planner: {
    interviewDate: { type: 'string', required: false, maxLength: 50 },
    hackathonDate: { type: 'string', required: false, maxLength: 50 },
    dailyHours: { required: false },
    ratio: { required: false }
  },

  mentorChat: {
    message: { type: 'string', required: true, maxLength: 3000 },
    mentorId: { type: 'string', required: true, enum: ['grinder', 'strategist', 'communicator', 'hustler'] },
    context: { type: 'string', required: false, maxLength: 5000 },
    history: { type: 'array', required: false, maxItems: 30 }
  },

  interviewSim: {
    userId: { type: 'string', required: true, maxLength: 100 },
    company: { type: 'string', required: false, maxLength: 200 },
    difficulty: { type: 'string', required: false, enum: ['easy', 'medium', 'hard', 'bar-raiser'] },
    stage: { type: 'string', required: false, maxLength: 100 },
    response: { type: 'string', required: false, maxLength: 10000 }
  },

  generateIdeas: {
    hackathonName: { type: 'string', required: false, maxLength: 200 },
    hackathonDescription: { type: 'string', required: false, maxLength: 3000 },
    rules: { type: 'string', required: false, maxLength: 3000 },
    constraints: { type: 'string', required: false, maxLength: 2000 },
    teamSkills: { type: 'array', required: false, maxItems: 30 },
    teamSize: { type: 'number', required: false, min: 1, max: 10 }
  },

  projectRoadmap: {
    projectTitle: { type: 'string', required: false, maxLength: 300 },
    projectDescription: { type: 'string', required: false, maxLength: 5000 },
    techStack: { type: 'array', required: false, maxItems: 30 },
    durationHours: { type: 'number', required: false, min: 1, max: 168 }
  },

  codeReview: {
    code: { type: 'string', required: true, maxLength: 20000 },
    language: { type: 'string', required: false, maxLength: 50 }
  },

  noveltyCheck: {
    ideaTitle: { type: 'string', required: true, maxLength: 300 },
    ideaDescription: { type: 'string', required: true, maxLength: 5000 },
    techStack: { type: 'array', required: false, maxItems: 30 }
  },

  signup: {
    name: { type: 'string', required: true, maxLength: 100 },
    email: { type: 'string', required: true, maxLength: 200 },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100 }
  },

  login: {
    email: { type: 'string', required: true, maxLength: 200 },
    password: { type: 'string', required: true, maxLength: 100 }
  },

  disruptResume: {
    resumeText: { type: 'string', required: true, maxLength: 10000 },
    targetRole: { type: 'string', required: false, maxLength: 200 }
  },

  judgeExplainer: {
    projectTitle: { type: 'string', required: true, maxLength: 300 },
    techStack: { type: 'array', required: false, maxItems: 30 },
    projectDescription: { type: 'string', required: false, maxLength: 5000 },
    targetTrack: { type: 'string', required: false, maxLength: 200 }
  },

  mineStory: {
    projectTitle: { type: 'string', required: true, maxLength: 300 },
    hackathonName: { type: 'string', required: false, maxLength: 200 },
    techStack: { type: 'array', required: false, maxItems: 30 }
  }
};

module.exports = { validate, schemas, validateField };
