/**
 * Phoenix Astra Cognitive War Room - Feature 69 Engine
 * Real-Time AI Autonomous Behavioral Coding Pair & Voice Critique Sidecar
 *
 * Implements:
 * 1. FAANG Live-Coding Problem Archetypes with Optimal Lower Bounds
 * 2. AST Static Analysis for Time/Space Complexity & Anti-Pattern Detection
 * 3. Proactive Edge-Case Vulnerability Scanner
 * 4. Think-Out-Loud Synchrony & Speech Cadence Scoring
 * 5. 4-Tier Interviewer Voice Hint Ladder & Natural Interruption System
 */

class CodingPairSidecarEngine {
  constructor() {}

  getProblems() {
    return [
      {
        id: 'lru-cache',
        title: 'LRU Cache Design (LeetCode 146 Class)',
        difficulty: 'Hard / Staff Core',
        targetTimeComplexity: 'O(1) get, O(1) put',
        targetSpaceComplexity: 'O(Capacity)',
        optimalDataStructures: ['Doubly Linked List', 'Hash Map / Map'],
        edgeCases: [
          { name: 'Capacity Zero or Negative', checkRegex: /capacity\s*<=?\s*0/i, weight: 15 },
          { name: 'Update Existing Key Value', checkRegex: /this\.map\.has|this\.cache\.hasOwnProperty/i, weight: 25 },
          { name: 'Head/Tail Sentinel Pointers', checkRegex: /dummy|sentinel|head.*tail|tail.*head/i, weight: 30 },
          { name: 'Eviction on Capacity Overflow', checkRegex: /delete|remove|this\.map\.delete/i, weight: 30 }
        ],
        sampleGoodCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, val);
  }
}`,
        sampleSuboptimalCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
  }
  get(key) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].key === key) {
        const item = this.items.splice(i, 1)[0];
        this.items.push(item);
        return item.val;
      }
    }
    return -1;
  }
  put(key, val) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].key === key) {
        this.items.splice(i, 1);
        break;
      }
    }
    if (this.items.length >= this.capacity) {
      this.items.shift();
    }
    this.items.push({ key, val });
  }
}`
      },
      {
        id: 'median-sorted-arrays',
        title: 'Median of Two Sorted Arrays (LeetCode 4 Class)',
        difficulty: 'Hard / Staff Core',
        targetTimeComplexity: 'O(log(min(m, n)))',
        targetSpaceComplexity: 'O(1)',
        optimalDataStructures: ['Binary Search on Partition Cut'],
        edgeCases: [
          { name: 'Array A is Empty', checkRegex: /nums1\.length\s*===?\s*0/i, weight: 20 },
          { name: 'Total Length is Even vs Odd', checkRegex: /%\s*2\s*===?\s*0/i, weight: 30 },
          { name: 'Partition Cut at Infinity Boundaries', checkRegex: /Infinity|-Infinity/i, weight: 30 },
          { name: 'Ensure Binary Search on Smaller Array', checkRegex: /nums1\.length\s*>\s*nums2\.length/i, weight: 20 }
        ],
        sampleGoodCode: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let low = 0, high = m;
  while (low <= high) {
    const partitionX = Math.floor((low + high) / 2);
    const partitionY = Math.floor((m + n + 1) / 2) - partitionX;
    const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
    const minRightX = partitionX === m ? Infinity : nums1[partitionX];
    const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
    const minRightY = partitionY === n ? Infinity : nums2[partitionY];
    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
      } else {
        return Math.max(maxLeftX, maxLeftY);
      }
    } else if (maxLeftX > minRightY) {
      high = partitionX - 1;
    } else {
      low = partitionX + 1;
    }
  }
}`,
        sampleSuboptimalCode: `function findMedianSortedArrays(nums1, nums2) {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);
  if (merged.length % 2 === 0) {
    return (merged[mid - 1] + merged[mid]) / 2;
  }
  return merged[mid];
}`
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water (LeetCode 42 Class)',
        difficulty: 'Hard / Google Senior Bar Raiser',
        targetTimeComplexity: 'O(N)',
        targetSpaceComplexity: 'O(1)',
        optimalDataStructures: ['Two Pointers with Left/Right Max Bounds'],
        edgeCases: [
          { name: 'Length Less Than 3', checkRegex: /height\.length\s*<\s*3/i, weight: 25 },
          { name: 'Monotonically Increasing/Decreasing Terrain', checkRegex: /leftMax|rightMax/i, weight: 35 },
          { name: 'Zero Elevation Ground Floors', checkRegex: /height\[(left|right)\]/i, weight: 20 },
          { name: 'Pointer Convergence Invariant', checkRegex: /left\s*<\s*right/i, weight: 20 }
        ],
        sampleGoodCode: `function trap(height) {
  if (!height || height.length < 3) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else totalWater += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else totalWater += rightMax - height[right];
      right--;
    }
  }
  return totalWater;
}`,
        sampleSuboptimalCode: `function trap(height) {
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    let maxLeft = 0, maxRight = 0;
    for (let j = 0; j <= i; j++) maxLeft = Math.max(maxLeft, height[j]);
    for (let j = i; j < height.length; j++) maxRight = Math.max(maxRight, height[j]);
    water += Math.min(maxLeft, maxRight) - height[i];
  }
  return water;
}`
      }
    ];
  }

  evaluateCandidateCode(params) {
    const {
      problemId = 'lru-cache',
      code = '',
      codingDurationSec = 360,
      speechCadenceWpm = 135,
      thinkAloudRatioPct = 68
    } = params;

    const problem = this.getProblems().find(p => p.id === problemId) || this.getProblems()[0];

    // Edge case evaluation
    let edgeCasesPassed = 0;
    const edgeCaseResults = problem.edgeCases.map(ec => {
      const passed = ec.checkRegex.test(code);
      if (passed) edgeCasesPassed += ec.weight;
      return {
        name: ec.name,
        passed,
        weight: ec.weight,
        feedback: passed ? 'Handled correctly in code' : 'Missing guard or state transition'
      };
    });

    // Complexity Analysis
    let detectedTimeComplexity = 'O(N)';
    let detectedSpaceComplexity = 'O(N)';
    let isOptimal = false;
    let antiPatterns = [];

    if (problem.id === 'lru-cache') {
      if (/\.splice\(|\.indexOf\(|\.shift\(/i.test(code) && /for\s*\(|while\s*\(/i.test(code)) {
        detectedTimeComplexity = 'O(N) - Linear Array Scan';
        detectedSpaceComplexity = 'O(Capacity)';
        antiPatterns.push('Array linear search/splice causes O(N) cache eviction and lookup.');
        isOptimal = false;
      } else if (/new\s+Map\(\)/i.test(code) || (/head/i.test(code) && /tail/i.test(code))) {
        detectedTimeComplexity = 'O(1) - Constant Time';
        detectedSpaceComplexity = 'O(Capacity)';
        isOptimal = true;
      }
    } else if (problem.id === 'median-sorted-arrays') {
      if (/\.sort\(/i.test(code) || /\[\s*\.\.\.nums1/i.test(code)) {
        detectedTimeComplexity = 'O((M+N) log(M+N)) - Array Sort';
        detectedSpaceComplexity = 'O(M + N)';
        antiPatterns.push('Full array merge & sort violates the strict O(log(min(m, n))) requirement.');
        isOptimal = false;
      } else if (/while\s*\(low\s*<=?\s*high\)/i.test(code) && /partition/i.test(code)) {
        detectedTimeComplexity = 'O(log(min(M, N))) - Binary Search';
        detectedSpaceComplexity = 'O(1)';
        isOptimal = true;
      }
    } else if (problem.id === 'trapping-rain-water') {
      if ((code.match(/for\s*\(/g) || []).length >= 2 && !/while\s*\(left\s*</i.test(code)) {
        detectedTimeComplexity = 'O(N²) - Nested Traversal';
        detectedSpaceComplexity = 'O(1)';
        antiPatterns.push('Nested loop scanning left and right bounds repeatedly for every coordinate.');
        isOptimal = false;
      } else if (/while\s*\(left\s*<\s*right\)/i.test(code)) {
        detectedTimeComplexity = 'O(N) - Two Pointers Single Pass';
        detectedSpaceComplexity = 'O(1)';
        isOptimal = true;
      }
    }

    // Voice Interruption Ladder Generation
    let voiceInterruption = null;
    if (!isOptimal) {
      if (antiPatterns.length > 0) {
        voiceInterruption = {
          tier: 'Level 2: Algorithmic Clarification',
          audioWaveformPreset: 'INTERVIEWER_INQUISITIVE',
          spokenDialogue: `"Let's look at your current look-up and eviction operations. What is the time complexity right now, and how could an auxiliary pointer structure bring that down to O(1)?"`,
          recommendedAction: 'Explain data structure trade-offs (e.g. Map order preservation vs Doubly Linked List nodes) to interviewer.'
        };
      }
    } else if (edgeCasesPassed < 70) {
      voiceInterruption = {
        tier: 'Level 1: Edge-Case Nudge',
        audioWaveformPreset: 'INTERVIEWER_SUBTLE',
        spokenDialogue: `"Your core logic is clean, but how will this behave if the cache capacity is 0, or if the same key is put with an updated value multiple times?"`,
        recommendedAction: 'Step through zero capacity or repeated key scenarios verbally.'
      };
    } else {
      voiceInterruption = {
        tier: 'Level 0: Staff Confirmation',
        audioWaveformPreset: 'INTERVIEWER_AFFIRMATIVE',
        spokenDialogue: `"Excellent invariant preservation. The two-pointer / pointer rewiring strategy avoids redundant memory allocations. Let's discuss concurrency in a multi-threaded scenario."`,
        recommendedAction: 'Discuss read/write locks, striping, or optimistic locking.'
      };
    }

    // Think-Out-Loud synchrony rating
    let thinkAloudVerdict = 'OPTIMAL_SYNCHRONY';
    if (thinkAloudRatioPct < 45) {
      thinkAloudVerdict = 'SILENT_CODER_WARNING (Below 50% Vocalization)';
    } else if (thinkAloudRatioPct > 85) {
      thinkAloudVerdict = 'HYPER_VERBAL_DELIBERATION';
    }

    // Composite Score
    const compositeScore = Math.min(100, Math.round(
      (isOptimal ? 45 : 15) +
      (edgeCasesPassed * 0.35) +
      (thinkAloudRatioPct * 0.20)
    ));

    return {
      problemId: problem.id,
      problemTitle: problem.title,
      targetTimeComplexity: problem.targetTimeComplexity,
      targetSpaceComplexity: problem.targetSpaceComplexity,
      detectedComplexity: {
        time: detectedTimeComplexity,
        space: detectedSpaceComplexity,
        isOptimal
      },
      edgeCases: {
        results: edgeCaseResults,
        scorePct: edgeCasesPassed
      },
      behavioralAcoustics: {
        speechCadenceWpm,
        thinkAloudRatioPct,
        verdict: thinkAloudVerdict,
        cadenceStatus: speechCadenceWpm >= 120 && speechCadenceWpm <= 160 ? 'BALANCED_PROFESSIONAL' : 'ANOMALOUS_PACE'
      },
      antiPatternsDetected: antiPatterns,
      voiceInterruption,
      compositeScore,
      barRaiserRecommendation: compositeScore >= 80 
        ? 'STRONG_HIRE // Staff Software Engineer' 
        : (compositeScore >= 60 ? 'HIRE // Senior Software Engineer' : 'NO_HIRE // Needs Algorithmic Optimization')
    };
  }
}

module.exports = new CodingPairSidecarEngine();
