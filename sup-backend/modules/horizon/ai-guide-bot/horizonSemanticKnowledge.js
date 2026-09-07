/**
 * Horizon Semantic Knowledge Engine
 * =================================
 * High-density pedagogical knowledge repository powering the Horizon AI Mentor.
 * Built for Smart India Hackathon & Microsoft Imagine Cup resilience standards:
 * Guarantees instantaneous, deep, production-grade responses even under
 * rate-limiting, quota exhaustion, or offline network conditions.
 */

const KNOWLEDGE_BANK = [
  // ─── 1. MODERN JAVASCRIPT & ES6+ ──────────────────────────────────────
  {
    id: 'js-closures',
    keywords: ['closure', 'lexical scope', 'scope', 'encapsulation', 'private variables'],
    topic: 'JavaScript Closures & Lexical Scoping',
    focusElements: ['#learningStudio', '#codeSandboxCard'],
    content: `### 🧠 Understanding JavaScript Closures

A **closure** is the combination of a function bundled together (enclosed) with references to its surrounding state (the **lexical environment**). In JavaScript, closures are created every time a function is created, at function creation time.

#### Mental Model
Think of a backpack: whenever a function is defined inside another function, it packs all the variables from its parent scope into an invisible backpack. Even if the parent function finishes executing and pops off the call stack, the inner function retains access to that backpack!

#### Production Code Example
\`\`\`javascript
function createRateLimiter(maxRequests, windowMs) {
  let requestTimestamps = []; // Enclosed in closure!

  return function executeRequest(action) {
    const now = Date.now();
    // Evict expired timestamps outside the rolling window
    requestTimestamps = requestTimestamps.filter(t => now - t < windowMs);

    if (requestTimestamps.length >= maxRequests) {
      const waitTime = Math.ceil((windowMs - (now - requestTimestamps[0])) / 1000);
      throw new Error(\`Rate limit exceeded. Try again in \${waitTime}s\`);
    }

    requestTimestamps.push(now);
    return action();
  };
}

const apiCall = createRateLimiter(3, 10000); // 3 calls per 10s
\`\`\`

#### Top Interview Pitfalls
1. **Loop variable capture with \`var\` vs \`let\`**: \`var\` is function-scoped; inside a loop, all closures reference the exact same variable. \`let\` is block-scoped, binding a new instance for every iteration.
2. **Memory Leaks**: Enclosing large objects or unclosed event listeners prevents garbage collection. Always detach handlers when components unmount!`
  },
  {
    id: 'js-event-loop',
    keywords: ['event loop', 'microtask', 'macrotask', 'call stack', 'settimeout', 'promise execution order', 'async'],
    topic: 'The JavaScript Event Loop & Concurrency Model',
    focusElements: ['#learningStudio', '#codeSandboxCard'],
    content: `### ⚡ The JavaScript Event Loop, Call Stack & Task Queues

JavaScript is single-threaded (one call stack), yet achieves high-throughput non-blocking I/O through the **Event Loop** runtime model.

#### Execution Priority Hierarchy
1. **Call Stack**: Synchronous code executes immediately to completion (Run-to-completion).
2. **Microtask Queue** (Highest Priority): \`Promise.then/catch/finally\`, \`queueMicrotask\`, \`MutationObserver\`. Empties *completely* after each stack frame before any macrotask runs!
3. **Macrotask / Task Queue** (Lower Priority): \`setTimeout\`, \`setInterval\`, \`setImmediate\`, I/O, UI rendering.

#### Classic Tricky Interview Question
\`\`\`javascript
console.log('1: Sync Start');

setTimeout(() => {
  console.log('2: Macrotask setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask Promise 1');
}).then(() => {
  console.log('4: Microtask Promise 2');
});

console.log('5: Sync End');

// OUTPUT:
// 1: Sync Start
// 5: Sync End
// 3: Microtask Promise 1
// 4: Microtask Promise 2
// 2: Macrotask setTimeout
\`\`\`

#### Key Takeaway for High-Performance Apps
Never starve the macrotask queue or render thread with recursive microtasks (\`Promise.resolve().then(recurse)\`). That locks up the browser UI!`
  },

  // ─── 2. REACT 19 & FRONTEND ARCHITECTURE ──────────────────────────────
  {
    id: 'react19-hooks',
    keywords: ['react', 'react 19', 'hooks', 'usetransition', 'useactionstate', 'reconciliation', 'virtual dom', 'useeffect'],
    topic: 'React 19 Hooks & Non-Blocking State Transitions',
    focusElements: ['#learningStudio', '#cycleTabs'],
    content: `### ⚛️ React 19 Core Hooks & Concurrent Rendering

React 19 introduces game-changing primitives for asynchronous state management and fluid user experiences:

#### 1. \`useTransition\` (Non-blocking UI Updates)
Allows marking state updates as low-priority transitions. Heavy recalculations or list filtering won't freeze keystrokes in input boxes!

\`\`\`jsx
import { useState, useTransition } from 'react';

function SearchStudentDatabase({ students }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(students);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val); // Urgent: updates immediately for typing responsiveness

    startTransition(() => {
      // Non-urgent: can be interrupted by subsequent keystrokes!
      const results = students.filter(s => s.name.toLowerCase().includes(val.toLowerCase()));
      setFiltered(results);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search 10,000+ records..." />
      {isPending && <span className="spinner">Filtering database...</span>}
      <StudentList items={filtered} />
    </div>
  );
}
\`\`\`

#### 2. \`useActionState\` (Form Submissions with Async State)
Eliminates boilerplate \`isSubmitting\`, \`error\`, and \`data\` state variables when executing Server Actions or API calls.`
  },

  // ─── 3. BACKEND, REST & DATABASE ARCHITECTURE ─────────────────────────
  {
    id: 'rest-idempotency',
    keywords: ['rest', 'rest api', 'idempotency', 'http methods', 'put vs post', 'status codes', 'api design'],
    topic: 'RESTful API Architecture & Idempotency',
    focusElements: ['#learningStudio', '#codeSandboxCard'],
    content: `### 🌐 REST API Design & The Idempotency Principle

In distributed systems, network partitions or retry storms can duplicate requests. **Idempotency** guarantees that executing an operation multiple times produces the exact same outcome as executing it once.

#### HTTP Method Idempotency Matrix
| Method | Idempotent? | Safe? | Purpose |
|---|---|---|---|
| **GET** | ✅ Yes | ✅ Yes | Retrieve resource (no side effects) |
| **PUT** | ✅ Yes | ❌ No | Replace entire resource or create with known URI |
| **PATCH** | ⚠️ Usually No | ❌ No | Partial update (e.g. \`{ $inc: { views: 1 } }\` is NOT idempotent) |
| **POST** | ❌ No | ❌ No | Create subordinate resource (calling twice creates 2 records!) |
| **DELETE** | ✅ Yes | ❌ No | Remove resource (first returns 200/204, subsequent 404; state remains deleted) |

#### Implementing Idempotent POSTs in Financial/Placement APIs
Use an \`Idempotency-Key\` HTTP header (UUID v4) stored in Redis with an atomic \`SETNX\` lock for 24 hours. If a client retries due to a timeout, the backend intercepts the key and replays the cached response without re-executing business logic!`
  },
  {
    id: 'sql-indexing',
    keywords: ['sql', 'database', 'index', 'b-tree', 'query optimization', 'join', 'postgres', 'mysql', 'composite index'],
    topic: 'SQL Database Indexing & Query Optimization',
    focusElements: ['#learningStudio'],
    content: `### 🗄️ SQL Indexing Internals (B-Trees) & High-Performance Queries

A database table without an index requires a **Full Table Scan ($O(N)$)**. A B-Tree index organizes pointers in a balanced multi-way tree providing **$O(\\log N)$** lookups.

#### Leftmost Prefix Rule for Composite Indexes
If you create an index:
\`\`\`sql
CREATE INDEX idx_student_college_dept ON students(college_id, department, cgpa);
\`\`\`

- ✅ Efficient: \`WHERE college_id = 101\`
- ✅ Efficient: \`WHERE college_id = 101 AND department = 'CSE'\`
- ✅ Efficient: \`WHERE college_id = 101 AND department = 'CSE' AND cgpa >= 8.5\`
- ❌ **CANNOT USE INDEX**: \`WHERE department = 'CSE'\` (Violates leftmost prefix rule!)

#### EXPLAIN ANALYZE Inspection
Always inspect execution plans:
- Look out for **Seq Scan** on large tables.
- Strive for **Index Scan** or **Index Only Scan** (where all requested columns are satisfied directly by the index leaf nodes).`
  },

  // ─── 4. REGIONAL KARNATAKA KEA & KCET ─────────────────────────────────
  {
    id: 'kcet-50-50-formula',
    keywords: ['kcet', 'kcet rank', '50:50', 'composite rank', 'pcm', 'kea', 'board marks', 'rank calculator'],
    topic: 'KEA KCET 50:50 Composite Rank Calculation Formula',
    focusElements: ['#karnatakaVault', '#kcetEstimatorCard'],
    content: `### 🏛️ KEA KCET 50:50 Composite Rank Calculation Formula

Karnataka Examinations Authority (KEA) computes engineering ranks through the standardized **50:50 Normalization Rule**:

$$\\text{Composite Score (\\%)} = \\left( \\frac{\\text{Board PCM Marks}}{300} \\times 50 \\right) + \\left( \\frac{\\text{KCET PCM Marks}}{180} \\times 50 \\right)$$

#### Step-by-Step Calculation Breakdown
1. **2nd PU / CBSE / ICSE Board Score**:
   - Total marks in Physics + Chemistry + Mathematics (Max = 300).
   - Divide by 300 and multiply by 50 to get Board Contribution (Max = 50.00).
2. **KCET Entrance Exam Score**:
   - Physics (60) + Chemistry (60) + Mathematics (60) (Max = 180).
   - Divide by 180 and multiply by 50 to get KCET Contribution (Max = 50.00).
3. **Composite Percentage**:
   - Sum both contributions (Max = 100.00%).

#### Historical Karnataka Rank Mapping (General Merit)
- **95.0% - 99.0%**: Rank **1 – 450** (Confirmed RVCE CSE / BMSCE CSE)
- **90.0% - 94.9%**: Rank **451 – 2,200** (MSRIT CSE, BMSCE ISE, SJCE CSE)
- **85.0% - 89.9%**: Rank **2,201 – 6,500** (PES EC Campus, UVCE CSE, NIE Mysore)
- **78.0% - 84.9%**: Rank **6,501 – 15,000** (DSCE, BIT, SMVIT, JSSATE)`
  },
  {
    id: 'snq-quota-rules',
    keywords: ['snq', 'supernumerary quota', 'fee waiver', 'kea fee', 'income certificate', '4090'],
    topic: 'SNQ (Supernumerary Quota) 5% Fee Waiver Guidelines',
    focusElements: ['#karnatakaVault', '#snqTableCard'],
    content: `### 💰 KEA SNQ (Supernumerary Quota) 5% Fee Waiver Scheme

The **Supernumerary Quota (SNQ)** is an affirmative tuition waiver created by AICTE and Karnataka Government reserving an additional **5% over-and-above seats** in every engineering branch.

#### Key Benefits & Financial Comparison
- **Regular KCET Govt Quota College Fee**: ₹1,05,000 to ₹1,15,000 per year.
- **SNQ Quota Seat Fee**: Only **₹4,090 to ₹5,500 per year** (full tuition waived)! Total 4-year savings: ₹4,00,000+.

#### Eligibility Requirements
1. **Family Annual Income**: Must be strictly below **₹8.0 Lakhs per annum** (verified via valid Tahsildar Income Certificate / RD Number).
2. **Study Certificate**: Minimum 7 years of schooling in Karnataka (1st to 12th standard).
3. **Allotment Mechanism**: Purely merit-based according to KCET rank within the SNQ category applicants for that college/branch. No separate exam needed!`
  },
  {
    id: 'dcet-lateral-entry',
    keywords: ['dcet', 'diploma', 'lateral entry', 'polytechnic', '3rd semester', 'diploma math'],
    topic: 'DCET Polytechnic Lateral Entry & Mathematics Bridge',
    focusElements: ['#karnatakaVault', '#dcetBridgeCard'],
    content: `### 📐 DCET Polytechnic Lateral Entry to 3rd Semester Engineering

Polytechnic Diploma holders transition directly into 2nd year (3rd semester) B.E./B.Tech through KEA's **DCET (Diploma Common Entrance Test)**.

#### Critical Academic Gap: Engineering Mathematics
The most common hurdle diploma students face in 3rd semester is the mandatory VTU Mathematics Bridge Course (**MATDIP301 / MATDIP401**).

#### 4 Core DCET Math Pillars to Master
1. **Matrices & Linear Systems**: Eigenvalues, Eigenvectors, Cayley-Hamilton Theorem, Rank of Matrix ($[A|B]$ row echelon form).
2. **Differential Calculus**: Partial derivatives, Euler's Theorem on homogeneous functions, Jacobians, Taylor's expansion.
3. **Integral Calculus**: Double and triple integrals, Beta and Gamma functions, Volume/Area bounded by curves.
4. **Differential Equations**: First order linear (\$\\frac{dy}{dx} + Py = Q\$), Bernoulli's equations, Higher-order constant coefficient equations.`
  },

  {
    id: 'dcet-eigenvalues',
    keywords: ['eigenvalue', 'eigenvalues', 'characteristic equation', 'cayley-hamilton', 'matrix', 'matrices', 'diagonalization', 'dcet math'],
    topic: 'DCET Applied Mathematics: Eigenvalues & Cayley-Hamilton Theorem',
    focusElements: ['#karnatakaVault', '#dcetSolverCard'],
    content: `### 📐 DCET Mathematics: Characteristic Equation & Eigenvalues

In Linear Algebra for engineering, the **Eigenvalue problem** solves for non-zero vectors $X$ such that:
$$A X = \\lambda X \\iff (A - \\lambda I) X = 0$$

For non-trivial solutions ($X \\neq 0$), the determinant of the characteristic matrix must vanish:
$$|A - \\lambda I| = 0$$

#### For a $2 \\times 2$ Matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$:
$$\\lambda^2 - \\text{Trace}(A)\\lambda + \\det(A) = 0$$
- $\\text{Trace}(A) = a + d$ (Sum of diagonal elements = Sum of Eigenvalues $\\lambda_1 + \\lambda_2$)
- $\\det(A) = ad - bc$ (Determinant = Product of Eigenvalues $\\lambda_1 \\cdot \\lambda_2$)

#### The Cayley-Hamilton Theorem:
*"Every square matrix satisfies its own characteristic equation."*
If the characteristic equation is $\\lambda^2 - S_1\\lambda + S_2 = 0$, then:
$$A^2 - S_1 A + S_2 I = 0$$
**Direct Engineering Application**: Finding matrix inverse $A^{-1}$ without computing tedious cofactors:
$$A^{-1} = \\frac{1}{S_2}(S_1 I - A)$$`
  },
  {
    id: 'article-371j',
    keywords: ['371j', '371(j)', 'kalyana karnataka', 'hyderabad karnataka', 'form-e', 'form e', 'quota advantage', 'reservation'],
    topic: 'Article 371(J) Kalyana-Karnataka Quota Multipliers & Form-E Guide',
    focusElements: ['#karnatakaVault', '#article371jCard'],
    content: `### 🏛️ Article 371(J) Kalyana-Karnataka Quota & Cutoff Dynamics

Enacted via the 98th Constitutional Amendment, **Article 371(J)** provides affirmative regional reservation across 7 Karnataka districts:
- **Eligible Districts**: Bidar, Kalaburagi, Yadgir, Raichur, Koppal, Ballari, Vijayanagara.

#### Dual Seat Quota Architecture
1. **8% Statewide Reservation**: 8% of all engineering seats across elite institutions in Bengaluru (RVCE, BMSCE, MSRIT, PESU, UVCE) are reserved exclusively for 371(J) candidates.
2. **70% Local Regional Reservation**: 70% of seats in colleges within the 7 Kalyana-Karnataka districts (PDA Kalaburagi, RYMEC Ballari, BKIT Bhalki) are reserved locally.

#### The 3.8x Competitive Rank Multiplier Advantage
Historical KEA allotment data shows that a 371(J) candidate with KCET Rank **14,500** secures admission into streams that otherwise close at **Rank 3,800** in General Merit.

#### Mandatory Document: Form-E
Must be issued by the **Assistant Commissioner (AC)** of the candidate's Revenue Sub-Division based on 10 consecutive years of study/residence in the HK region.`
  },
  {
    id: 'vtu-grading',
    keywords: ['vtu cgpa', 'sgpa', 'vtu scheme', 'vtu marks', 'grade points', 'autonomous cgpa', 'placement cutoff'],
    topic: 'VTU Grading Scheme (2021/2022) & Autonomous CGPA Formula',
    focusElements: ['#karnatakaVault', '#vtuCgpaCard'],
    content: `### 🎓 VTU SGPA & CGPA Calculation Formula (2021/2022 Scheme)

VTU computes student academic progression using the Choice-Based Credit System (CBCS):

#### 1. Semester Grade Point Average (SGPA)
$$\\text{SGPA} = \\frac{\\sum (C_i \\times G_i)}{\\sum C_i}$$
Where:
- $C_i$ = Number of credits assigned to course $i$.
- $G_i$ = Grade points secured in course $i$ (Scale 0 to 10).

#### VTU Letter Grade to Grade Point Table
| Letter Grade | Performance | Raw Marks % | Grade Points ($G_i$) |
|---|---|---|---|
| **O** | Outstanding | 90 – 100% | **10** |
| **A+** | Excellent | 80 – 89% | **9** |
| **A** | Very Good | 70 – 79% | **8** |
| **B+** | Good | 60 – 69% | **7** |
| **B** | Above Average | 55 – 59% | **6** |
| **C** | Average | 50 – 54% | **5** |
| **P** | Pass | 40 – 49% | **4** |
| **F** | Fail | < 40% | **0** |

#### Converting VTU CGPA to Percentage
$$\\text{Percentage (\\%)} = (\\text{CGPA} - 0.75) \\times 10$$
*Example: An 8.50 CGPA converts to $(8.50 - 0.75) \\times 10 = 77.5\\%$.*

#### Tier-1 Product Company Cutoff Benchmarks
- **Google / Microsoft / Amazon**: $\\ge 8.0$ CGPA (No active backlogs)
- **Cisco / Oracle / Swiggy**: $\\ge 7.5$ CGPA
- **TCS Digital / Infosys SP**: $\\ge 7.0$ CGPA`
  },

  // ─── 5. INTERVIEW READINESS & STAR METHOD ─────────────────────────────
  {
    id: 'star-interview-method',
    keywords: ['star', 'star method', 'behavioral interview', 'hr round', 'mock interview', 'interview questions'],
    topic: 'The STAR Framework for Cracking Behavioral & Tech Interviews',
    focusElements: ['#mentorshipHub', '#assessmentArena'],
    content: `### 🎯 The STAR Framework for FAANG & MNC Interviews

Behavioral and situational questions determine whether a candidate is hired after clearing the coding rounds. Use the **STAR method** to structure impactful 90-second answers:

#### The 4 STAR Stages
- **S - Situation (15s)**: Set the context briefly. State the company/project, the challenge faced, and the stakes involved.
- **T - Task (15s)**: What was *your* specific responsibility? Avoid "we"; interviewers need to know what *you* owned.
- **A - Action (45s)**: The engineering depth! What technical decisions did you make? What tools, algorithms, or refactoring did you apply? Mention trade-offs.
- **R - Result (15s)**: Quantify the business or technical outcome! *“Reduced API latency by 42%, improved test coverage from 55% to 94%, and shipped with 0 regressions.”*

#### Example Prompt: "Tell me about a time you handled a critical production bug"
- **Situation**: During a college hackathon with 400 concurrent users on CampusSearch, database requests started timing out.
- **Task**: As backend lead, I had to prevent server crashes and restore search responsiveness within 20 minutes.
- **Action**: I attached a query profiler, discovered unindexed \`LIKE '%query%'\` scans on SQLite, and replaced them with SQLite FTS5 Full-Text Search indexing plus in-memory TTL caching.
- **Result**: P95 query latency plummeted from 1,850ms to 24ms, and the platform maintained 100% uptime for the remainder of the 24-hour event.`
  }
];

/**
 * Find the most relevant pedagogical response based on message content.
 */
function findSemanticResponse(userMessage, userStage = '2nd_pu') {
  if (!userMessage || typeof userMessage !== 'string') {
    return null;
  }

  const query = userMessage.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_BANK) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore >= 3) {
    return {
      success: true,
      botReply: bestMatch.content,
      topic: bestMatch.topic,
      focusElements: bestMatch.focusElements,
      source: 'offline_semantic_engine',
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: true,
    botReply: `### 🌟 Welcome to Phoenix Horizon AI Guide!

I am your 24/7 Career & Engineering Coach. You can ask me anything about:
- **Full Stack Masterclasses**: JavaScript closures, Event Loop, React 19 hooks, REST idempotency, SQL indexing.
- **Regional Karnataka Gateway**: KCET 50:50 composite score formulas, SNQ 5% fee waiver rules, and DCET polytechnic math bridges.
- **Interview & Career Sprint**: The STAR behavioral framework, ATS resume optimization, and system design fundamentals.
- **Daily 2-3 Hour Training**: Use the active session timer above to progress through your daily concept, coding, and assessment blocks!

Try asking: *"Explain the KCET 50:50 formula"*, *"How does the Event Loop work?"*, or *"Give me a STAR interview example."*`,
    topic: 'General Guidance',
    focusElements: ['#learningStudio', '#karnatakaVault'],
    source: 'offline_semantic_engine',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  KNOWLEDGE_BANK,
  findSemanticResponse
};
