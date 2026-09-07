/**
 * Phoenix Apex Ultra: Feature 16 — Live Collaborative Pair-Programming Engine (HackerRank CodePair / CoderPad Standard)
 * 
 * Manages synchronized real-time code editing sessions between candidates and interviewers,
 * dual-cursor tracking, AST linting, Big-O profiling, test-case sandboxed execution,
 * and FAANG 4-dimension interviewer assessment rubric.
 */

const vm = require('vm');

const FAANG_PAIR_QUESTIONS = [
  {
    id: 'q1_lru_cache',
    title: 'LRU Cache (Least Recently Used)',
    difficulty: 'Medium / Hard',
    company: 'Google / Amazon / Meta',
    timeLimit: '45 mins',
    tags: ['Hash Map', 'Doubly Linked List', 'Design'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) in O(1) average time complexity.',
    starterCode: `/**
 * Initialize LRU Cache with capacity
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// Verification runner
function solution() {
  const lru = new LRUCache(2);
  lru.put(1, 1);
  lru.put(2, 2);
  const v1 = lru.get(1); // returns 1
  lru.put(3, 3);          // evicts key 2
  const v2 = lru.get(2); // returns -1 (not found)
  lru.put(4, 4);          // evicts key 1
  const v3 = lru.get(1); // returns -1 (not found)
  const v4 = lru.get(3); // returns 3
  const v5 = lru.get(4); // returns 4
  return { v1, v2, v3, v4, v5, passed: v1 === 1 && v2 === -1 && v3 === -1 && v4 === 3 && v5 === 4 };
}`,
    testCases: [
      { input: 'put(1,1), put(2,2), get(1)', expected: '1' },
      { input: 'put(3,3), get(2)', expected: '-1 (evicted)' },
      { input: 'put(4,4), get(1)', expected: '-1 (evicted)' }
    ]
  },
  {
    id: 'q2_sliding_window',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    company: 'Microsoft / Apple / Netflix',
    timeLimit: '35 mins',
    tags: ['Sliding Window', 'Hash Set', 'String'],
    description: 'Given a string s, find the length of the longest substring without repeating characters. Aim for O(N) linear time.',
    starterCode: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const charSet = new Set();

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

function solution() {
  const test1 = lengthOfLongestSubstring("abcabcbb"); // 3 ("abc")
  const test2 = lengthOfLongestSubstring("bbbbb");    // 1 ("b")
  const test3 = lengthOfLongestSubstring("pwwkew");   // 3 ("wke")
  return { test1, test2, test3, passed: test1 === 3 && test2 === 1 && test3 === 3 };
}`,
    testCases: [
      { input: '"abcabcbb"', expected: '3' },
      { input: '"bbbbb"', expected: '1' },
      { input: '"pwwkew"', expected: '3' }
    ]
  }
];

function unescapeCode(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

class CollaborativeCodeCanvas {
  constructor() {
    this.activeRooms = new Map(); // roomId -> roomState
  }

  getAvailableQuestions() {
    return {
      success: true,
      questions: FAANG_PAIR_QUESTIONS
    };
  }

  /**
   * Initializes a collaborative coding room.
   */
  createOrJoinRoom(roomId = 'default_room', options = {}) {
    const qDefault = FAANG_PAIR_QUESTIONS[0];
    const {
      language = 'javascript',
      problemStatement = qDefault.description,
      initialCode = qDefault.starterCode,
      userId = 'candidate_peer',
      userName = 'Alex Candidate',
      userRole = 'Candidate'
    } = options;

    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, {
        roomId,
        language,
        problemId: qDefault.id,
        problemTitle: qDefault.title,
        problemStatement,
        currentCode: initialCode,
        version: 1,
        participants: new Map(), // userId -> details
        changeLog: [],
        rubric: null,
        terminalOutput: '// Ready to run. Click [Run Code (Ctrl+Enter)] to execute.',
        createdAt: Date.now(),
        lastActivity: Date.now()
      });
    }

    const room = this.activeRooms.get(roomId);
    room.participants.set(userId, {
      userId,
      userName,
      userRole,
      cursor: { line: 1, column: 1 },
      color: userRole === 'Interviewer' ? '#f59e0b' : '#38bdf8',
      lastSeen: Date.now()
    });

    return {
      success: true,
      roomId,
      language: room.language,
      problemTitle: room.problemTitle,
      problemStatement: room.problemStatement,
      code: room.currentCode,
      version: room.version,
      activeUserCount: room.participants.size,
      participants: Array.from(room.participants.values()),
      terminalOutput: room.terminalOutput
    };
  }

  /**
   * Applies an operational delta / update to the collaborative code document.
   */
  applyCodeUpdate(roomId, update = {}) {
    const room = this.activeRooms.get(roomId);
    if (!room) {
      return { success: false, error: 'COLLABORATIVE_ROOM_NOT_FOUND' };
    }

    const { userId = 'candidate', newCode, cursorPosition, userRole } = update;
    if (typeof newCode === 'string') {
      room.currentCode = unescapeCode(newCode);
      room.version += 1;
    }

    if (room.participants.has(userId)) {
      const p = room.participants.get(userId);
      if (cursorPosition) p.cursor = cursorPosition;
      if (userRole) p.userRole = userRole;
      p.lastSeen = Date.now();
    } else {
      room.participants.set(userId, {
        userId,
        userName: userRole === 'Interviewer' ? 'Staff Interviewer' : 'Candidate',
        userRole: userRole || 'Candidate',
        cursor: cursorPosition || { line: 1, column: 1 },
        color: userRole === 'Interviewer' ? '#f59e0b' : '#38bdf8',
        lastSeen: Date.now()
      });
    }

    room.lastActivity = Date.now();
    const lintAnalysis = this._lintCode(room.currentCode, room.language);

    return {
      success: true,
      roomId,
      version: room.version,
      code: room.currentCode,
      lintAnalysis,
      activeParticipants: Array.from(room.participants.values())
    };
  }

  /**
   * Executes the code within safe bounds.
   */
  executeRoomCode(roomId, payload = {}) {
    const room = this.activeRooms.get(roomId);
    const rawCode = payload.code || (room ? room.currentCode : payload.code);

    if (!rawCode) {
      return { success: false, error: 'NO_CODE_TO_EXECUTE' };
    }

    const codeToRun = unescapeCode(rawCode);

    const startTime = Date.now();
    let executionResult = null;
    let stdout = [];
    let isError = false;

    try {
      // Safe sandbox evaluation of solution
      const capturedConsole = [];
      const mockConsole = {
        log: (...args) => capturedConsole.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args) => capturedConsole.push('[ERR] ' + args.join(' '))
      };

      const sandbox = {
        console: mockConsole,
        Set,
        Map,
        Array,
        Object,
        Math,
        Date,
        parseInt,
        parseFloat,
        JSON
      };

      vm.createContext(sandbox);
      const scriptCode = codeToRun + '\n; if (typeof solution === "function") { solution(); } else if (typeof lengthOfLongestSubstring === "function") { lengthOfLongestSubstring("abcabcbb"); } else { "Executed successfully"; }';
      executionResult = vm.runInContext(scriptCode, sandbox, { timeout: 3000 });
    } catch (err) {
      isError = true;
      console.error('[CODE_CANVAS_EXEC_ERR]', err);
      executionResult = err.message + '\n' + (err.stack || '');
    }

    const durationMs = Date.now() - startTime;
    let outputString = isError
      ? `Runtime Exception: ${executionResult}`
      : `=== Execution Succeeded (${durationMs}ms) ===\nOutput: ${JSON.stringify(executionResult, null, 2)}`;

    if (stdout.length > 0) {
      outputString += '\n\nConsole Logs:\n' + stdout.join('\n');
    }

    if (room) {
      room.terminalOutput = outputString;
    }

    return {
      success: !isError,
      durationMs,
      result: executionResult,
      stdout,
      terminalOutput: outputString
    };
  }

  /**
   * Submits interviewer scorecard rubric
   */
  submitRubricAssessment(roomId, rubric = {}) {
    const {
      problemSolving = 4,
      codeQuality = 4,
      communication = 5,
      complexity = 4,
      interviewerNotes = 'Solid explanation of doubly linked list invariant for LRU cache O(1) eviction.',
      hiringRecommendation = 'Strong Hire'
    } = rubric;

    const totalScore = Number(problemSolving) + Number(codeQuality) + Number(communication) + Number(complexity);
    const maxScore = 20;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let decision = hiringRecommendation;
    if (!decision) {
      if (totalScore >= 17) decision = 'Strong Hire';
      else if (totalScore >= 14) decision = 'Lean Hire';
      else if (totalScore >= 10) decision = 'Lean No Hire';
      else decision = 'Strong No Hire';
    }

    const assessmentResult = {
      success: true,
      roomId,
      scores: {
        problemSolving,
        codeQuality,
        communication,
        complexity,
        totalScore,
        maxScore,
        percentage: `${percentage}%`
      },
      decision,
      interviewerNotes,
      timestamp: new Date().toISOString()
    };

    const room = this.activeRooms.get(roomId);
    if (room) {
      room.rubric = assessmentResult;
    }

    return assessmentResult;
  }
  _lintCode(code = '', language = 'javascript') {
    const lines = code.split('\n');
    const warnings = [];
    let detectedComplexity = 'O(N)';
    let loopNesting = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const loopMatches = (line.match(/\b(for|while)\s*\(/g) || []).length;
      if (loopMatches > 0) {
        loopNesting += loopMatches;
        if (loopNesting >= 2) {
          detectedComplexity = 'O(N^2) Quadratic';
          warnings.push({ line: i + 1, message: 'Nested loop detected: potential quadratic O(N^2) complexity bottleneck.' });
        }
      }
      if (/var\s+/.test(line)) {
        warnings.push({ line: i + 1, message: 'Prefer "const" or "let" over "var" to avoid scope hoisting issues.' });
      }
      if (/==\s+/.test(line) && !/===/.test(line)) {
        warnings.push({ line: i + 1, message: 'Use strict equality "===" instead of abstract equality "==".' });
      }
    }

    if (/\b(sort)\s*\(/.test(code)) {
      detectedComplexity = 'O(N log N)';
    }

    return {
      lineCount: lines.length,
      estimatedComplexity: detectedComplexity,
      warningsCount: warnings.length,
      warnings
    };
  }
}

const collaborativeCodeCanvas = new CollaborativeCodeCanvas();
module.exports = { CollaborativeCodeCanvas, collaborativeCodeCanvas, FAANG_PAIR_QUESTIONS };
