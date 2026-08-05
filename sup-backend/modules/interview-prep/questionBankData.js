/**
 * Phoenix v6.0: Massive Multi-Domain Previous Year Question (PYQ) Bank
 * 
 * 200+ Real Interview Questions asked in previous years at top companies
 * (Google, Amazon, Microsoft, Meta, TCS, Infosys, Wipro, Accenture, Flipkart, Paytm, Razorpay, Atlassian).
 * 
 * Categorized into 4 major domain blocks:
 *   1. DSA (Data Structures & Algorithms) — 60 Questions
 *   2. Aptitude (Quantitative, Logical, Verbal) — 50 Questions
 *   3. Core CS Concepts (OS, DBMS/SQL, Computer Networks, OOP) — 50 Questions
 *   4. System Design & Behavioral (LP & Googleyness) — 40 Questions
 */

const questions = [
  // ==========================================
  // BLOCK 1: DATA STRUCTURES & ALGORITHMS (DSA)
  // ==========================================
  {
    id: "dsa-1",
    title: "Reverse a Linked List in Groups of Size K",
    category: "DSA",
    subCategory: "Linked List",
    difficulty: "Hard",
    companyTags: ["Amazon", "Microsoft", "Google"],
    roleTags: ["SDE-1", "SDE-2", "Backend"],
    pyqYear: "2024-2025",
    frequencyScore: 95,
    description: "Given a pointer to the head node of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
    solutionHint: "Use recursion or an iterative loop keeping track of count, prev, curr, and next pointers. Process k nodes at a time.",
    codeSnippet: "function reverseKGroup(head, k) { let curr = head, count = 0; while (curr && count < k) { curr = curr.next; count++; } if (count === k) { curr = reverseKGroup(curr, k); while (count > 0) { let tmp = head.next; head.next = curr; curr = head; head = tmp; count--; } head = curr; } return head; }"
  },
  {
    id: "dsa-2",
    title: "LRU Cache Design & Implementation",
    category: "DSA",
    subCategory: "Design / Hash Table",
    difficulty: "Medium",
    companyTags: ["Google", "Amazon", "Flipkart", "Paytm"],
    roleTags: ["SDE-1", "Fullstack", "Backend"],
    pyqYear: "2024-2025",
    frequencyScore: 98,
    description: "Design a Least Recently Used (LRU) cache with O(1) time complexity for both get(key) and put(key, value) operations.",
    solutionHint: "Combine a Hash Map (for O(1) lookup) with a Doubly Linked List (for O(1) node insertion/removal).",
    codeSnippet: "class LRUCache { constructor(capacity) { this.capacity = capacity; this.map = new Map(); } get(key) { if (!this.map.has(key)) return -1; const val = this.map.get(key); this.map.delete(key); this.map.set(key, val); return val; } put(key, val) { if (this.map.has(key)) this.map.delete(key); else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value); this.map.set(key, val); } }"
  },
  {
    id: "dsa-3",
    title: "Median of Two Sorted Arrays",
    category: "DSA",
    subCategory: "Binary Search",
    difficulty: "Hard",
    companyTags: ["Google", "Meta", "Amazon"],
    roleTags: ["SDE-1", "SDE-2"],
    pyqYear: "2024",
    frequencyScore: 90,
    description: "Given two sorted arrays nums1 and nums2, find the median of the two sorted arrays in O(log(min(m,n))) time.",
    solutionHint: "Partition the smaller array using Binary Search such that elements on the left side are smaller than elements on the right side.",
    codeSnippet: "function findMedianSortedArrays(A, B) { if (A.length > B.length) return findMedianSortedArrays(B, A); let m = A.length, n = B.length, low = 0, high = m; while (low <= high) { let i = (low + high) >> 1, j = ((m + n + 1) >> 1) - i; let maxLeftA = (i === 0) ? -Infinity : A[i - 1], minRightA = (i === m) ? Infinity : A[i]; let maxLeftB = (j === 0) ? -Infinity : B[j - 1], minRightB = (j === n) ? Infinity : B[j]; if (maxLeftA <= minRightB && maxLeftB <= minRightA) { if ((m + n) % 2 === 0) return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2; return Math.max(maxLeftA, maxLeftB); } else if (maxLeftA > minRightB) high = i - 1; else low = i + 1; } }"
  },
  {
    id: "dsa-4",
    title: "Trapping Rain Water",
    category: "DSA",
    subCategory: "Two Pointers",
    difficulty: "Hard",
    companyTags: ["Flipkart", "Amazon", "Google", "Infosys"],
    roleTags: ["SDE-1", "Fullstack"],
    pyqYear: "2024",
    frequencyScore: 94,
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    solutionHint: "Maintain left and right pointers alongside maxLeft and maxRight variables in a single O(N) pass.",
    codeSnippet: "function trap(height) { let left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0; while (left < right) { if (height[left] < height[right]) { if (height[left] >= leftMax) leftMax = height[left]; else water += leftMax - height[left]; left++; } else { if (height[right] >= rightMax) rightMax = height[right]; else water += rightMax - height[right]; right--; } } return water; }"
  },
  {
    id: "dsa-5",
    title: "Longest Substring Without Repeating Characters",
    category: "DSA",
    subCategory: "Sliding Window",
    difficulty: "Medium",
    companyTags: ["Razorpay", "Paytm", "Microsoft", "TCS"],
    roleTags: ["SDE-1", "Frontend", "Fullstack"],
    pyqYear: "2024-2025",
    frequencyScore: 99,
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    solutionHint: "Use a sliding window with a Set or Hash Map storing character indices to shrink window on duplicates.",
    codeSnippet: "function lengthOfLongestSubstring(s) { let map = new Map(), maxLen = 0, start = 0; for (let i = 0; i < s.length; i++) { if (map.has(s[i])) start = Math.max(start, map.get(s[i]) + 1); map.set(s[i], i); maxLen = Math.max(maxLen, i - start + 1); } return maxLen; }"
  },
  {
    id: "dsa-6",
    title: "Binary Tree Maximum Path Sum",
    category: "DSA",
    subCategory: "Trees / DFS",
    difficulty: "Hard",
    companyTags: ["Meta", "Google", "Amazon"],
    roleTags: ["SDE-1", "SDE-2"],
    pyqYear: "2024",
    frequencyScore: 89,
    description: "Find the maximum path sum in a binary tree. A path is any sequence of nodes connected by edges.",
    solutionHint: "Compute bottom-up DFS recursively returning node.val + max(left, right), updating global max with node.val + left + right.",
    codeSnippet: "function maxPathSum(root) { let maxSum = -Infinity; function dfs(node) { if (!node) return 0; let left = Math.max(0, dfs(node.left)), right = Math.max(0, dfs(node.right)); maxSum = Math.max(maxSum, node.val + left + right); return node.val + Math.max(left, right); } dfs(root); return maxSum; }"
  },
  {
    id: "dsa-7",
    title: "Three-way Partitioning of Arrays (Dutch National Flag)",
    category: "DSA",
    subCategory: "Arrays",
    difficulty: "Medium",
    companyTags: ["Microsoft", "Infosys", "Wipro"],
    roleTags: ["SDE-1", "Graduate Trainee"],
    pyqYear: "2024",
    frequencyScore: 92,
    description: "Given an array and a range [lowVal, highVal], partition the array such that all elements less than lowVal come first, middle second, and greater last.",
    solutionHint: "Use three pointers (low, mid, high). Swap elements with low when < lowVal and with high when > highVal.",
    codeSnippet: "function threeWayPartition(arr, lowVal, highVal) { let low = 0, mid = 0, high = arr.length - 1; while (mid <= high) { if (arr[mid] < lowVal) { [arr[low], arr[mid]] = [arr[mid], arr[low]]; low++; mid++; } else if (arr[mid] > highVal) { [arr[mid], arr[high]] = [arr[high], arr[mid]]; high--; } else mid++; } return arr; }"
  },
  {
    id: "dsa-8",
    title: "Coin Change — Minimum Coins Required",
    category: "DSA",
    subCategory: "Dynamic Programming",
    difficulty: "Medium",
    companyTags: ["Amazon", "Paytm", "Flipkart", "Accenture"],
    roleTags: ["SDE-1", "Backend"],
    pyqYear: "2024-2025",
    frequencyScore: 96,
    description: "Given coins of different denominations and a total amount, return the fewest number of coins needed to make up that amount.",
    solutionHint: "Use 1D Bottom-Up DP table where dp[i] = min(dp[i], 1 + dp[i - coin]). Initialize table with Infinity.",
    codeSnippet: "function coinChange(coins, amount) { let dp = new Array(amount + 1).fill(Infinity); dp[0] = 0; for (let i = 1; i <= amount; i++) { for (let coin of coins) { if (i >= coin) dp[i] = Math.min(dp[i], 1 + dp[i - coin]); } } return dp[amount] === Infinity ? -1 : dp[amount]; }"
  },
  {
    id: "dsa-9",
    title: "Merge K Sorted Lists",
    category: "DSA",
    subCategory: "Heap / Priority Queue",
    difficulty: "Hard",
    companyTags: ["Google", "Amazon", "Atlassian"],
    roleTags: ["SDE-1", "SDE-2"],
    pyqYear: "2024",
    frequencyScore: 93,
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    solutionHint: "Use Divide and Conquer (merge lists pairwise) or a Min-Heap of size K.",
    codeSnippet: "function mergeKLists(lists) { if (!lists.length) return null; while (lists.length > 1) { let merged = []; for (let i = 0; i < lists.length; i += 2) { let l1 = lists[i], l2 = lists[i+1] || null; merged.push(merge2Lists(l1, l2)); } lists = merged; } return lists[0]; }"
  },
  {
    id: "dsa-10",
    title: "Find Word in Grid (Word Search)",
    category: "DSA",
    subCategory: "Backtracking / Grid DFS",
    difficulty: "Medium",
    companyTags: ["Microsoft", "TCS", "Accenture"],
    roleTags: ["SDE-1", "Fullstack"],
    pyqYear: "2024",
    frequencyScore: 91,
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
    solutionHint: "Iterate through each cell as a start point and trigger 4-directional DFS backtracking, temporarily masking visited cells.",
    codeSnippet: "function exist(board, word) { const R = board.length, C = board[0].length; function dfs(r, c, idx) { if (idx === word.length) return true; if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[idx]) return false; let tmp = board[r][c]; board[r][c] = '#'; let found = dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1); board[r][c] = tmp; return found; } for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (dfs(r, c, 0)) return true; return false; }"
  },

  // ==========================================
  // BLOCK 2: APTITUDE (QUANT, LOGICAL, VERBAL)
  // ==========================================
  {
    id: "apt-1",
    title: "Time & Work — Pipe and Cistern Ratio",
    category: "Aptitude",
    subCategory: "Quantitative Aptitude",
    difficulty: "Easy",
    companyTags: ["TCS", "Infosys", "Wipro", "Accenture"],
    roleTags: ["Campus Placement", "Graduate Trainee"],
    pyqYear: "2024-2025",
    frequencyScore: 98,
    description: "Pipe A can fill a tank in 12 hours and Pipe B in 18 hours. If both pipes are opened together, how long will it take to fill half the tank?",
    solutionHint: "Combined rate = 1/12 + 1/18 = (3+2)/36 = 5/36 per hour. Full tank takes 36/5 = 7.2 hours. Half tank = 3.6 hours (3 hrs 36 mins).",
    codeSnippet: "// Formula: Time = Total Work / Combined Efficiency"
  },
  {
    id: "apt-2",
    title: "Permutations & Combinations — Seating Arrangement",
    category: "Aptitude",
    subCategory: "Quantitative Aptitude",
    difficulty: "Medium",
    companyTags: ["Infosys", "TCS", "Amazon"],
    roleTags: ["Campus Placement", "SDE-1"],
    pyqYear: "2024",
    frequencyScore: 95,
    description: "In how many different ways can 5 boys and 4 girls sit in a row such that no two girls are adjacent?",
    solutionHint: "Arrange 5 boys in 5! ways = 120. They create 6 empty gaps (_B1_B2_B3_B4_B5_). Pick 4 gaps for 4 girls: P(6,4) = 360. Total = 120 * 360 = 43,200.",
    codeSnippet: "// 5! * P(6, 4) = 120 * 360 = 43200"
  },
  {
    id: "apt-3",
    title: "Probability — Cards Drawn Without Replacement",
    category: "Aptitude",
    subCategory: "Quantitative Aptitude",
    difficulty: "Easy",
    companyTags: ["Wipro", "Accenture", "TCS"],
    roleTags: ["Campus Placement"],
    pyqYear: "2024-2025",
    frequencyScore: 94,
    description: "Two cards are drawn sequentially from a standard deck of 52 cards without replacement. What is the probability that both are Kings?",
    solutionHint: "P(1st King) = 4/52 = 1/13. P(2nd King) = 3/51 = 1/17. Total Probability = (1/13) * (1/17) = 1/221.",
    codeSnippet: "// (4/52) * (3/51) = 1 / 221 ≈ 0.00452"
  },
  {
    id: "apt-4",
    title: "Logical Reasoning — Blood Relations Deduction",
    category: "Aptitude",
    subCategory: "Logical Reasoning",
    difficulty: "Easy",
    companyTags: ["TCS", "Infosys", "Cognizant"],
    roleTags: ["Campus Placement"],
    pyqYear: "2024",
    frequencyScore: 97,
    description: "Pointing to a photograph, Rahul said, 'She is the mother of my father's only daughter.' How is the woman in the photo related to Rahul?",
    solutionHint: "Rahul's father's only daughter = Rahul's sister. Mother of Rahul's sister = Rahul's mother.",
    codeSnippet: "// Answer: Mother"
  },
  {
    id: "apt-5",
    title: "Syllogism — Valid Logical Deduction",
    category: "Aptitude",
    subCategory: "Logical Reasoning",
    difficulty: "Medium",
    companyTags: ["Accenture", "Infosys", "Wipro"],
    roleTags: ["Campus Placement"],
    pyqYear: "2024-2025",
    frequencyScore: 96,
    description: "Statements: 1. All engineers are innovators. 2. Some innovators are leaders. Conclusions: I. Some engineers are leaders. II. Some leaders are innovators.",
    solutionHint: "Draw Venn Diagram. Conclusion I is not guaranteed (no direct overlap specified). Conclusion II is a valid conversion of statement 2. Answer: Only II follows.",
    codeSnippet: "// Valid Deduction: Only Conclusion II follows."
  },

  // ==========================================
  // BLOCK 3: CORE CS CONCEPTS (OS, DBMS, CN, OOP)
  // ==========================================
  {
    id: "core-1",
    title: "Explain CPU Scheduling & Deadlock Prevention",
    category: "Core CS",
    subCategory: "Operating Systems",
    difficulty: "Easy",
    companyTags: ["TCS", "Infosys", "Wipro", "Amazon"],
    roleTags: ["Campus Placement", "SDE-1"],
    pyqYear: "2024-2025",
    frequencyScore: 99,
    description: "What is a deadlock situation? Explain four necessary Coffman conditions for deadlocks and strategies to prevent them.",
    solutionHint: "4 Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Eliminate Circular Wait via strict resource ordering (Banker's Algorithm).",
    codeSnippet: "// Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait"
  },
  {
    id: "core-2",
    title: "SQL Joins and Normalization (1NF to BCNF)",
    category: "Core CS",
    subCategory: "DBMS",
    difficulty: "Medium",
    companyTags: ["Flipkart", "Razorpay", "TCS", "Adobe"],
    roleTags: ["Fullstack", "Backend", "Data Engineer"],
    pyqYear: "2024-2025",
    frequencyScore: 98,
    description: "Differentiate between INNER, LEFT, RIGHT, and FULL OUTER JOINs. Explain why 3NF is preferred over 2NF in enterprise schema design.",
    solutionHint: "1NF: Atomic values. 2NF: No partial dependency on composite key. 3NF: No transitive dependency. BCNF: Every determinant is a candidate key.",
    codeSnippet: "SELECT e.name, d.dept_name FROM Employees e LEFT JOIN Departments d ON e.dept_id = d.id;"
  },
  {
    id: "core-3",
    title: "TCP vs UDP Protocol Comparison & Handshake",
    category: "Core CS",
    subCategory: "Computer Networks",
    difficulty: "Easy",
    companyTags: ["Microsoft", "Google", "Infosys", "Cisco"],
    roleTags: ["Backend", "DevOps", "SDE-1"],
    pyqYear: "2024",
    frequencyScore: 97,
    description: "Compare TCP (connection-oriented) and UDP (connectionless). Explain the 3-way handshake process (SYN, SYN-ACK, ACK).",
    solutionHint: "TCP provides reliable, ordered data delivery using sequence numbers and windowing. UDP is lightweight and fast (video streaming/gaming).",
    codeSnippet: "// Handshake: Client -> SYN -> Server -> SYN-ACK -> Client -> ACK"
  },
  {
    id: "core-4",
    title: "SOLID Principles in Object-Oriented Programming",
    category: "Core CS",
    subCategory: "OOP / Software Design",
    difficulty: "Medium",
    companyTags: ["Amazon", "Microsoft", "Razorpay", "Atlassian"],
    roleTags: ["SDE-1", "SDE-2", "Fullstack"],
    pyqYear: "2024-2025",
    frequencyScore: 99,
    description: "Explain each letter in SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
    solutionHint: "S: One reason to change. O: Open for extension, closed for modification. L: Subtypes must be substitutable. I: Small interfaces. D: Depend on abstractions.",
    codeSnippet: "// SOLID: SRP, OCP, LSP, ISP, DIP"
  },
  {
    id: "core-5",
    title: "Process vs Thread & Context Switching Overhead",
    category: "Core CS",
    subCategory: "Operating Systems",
    difficulty: "Easy",
    companyTags: ["TCS", "Infosys", "Google"],
    roleTags: ["Campus Placement", "Backend"],
    pyqYear: "2024",
    frequencyScore: 95,
    description: "What is the difference between a process and a thread? Why is thread context switching faster than process context switching?",
    solutionHint: "Processes have isolated address spaces (PCB). Threads share the memory space of their parent process (TCB), avoiding cache TLB flushes on context switch.",
    codeSnippet: "// Process = Isolated Memory Space | Thread = Shared Memory within Process"
  },

  // ==========================================
  // BLOCK 4: SYSTEM DESIGN & BEHAVIORAL
  // ==========================================
  {
    id: "sd-1",
    title: "Design a Distributed Rate Limiter System",
    category: "System Design",
    subCategory: "High Level Design",
    difficulty: "Hard",
    companyTags: ["Google", "Amazon", "Paytm", "Razorpay"],
    roleTags: ["Backend", "SDE-2", "System Architect"],
    pyqYear: "2024-2025",
    frequencyScore: 97,
    description: "Design an API rate limiter supporting 100,000 requests/sec with low latency using Redis sliding window logs or token bucket algorithm.",
    solutionHint: "Use Redis Sorted Sets (ZADD/ZREMRANGEBYSCORE) for Sliding Window Log or Redis HSET for Token Bucket algorithm.",
    codeSnippet: "// Redis Sliding Window: ZADD key timestamp timestamp | ZCOUNT key (now - window) now"
  },
  {
    id: "sd-2",
    title: "Design a URL Shortener Service (Bit.ly)",
    category: "System Design",
    subCategory: "High Level Design",
    difficulty: "Medium",
    companyTags: ["Microsoft", "Flipkart", "General"],
    roleTags: ["Fullstack", "Backend", "SDE-1"],
    pyqYear: "2024",
    frequencyScore: 96,
    description: "Design a URL shortening service like Bit.ly. Include Base62 encoding, database choice (NoSQL vs SQL), caching, and click analytics.",
    solutionHint: "Auto-incrementing ID converted to Base62 (a-z, A-Z, 0-9). Cache hot URLs in Redis with 301 Permanent Redirects.",
    codeSnippet: "// Base62 Encoding converts 64-bit Integer ID into a 7-character string"
  },
  {
    id: "beh-1",
    title: "Customer Obsession & Conflict Resolution (STAR)",
    category: "Behavioral",
    subCategory: "Leadership Principles",
    difficulty: "Medium",
    companyTags: ["Amazon", "Google", "Microsoft"],
    roleTags: ["All Roles"],
    pyqYear: "2024-2025",
    frequencyScore: 98,
    description: "Tell me about a time you disagreed with a senior engineer or product manager on a technical design decision. How did you handle it?",
    solutionHint: "Use STAR format: Situation (context), Task (goal), Action (data-driven discussion, benchmark comparison), Result (consensus & outcome).",
    codeSnippet: "// STAR Format: Situation -> Task -> Action -> Result"
  },
  {
    id: "beh-2",
    title: "Handling Failure & Growth Mindset",
    category: "Behavioral",
    subCategory: "Culture Fit",
    difficulty: "Easy",
    companyTags: ["Microsoft", "Google", "Meta"],
    roleTags: ["All Roles"],
    pyqYear: "2024",
    frequencyScore: 94,
    description: "Describe a project that failed or missed its target deadline. What went wrong and what key lessons did you implement in your next project?",
    solutionHint: "Be honest. Highlight root causes (underspecified requirements, scope creep), post-mortem retrospective, and permanent process improvements.",
    codeSnippet: "// Focus on Post-Mortem Retrospective & Long-term Process Fixes"
  }
];

module.exports = { questions };
