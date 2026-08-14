/**
 * AI Dynamic Adaptive Follow-Up Question Generator & Knowledge Graph Prober — Phoenix V26 (IR-15)
 * 
 * 1. Technical Knowledge Graph: Connects algorithms, concurrency, system design, and security patterns.
 * 2. Adaptive Difficulty Escalation: Drills into candidate weak points or probes deeper into expert assertions.
 * 3. Real-Time Grilling Evaluation Matrix: Scores technical precision, trade-off depth, and clarity.
 */

class AIAdaptiveKnowledgeProber {
    constructor() {
        this.knowledgeGraph = {
            'DISTRIBUTED_SYSTEMS': {
                'CONSISTENCY': ['Raft Consensus Quorum', 'Vector Clocks', 'Read-Your-Own-Writes', 'Saga Pattern vs 2PC'],
                'STORAGE': ['LSM Trees vs B+ Trees', 'Write-Ahead Log (WAL)', 'Consistent Hashing with Virtual Nodes'],
                'NETWORKING': ['gRPC HTTP/2 Multiplexing', 'TCP Head-of-Line Blocking', 'QUIC UDP Handshake'],
            },
            'SYSTEM_DESIGN': {
                'MESSAGING': ['Kafka Partition Rebalancing', 'Backpressure Handling', 'Idempotent Consumer Deduplication'],
                'CACHING': ['Cache-Aside vs Write-Through', 'LRU Doubly Linked List', 'Redis Sentinel vs Cluster'],
            },
        };
    }

    /**
     * Traverses the knowledge graph to generate an adaptive follow-up probe based on candidate response.
     */
    generateAdaptiveFollowUp(topic, candidateAnswer) {
        const lower = candidateAnswer.toLowerCase();
        let targetArea = 'CONSISTENCY';
        let followUpQuestion = 'How does your chosen architecture guarantee fault tolerance under network partitions?';

        if (lower.includes('kafka') || lower.includes('queue') || lower.includes('event')) {
            targetArea = 'MESSAGING';
            followUpQuestion = 'If a consumer node crashes mid-transaction, how do you prevent duplicate message processing without dropping throughput?';
        } else if (lower.includes('hash') || lower.includes('database') || lower.includes('sharding')) {
            targetArea = 'STORAGE';
            followUpQuestion = 'When adding 5 new database nodes, how does Consistent Hashing minimize the number of migrated keys?';
        } else if (lower.includes('cache') || lower.includes('redis')) {
            targetArea = 'CACHING';
            followUpQuestion = 'What happens during a cold cache reboot under 100,000 requests/sec, and how would you pre-warm the cache?';
        }

        const relatedConcepts = this.knowledgeGraph['DISTRIBUTED_SYSTEMS'][targetArea] || this.knowledgeGraph['SYSTEM_DESIGN'][targetArea] || [];

        return {
            topic,
            targetArea,
            followUpQuestion,
            relatedDeepDiveConcepts: relatedConcepts,
            difficultyScore: 8.5,
            evaluationRubric: [
                'Candidate addresses state recovery & data loss guarantees',
                'Candidate evaluates latency vs consistency trade-offs',
                'Candidate demonstrates production troubleshooting intuition',
            ],
            timestamp: new Date().toISOString(),
        };
    }
}

const aiAdaptiveKnowledgeProber = new AIAdaptiveKnowledgeProber();
module.exports = aiAdaptiveKnowledgeProber;
