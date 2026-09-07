/**
 * Phoenix v16.0: Concurrency & Thread Safety Playground Controller
 * Simulates multi-threaded interleaving, Coffman deadlock detection,
 * and lock-free atomic synchronizations.
 */

const { concurrencyDeadlockEngine } = require('./concurrencyDeadlockEngine');

function getRaceConditionInterleaving(synchronized = false) {
  if (synchronized) {
    return {
      scenario: "Thread-Safe Mutex Synchronized Counter",
      synchronized: true,
      threadCount: 2,
      expectedFinalValue: 2000,
      actualFinalValue: 2000,
      hasRaceCondition: false,
      steps: [
        { step: 1, thread: "Thread 1", action: "pthread_mutex_lock(counter_mutex) -> ACQUIRED", localReg: 0, sharedMem: 0, status: "LOCKED" },
        { step: 2, thread: "Thread 1", action: "Read shared counter into local register (0)", localReg: 0, sharedMem: 0, status: "RUNNING" },
        { step: 3, thread: "Thread 2", action: "Attempt mutex lock -> BLOCKED (Waiting on Thread 1)", localReg: 0, sharedMem: 0, status: "BLOCKED" },
        { step: 4, thread: "Thread 1", action: "Increment local register: 0 + 1 = 1", localReg: 1, sharedMem: 0, status: "RUNNING" },
        { step: 5, thread: "Thread 1", action: "Write 1 to shared counter and unlock mutex", localReg: 1, sharedMem: 1, status: "UNLOCKED" },
        { step: 6, thread: "Thread 2", action: "Mutex acquired by Thread 2", localReg: 0, sharedMem: 1, status: "LOCKED" },
        { step: 7, thread: "Thread 2", action: "Read shared counter into local register (1)", localReg: 1, sharedMem: 1, status: "RUNNING" },
        { step: 8, thread: "Thread 2", action: "Increment local register: 1 + 1 = 2 and write back", localReg: 2, sharedMem: 2, status: "UNLOCKED" }
      ]
    };
  }

  return {
    scenario: "Unsynchronized Race Condition (Lost Updates)",
    synchronized: false,
    threadCount: 2,
    expectedFinalValue: 2000,
    actualFinalValue: 1432,
    hasRaceCondition: true,
    steps: [
      { step: 1, thread: "Thread 1", action: "Read shared counter into local register (val = 0)", localReg: 0, sharedMem: 0, status: "RUNNING" },
      { step: 2, thread: "Thread 2", action: "Preempts Thread 1! Reads shared counter (val = 0)", localReg: 0, sharedMem: 0, status: "RUNNING" },
      { step: 3, thread: "Thread 1", action: "Increment local register: 0 + 1 = 1", localReg: 1, sharedMem: 0, status: "RUNNING" },
      { step: 4, thread: "Thread 2", action: "Increment local register: 0 + 1 = 1", localReg: 1, sharedMem: 0, status: "RUNNING" },
      { step: 5, thread: "Thread 1", action: "Writes 1 to shared counter", localReg: 1, sharedMem: 1, status: "WRITE" },
      { step: 6, thread: "Thread 2", action: "Overwrites shared counter with 1! LOST UPDATE HAZARD!", localReg: 1, sharedMem: 1, status: "LOST_UPDATE" }
    ]
  };
}

function getDeadlockInterleaving(lockOrdered = false) {
  if (lockOrdered) {
    return {
      scenario: "Global Lock Ordering (Hierarchical Acquisition)",
      lockOrdered: true,
      hasDeadlock: false,
      safetyScore: 98,
      steps: [
        { step: 1, thread: "Thread 1 (Tx 1)", action: "Lock min(A, B) -> Acquired Lock A", held: ["Lock A"], waiting: null, status: "ACQUIRED" },
        { step: 2, thread: "Thread 2 (Tx 2)", action: "Lock min(A, B) -> Attempts Lock A -> BLOCKED (Wait)", held: [], waiting: "Lock A", status: "WAITING" },
        { step: 3, thread: "Thread 1 (Tx 1)", action: "Lock max(A, B) -> Acquired Lock B. Completes Tx.", held: ["Lock A", "Lock B"], waiting: null, status: "COMMITTED" },
        { step: 4, thread: "Thread 1 (Tx 1)", action: "Release Lock A & Lock B", held: [], waiting: null, status: "RELEASED" },
        { step: 5, thread: "Thread 2 (Tx 2)", action: "Unblocked! Acquires Lock A then Lock B cleanly.", held: ["Lock A", "Lock B"], waiting: null, status: "COMMITTED" }
      ]
    };
  }

  return {
    scenario: "Circular Wait Deadlock (Coffman Condition)",
    lockOrdered: false,
    hasDeadlock: true,
    safetyScore: 25,
    steps: [
      { step: 1, thread: "Thread 1 (Tx 1)", action: "Acquires Lock A for Account 1", held: ["Lock A"], waiting: null, status: "ACQUIRED" },
      { step: 2, thread: "Thread 2 (Tx 2)", action: "Acquires Lock B for Account 2", held: ["Lock B"], waiting: null, status: "ACQUIRED" },
      { step: 3, thread: "Thread 1 (Tx 1)", action: "Requests Lock B -> BLOCKED (Held by Thread 2)", held: ["Lock A"], waiting: "Lock B", status: "BLOCKED" },
      { step: 4, thread: "Thread 2 (Tx 2)", action: "Requests Lock A -> BLOCKED (Held by Thread 1)", held: ["Lock B"], waiting: "Lock A", status: "BLOCKED" },
      { step: 5, thread: "OS Monitor", action: "CYCLE DETECTED: Thread 1 -> Lock B -> Thread 2 -> Lock A -> Thread 1. SYSTEM HANG!", held: ["Lock A", "Lock B"], waiting: "DEADLOCK", status: "DEADLOCKED" }
    ]
  };
}

const simulateConcurrency = (req, res) => {
  try {
    const { scenario = 'race', synchronized = false, lockOrdered = false } = req.body;

    if (scenario === 'deadlock') {
      const data = getDeadlockInterleaving(lockOrdered);
      const audit = concurrencyDeadlockEngine.analyzeDeadlock({
        concurrencyPattern: lockOrdered ? 'Hierarchical Lock Order' : 'Unordered Dual Mutex',
        threadCount: 2
      });
      return res.json({ ...data, audit });
    }

    // Default: race condition
    const data = getRaceConditionInterleaving(synchronized);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { simulateConcurrency };
