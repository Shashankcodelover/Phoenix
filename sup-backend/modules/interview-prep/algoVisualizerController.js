/**
 * Phoenix v16.0: Graph & Dynamic Programming State Visualizer Controller
 * Generates deterministic, frame-by-frame execution states for classic
 * technical interview graph and dynamic programming problems.
 */

// 1. Dijkstra Frame Generator
function generateDijkstraFrames() {
  const nodes = ['A', 'B', 'C', 'D', 'E'];
  const edges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 }
  ];

  const frames = [
    {
      step: 0,
      line: 1,
      explanation: "Initialize min-priority queue and distance table. Set dist['A'] = 0, all other nodes to ∞.",
      currentNode: 'A',
      distances: { A: 0, B: '∞', C: '∞', D: '∞', E: '∞' },
      visited: [],
      pq: [{ node: 'A', dist: 0 }],
      activeEdge: null
    },
    {
      step: 1,
      line: 4,
      explanation: "Pop node 'A' (dist = 0) from PQ. Mark 'A' as currently active. Inspect adjacent neighbors: B (wt: 4), C (wt: 2).",
      currentNode: 'A',
      distances: { A: 0, B: '∞', C: '∞', D: '∞', E: '∞' },
      visited: ['A'],
      pq: [],
      activeEdge: null
    },
    {
      step: 2,
      line: 7,
      explanation: "Relax edge A -> C: 0 + 2 = 2 < ∞. Update dist['C'] = 2. Push ('C', 2) to PQ.",
      currentNode: 'A',
      distances: { A: 0, B: '∞', C: 2, D: '∞', E: '∞' },
      visited: ['A'],
      pq: [{ node: 'C', dist: 2 }],
      activeEdge: { from: 'A', to: 'C' }
    },
    {
      step: 3,
      line: 7,
      explanation: "Relax edge A -> B: 0 + 4 = 4 < ∞. Update dist['B'] = 4. Push ('B', 4) to PQ.",
      currentNode: 'A',
      distances: { A: 0, B: 4, C: 2, D: '∞', E: '∞' },
      visited: ['A'],
      pq: [{ node: 'C', dist: 2 }, { node: 'B', dist: 4 }],
      activeEdge: { from: 'A', to: 'B' }
    },
    {
      step: 4,
      line: 4,
      explanation: "Pop minimum element from PQ: Node 'C' (dist = 2). Mark 'C' as visited. Inspect neighbors B (wt: 1), D (wt: 8), E (wt: 10).",
      currentNode: 'C',
      distances: { A: 0, B: 4, C: 2, D: '∞', E: '∞' },
      visited: ['A', 'C'],
      pq: [{ node: 'B', dist: 4 }],
      activeEdge: null
    },
    {
      step: 5,
      line: 7,
      explanation: "Relax edge C -> B: 2 + 1 = 3 < 4! Shorter path discovered to B via C. Update dist['B'] = 3.",
      currentNode: 'C',
      distances: { A: 0, B: 3, C: 2, D: '∞', E: '∞' },
      visited: ['A', 'C'],
      pq: [{ node: 'B', dist: 3 }],
      activeEdge: { from: 'C', to: 'B' }
    },
    {
      step: 6,
      line: 7,
      explanation: "Relax edge C -> D: 2 + 8 = 10 < ∞. Update dist['D'] = 10. Push ('D', 10) to PQ.",
      currentNode: 'C',
      distances: { A: 0, B: 3, C: 2, D: 10, E: '∞' },
      visited: ['A', 'C'],
      pq: [{ node: 'B', dist: 3 }, { node: 'D', dist: 10 }],
      activeEdge: { from: 'C', to: 'D' }
    },
    {
      step: 7,
      line: 4,
      explanation: "Pop minimum element from PQ: Node 'B' (dist = 3). Inspect neighbor D (wt: 5).",
      currentNode: 'B',
      distances: { A: 0, B: 3, C: 2, D: 10, E: '∞' },
      visited: ['A', 'C', 'B'],
      pq: [{ node: 'D', dist: 10 }],
      activeEdge: null
    },
    {
      step: 8,
      line: 7,
      explanation: "Relax edge B -> D: 3 + 5 = 8 < 10! Shorter path to D found via B. Update dist['D'] = 8.",
      currentNode: 'B',
      distances: { A: 0, B: 3, C: 2, D: 8, E: '∞' },
      visited: ['A', 'C', 'B'],
      pq: [{ node: 'D', dist: 8 }],
      activeEdge: { from: 'B', to: 'D' }
    },
    {
      step: 9,
      line: 4,
      explanation: "Pop node 'D' (dist = 8) from PQ. Inspect neighbor E (wt: 2).",
      currentNode: 'D',
      distances: { A: 0, B: 3, C: 2, D: 8, E: '∞' },
      visited: ['A', 'C', 'B', 'D'],
      pq: [],
      activeEdge: null
    },
    {
      step: 10,
      line: 7,
      explanation: "Relax edge D -> E: 8 + 2 = 10 < ∞. Update dist['E'] = 10. Push ('E', 10) to PQ.",
      currentNode: 'D',
      distances: { A: 0, B: 3, C: 2, D: 8, E: 10 },
      visited: ['A', 'C', 'B', 'D'],
      pq: [{ node: 'E', dist: 10 }],
      activeEdge: { from: 'D', to: 'E' }
    },
    {
      step: 11,
      line: 12,
      explanation: "Pop node 'E' (dist = 10). Priority queue empty. All shortest paths computed from source 'A'.",
      currentNode: 'E',
      distances: { A: 0, B: 3, C: 2, D: 8, E: 10 },
      visited: ['A', 'C', 'B', 'D', 'E'],
      pq: [],
      activeEdge: null
    }
  ];

  return {
    algorithm: "Dijkstra's Shortest Path",
    type: "GRAPH",
    nodes: [
      { id: 'A', x: 80, y: 150 },
      { id: 'B', x: 220, y: 80 },
      { id: 'C', x: 220, y: 220 },
      { id: 'D', x: 380, y: 80 },
      { id: 'E', x: 480, y: 180 }
    ],
    edges,
    source: 'A',
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    code: [
      "function dijkstra(graph, start) {",
      "  const dist = { [start]: 0 };",
      "  const pq = new MinPriorityQueue();",
      "  while (!pq.isEmpty()) {",
      "    const { node, d } = pq.pop();",
      "    for (const [neighbor, weight] of graph[node]) {",
      "      if (d + weight < (dist[neighbor] ?? Infinity)) {",
      "        dist[neighbor] = d + weight;",
      "        pq.push(neighbor, dist[neighbor]);",
      "      }",
      "    }",
      "  }",
      "  return dist;",
      "}"
    ],
    frames
  };
}

// 2. 2D DP 0/1 Knapsack Frame Generator
function generateKnapsackFrames() {
  const weights = [2, 3, 4];
  const values = [3, 4, 5];
  const maxCapacity = 5;
  const n = weights.length;

  const rows = n + 1; // 0..3
  const cols = maxCapacity + 1; // 0..5

  const frames = [];
  const table = Array.from({ length: rows }, () => Array(cols).fill(0));

  let step = 0;
  frames.push({
    step: step++,
    row: 0,
    col: 0,
    explanation: "Base case: 0 items or capacity 0 yields maximum value of 0. DP matrix initialized to zeros.",
    table: JSON.parse(JSON.stringify(table)),
    formula: "dp[i][w] = 0 (base condition)"
  });

  for (let i = 1; i <= n; i++) {
    const itemWeight = weights[i - 1];
    const itemVal = values[i - 1];

    for (let w = 1; w <= maxCapacity; w++) {
      let formula = '';
      if (itemWeight <= w) {
        const withoutItem = table[i - 1][w];
        const withItem = itemVal + table[i - 1][w - itemWeight];
        table[i][w] = Math.max(withoutItem, withItem);
        formula = `dp[${i}][${w}] = max(dp[${i-1}][${w}], ${itemVal} + dp[${i-1}][${w - itemWeight}]) = max(${withoutItem}, ${withItem}) = ${table[i][w]}`;
      } else {
        table[i][w] = table[i - 1][w];
        formula = `dp[${i}][${w}] = dp[${i-1}][${w}] = ${table[i][w]} (weight ${itemWeight} > cap ${w})`;
      }

      frames.push({
        step: step++,
        row: i,
        col: w,
        currentItem: { index: i, weight: itemWeight, value: itemVal },
        explanation: `Considering Item ${i} (wt: ${itemWeight}, val: ${itemVal}) at Capacity ${w}. ${formula}`,
        table: JSON.parse(JSON.stringify(table)),
        formula
      });
    }
  }

  return {
    algorithm: "0/1 Knapsack Optimization",
    type: "DP",
    items: [
      { name: "Item 1", weight: 2, value: 3 },
      { name: "Item 2", weight: 3, value: 4 },
      { name: "Item 3", weight: 4, value: 5 }
    ],
    maxCapacity,
    timeComplexity: "O(N × W)",
    spaceComplexity: "O(N × W) or O(W) optimized",
    code: [
      "function knapsack(weights, values, W) {",
      "  const dp = Array(N + 1).fill(0).map(() => Array(W + 1).fill(0));",
      "  for (let i = 1; i <= N; i++) {",
      "    for (let w = 1; w <= W; w++) {",
      "      if (weights[i-1] <= w) {",
      "        dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);",
      "      } else {",
      "        dp[i][w] = dp[i-1][w];",
      "      }",
      "    }",
      "  }",
      "  return dp[N][W];",
      "}"
    ],
    frames
  };
}

// 3. Topological Sort (Kahn's Algorithm) Frame Generator
function generateTopologicalSortFrames() {
  const nodes = ['Prep', 'Code', 'Test', 'Review', 'Deploy'];
  const edges = [
    { from: 'Prep', to: 'Code' },
    { from: 'Code', to: 'Test' },
    { from: 'Code', to: 'Review' },
    { from: 'Test', to: 'Deploy' },
    { from: 'Review', to: 'Deploy' }
  ];

  const inDegrees = { Prep: 0, Code: 1, Test: 1, Review: 1, Deploy: 2 };
  const frames = [
    {
      step: 0,
      line: 1,
      explanation: "Compute in-degrees for all vertices: Prep: 0, Code: 1, Test: 1, Review: 1, Deploy: 2.",
      inDegrees: { ...inDegrees },
      queue: ['Prep'],
      topoOrder: []
    },
    {
      step: 1,
      line: 4,
      explanation: "Enqueue all nodes with in-degree 0: ['Prep'].",
      inDegrees: { ...inDegrees },
      queue: ['Prep'],
      topoOrder: []
    },
    {
      step: 2,
      line: 6,
      explanation: "Dequeue 'Prep' and append to TopoOrder. Decrement in-degree of child 'Code' (1 -> 0). Push 'Code' to Queue.",
      inDegrees: { Prep: 0, Code: 0, Test: 1, Review: 1, Deploy: 2 },
      queue: ['Code'],
      topoOrder: ['Prep']
    },
    {
      step: 3,
      line: 6,
      explanation: "Dequeue 'Code'. Decrement in-degrees: Test (1 -> 0), Review (1 -> 0). Enqueue both.",
      inDegrees: { Prep: 0, Code: 0, Test: 0, Review: 0, Deploy: 2 },
      queue: ['Test', 'Review'],
      topoOrder: ['Prep', 'Code']
    },
    {
      step: 4,
      line: 6,
      explanation: "Dequeue 'Test'. Decrement in-degree of 'Deploy' (2 -> 1).",
      inDegrees: { Prep: 0, Code: 0, Test: 0, Review: 0, Deploy: 1 },
      queue: ['Review'],
      topoOrder: ['Prep', 'Code', 'Test']
    },
    {
      step: 5,
      line: 6,
      explanation: "Dequeue 'Review'. Decrement in-degree of 'Deploy' (1 -> 0). Enqueue 'Deploy'.",
      inDegrees: { Prep: 0, Code: 0, Test: 0, Review: 0, Deploy: 0 },
      queue: ['Deploy'],
      topoOrder: ['Prep', 'Code', 'Test', 'Review']
    },
    {
      step: 6,
      line: 6,
      explanation: "Dequeue 'Deploy'. Queue is empty. Valid DAG topological order achieved: Prep -> Code -> Test -> Review -> Deploy.",
      inDegrees: { Prep: 0, Code: 0, Test: 0, Review: 0, Deploy: 0 },
      queue: [],
      topoOrder: ['Prep', 'Code', 'Test', 'Review', 'Deploy']
    }
  ];

  return {
    algorithm: "Kahn's Topological Sort (DAG)",
    type: "GRAPH",
    nodes: [
      { id: 'Prep', x: 80, y: 150 },
      { id: 'Code', x: 200, y: 150 },
      { id: 'Test', x: 340, y: 80 },
      { id: 'Review', x: 340, y: 220 },
      { id: 'Deploy', x: 480, y: 150 }
    ],
    edges,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    frames
  };
}

const getAlgorithmExecutionFrames = (req, res) => {
  try {
    const { algo = 'dijkstra' } = req.query;

    let payload;
    switch (algo.toLowerCase()) {
      case 'knapsack':
        payload = generateKnapsackFrames();
        break;
      case 'toposort':
        payload = generateTopologicalSortFrames();
        break;
      case 'dijkstra':
      default:
        payload = generateDijkstraFrames();
        break;
    }

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAlgorithmExecutionFrames };
