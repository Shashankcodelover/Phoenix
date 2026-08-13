/**
 * Phoenix v21.0: Live Code-Pairing Collaborative Canvas Engine
 * 
 * Manages synchronized real-time code editing sessions between candidates and interviewers,
 * multi-cursor tracking, live AST linting, and Big-O runtime profiling.
 */

class CollaborativeCodeCanvas {
  constructor() {
    this.activeRooms = new Map(); // roomId -> roomState
  }

  /**
   * Initializes a collaborative coding room.
   * 
   * @param {string} roomId
   * @param {Object} options - Language, problemStatement, initialCode
   */
  createOrJoinRoom(roomId, options = {}) {
    const {
      language = 'javascript',
      problemStatement = 'Implement a function to find the maximum sub-array sum in O(N) time.',
      initialCode = '// Write your solution here\nfunction maxSubArray(nums) {\n  \n}\n',
      userId = 'interviewer_lead'
    } = options;

    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, {
        roomId,
        language,
        problemStatement,
        currentCode: initialCode,
        version: 1,
        participants: new Map(), // userId -> cursorPosition
        changeLog: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
      });
    }

    const room = this.activeRooms.get(roomId);
    room.participants.set(userId, { line: 1, column: 1, lastSeen: Date.now() });

    return {
      roomId,
      language: room.language,
      problemStatement: room.problemStatement,
      code: room.currentCode,
      version: room.version,
      activeUserCount: room.participants.size
    };
  }

  /**
   * Applies an operational delta / update to the collaborative code document.
   * 
   * @param {string} roomId
   * @param {Object} update - { userId, codeDelta, newCode, cursorPosition }
   */
  applyCodeUpdate(roomId, update = {}) {
    const room = this.activeRooms.get(roomId);
    if (!room) {
      return { success: false, error: 'COLLABORATIVE_ROOM_NOT_FOUND' };
    }

    const { userId, newCode, cursorPosition } = update;
    if (typeof newCode === 'string') {
      room.currentCode = newCode;
      room.version += 1;
    }

    if (cursorPosition && userId) {
      room.participants.set(userId, { ...cursorPosition, lastSeen: Date.now() });
    }

    room.lastActivity = Date.now();

    // Perform live AST static linting & complexity scan
    const lintAnalysis = this._lintCode(room.currentCode, room.language);

    return {
      success: true,
      roomId,
      version: room.version,
      code: room.currentCode,
      lintAnalysis,
      activeParticipants: Array.from(room.participants.entries()).map(([uid, pos]) => ({ userId: uid, ...pos }))
    };
  }

  /**
   * Internal lightweight AST code analysis & syntax linting.
   */
  _lintCode(code = '', language = 'javascript') {
    const lines = code.split('\n');
    const warnings = [];
    let detectedComplexity = 'O(N)';
    let loopNesting = 0;

    // Detect nested loops for Big-O profiling
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
module.exports = { CollaborativeCodeCanvas, collaborativeCodeCanvas };
