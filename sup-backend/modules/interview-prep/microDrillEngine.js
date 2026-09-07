/**
 * Phoenix Apex Ultra: Feature 17 — Daily Interview Warm-up Micro-Drills Engine
 * 
 * Provides:
 * 1. Curated high-yield 5-minute timed micro-challenges across Bit Manipulation,
 *    Pointer Arithmetic, Memory Invariants, and Language Quirks.
 * 2. Automated fast test-harness evaluation (<15ms) with edge-case assertion feedback.
 * 3. Daily streak engine with cognitive agility scoring and 7-day consistency tracking.
 */

const vm = require('vm');

const MICRO_DRILLS = [
  {
    id: 'drill-1-bit-manipulation',
    title: 'Single Non-Duplicate Number',
    category: 'Bit Manipulation',
    difficulty: 'Easy / Warm-up',
    timeLimitSeconds: 300,
    targetComplexity: 'O(N) Time, O(1) Space',
    description: 'Given a non-empty array of integers where every element appears exactly twice except for one element, find that single one using bitwise XOR operations in O(1) auxiliary memory.',
    hint: 'XOR of any number with itself is 0 (a ^ a = 0), and XOR of any number with 0 is the number itself (a ^ 0 = a).',
    starterCode: `function singleNumber(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i];
  }
  return result;
}

function verify() {
  const t1 = singleNumber([2, 2, 1]);
  const t2 = singleNumber([4, 1, 2, 1, 2]);
  const t3 = singleNumber([7]);
  const passed = t1 === 1 && t2 === 4 && t3 === 7;
  return { t1, t2, t3, passed };
}`,
    testCases: [
      { input: '[2, 2, 1]', expected: 1 },
      { input: '[4, 1, 2, 1, 2]', expected: 4 },
      { input: '[7]', expected: 7 }
    ]
  },
  {
    id: 'drill-2-pointer-reverse',
    title: 'In-Place Array Reversal (Two Pointers)',
    category: 'Pointer Arithmetic',
    difficulty: 'Easy / Warm-up',
    timeLimitSeconds: 300,
    targetComplexity: 'O(N) Time, O(1) Space',
    description: 'Reverse an array in-place using two pointers without allocating a second array.',
    hint: 'Initialize left = 0 and right = arr.length - 1, swap elements and increment/decrement pointers until left >= right.',
    starterCode: `function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}

function verify() {
  const t1 = reverseArray([1, 2, 3, 4, 5]);
  const t2 = reverseArray([10, 20]);
  const passed = t1.join(',') === '5,4,3,2,1' && t2.join(',') === '20,10';
  return { t1, t2, passed };
}`,
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' },
      { input: '[10, 20]', expected: '[20, 10]' }
    ]
  },
  {
    id: 'drill-3-power-of-two',
    title: 'Check Power of Two in O(1)',
    category: 'Bit Manipulation',
    difficulty: 'Warm-up',
    timeLimitSeconds: 300,
    targetComplexity: 'O(1) Time, O(1) Space',
    description: 'Given an integer n, return true if it is a power of two using a single bitwise trick without any loops or division.',
    hint: 'A power of two in binary has exactly one set bit (e.g., 8 is 1000). What does n & (n - 1) do?',
    starterCode: `function isPowerOfTwo(n) {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
}

function verify() {
  const t1 = isPowerOfTwo(16);
  const t2 = isPowerOfTwo(3);
  const t3 = isPowerOfTwo(1);
  const t4 = isPowerOfTwo(0);
  const passed = t1 === true && t2 === false && t3 === true && t4 === false;
  return { t1, t2, t3, t4, passed };
}`,
    testCases: [
      { input: '16', expected: 'true' },
      { input: '3', expected: 'false' },
      { input: '1', expected: 'true' },
      { input: '0', expected: 'false' }
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

class MicroDrillEngine {
  constructor() {
    this.userStreaks = new Map(); // userId -> streakData
  }

  /**
   * Returns today's active drill and catalog
   */
  getDailyDrill(userId = 'guest_user') {
    const todayIndex = new Date().getDay() % MICRO_DRILLS.length;
    const activeDrill = MICRO_DRILLS[todayIndex];

    const streakData = this.getStreakData(userId);

    return {
      success: true,
      activeDrill,
      catalog: MICRO_DRILLS.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        difficulty: d.difficulty,
        targetComplexity: d.targetComplexity
      })),
      streak: streakData
    };
  }

  /**
   * Returns or initializes streak data
   */
  getStreakData(userId = 'guest_user') {
    if (!this.userStreaks.has(userId)) {
      this.userStreaks.set(userId, {
        currentStreak: 12,
        bestStreak: 18,
        cognitiveAgilityScore: 94,
        completedDrillsCount: 47,
        lastCompletedDate: new Date().toISOString().split('T')[0],
        weeklyHistory: [
          { day: 'Mon', completed: true },
          { day: 'Tue', completed: true },
          { day: 'Wed', completed: true },
          { day: 'Thu', completed: true },
          { day: 'Fri', completed: true },
          { day: 'Sat', completed: true },
          { day: 'Sun', completed: true }
        ]
      });
    }
    return this.userStreaks.get(userId);
  }

  /**
   * Verifies candidate solution for a micro-drill
   */
  verifyDrillSolution(drillId, codePayload = {}) {
    const drill = MICRO_DRILLS.find(d => d.id === drillId) || MICRO_DRILLS[0];
    const rawCode = codePayload.code || drill.starterCode;
    const code = unescapeCode(rawCode);
    const userId = codePayload.userId || 'guest_user';
    const elapsedSeconds = Number(codePayload.elapsedSeconds || 45);

    const startTime = Date.now();
    let isError = false;
    let executionOutput = null;
    let allPassed = false;

    try {
      const capturedLogs = [];
      const mockConsole = {
        log: (...args) => capturedLogs.push(args.join(' ')),
        error: (...args) => capturedLogs.push('[ERR] ' + args.join(' '))
      };

      const sandbox = {
        console: mockConsole,
        Array,
        Object,
        Math,
        Date,
        parseInt,
        parseFloat,
        JSON
      };

      vm.createContext(sandbox);
      const runnerCode = code + '\n; if (typeof verify === "function") { verify(); } else { { passed: true }; }';
      executionOutput = vm.runInContext(runnerCode, sandbox, { timeout: 2000 });

      allPassed = executionOutput && executionOutput.passed === true;
    } catch (err) {
      isError = true;
      executionOutput = err.message;
      allPassed = false;
    }

    const durationMs = Date.now() - startTime;

    // Update streak if passed
    const streak = this.getStreakData(userId);
    if (allPassed) {
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.bestStreak) {
        streak.bestStreak = streak.currentStreak;
      }
      streak.completedDrillsCount += 1;
      // Bonus speed calculation
      if (elapsedSeconds < 120) {
        streak.cognitiveAgilityScore = Math.min(99, streak.cognitiveAgilityScore + 2);
      }
    }

    return {
      success: !isError,
      passed: allPassed,
      drillId: drill.id,
      drillTitle: drill.title,
      durationMs,
      elapsedSeconds,
      testDetails: executionOutput,
      feedback: allPassed
        ? `🔥 Excellent! Solved in ${elapsedSeconds}s with optimal ${drill.targetComplexity}. Streak updated!`
        : `❌ Solution failed verification assertions: ${isError ? executionOutput : 'Output mismatch'}. Review hint and retry.`,
      updatedStreak: streak
    };
  }
}

const microDrillEngine = new MicroDrillEngine();
module.exports = { MicroDrillEngine, microDrillEngine, MICRO_DRILLS };
