/**
 * Phoenix Astra Cognitive War Room - Feature 68 Engine
 * Automated System Design Whiteboard Topology & Hardware Capacity Sizer
 *
 * Implements:
 * 1. Back-of-the-envelope hardware capacity calculations (DAU, Peak QPS, Bandwidth, Pareto Cache, 5-Year Storage)
 * 2. System topology graph model (Load Balancer, API Gateways, Redis Cluster, Kafka, Sharded DB, S3)
 * 3. Bottleneck & Single Point of Failure (SPOF) detection
 * 4. Staff Bar Raiser capacity rubric evaluation
 */

class SystemDesignSizerEngine {
  constructor() {}

  getArchetypes() {
    return [
      {
        id: 'youtube-streaming',
        title: 'Global Video Streaming Pipeline (YouTube Class)',
        dau: 2000000000, // 2 Billion DAU
        readRatio: 99,
        writeRatio: 1,
        avgPayloadKb: 15000, // 15MB average video chunk
        writePayloadKb: 250000, // 250MB video upload
        retentionDays: 1825, // 5 years
        replicationFactor: 3,
        description: 'Ultra high-bandwidth, read-intensive media streaming architecture requiring tiered CDNs, distributed chunk transcoders, and cold object storage tiers.'
      },
      {
        id: 'twitter-timeline-fanout',
        title: 'Real-Time Social Feed & Timeline Fan-Out (X/Twitter Class)',
        dau: 350000000, // 350M DAU
        readRatio: 90,
        writeRatio: 10,
        avgPayloadKb: 8, // 8KB tweet with metadata
        writePayloadKb: 12,
        retentionDays: 3650, // 10 years
        replicationFactor: 3,
        description: 'High-fanout write pipeline where celebrity posts trigger millions of in-memory timeline cache updates; uses hybrid push-pull feed generation.'
      },
      {
        id: 'uber-geospatial-dispatch',
        title: 'Real-Time Geospatial Driver Dispatch (Uber Class)',
        dau: 150000000, // 150M DAU
        readRatio: 70,
        writeRatio: 30, // Frequent driver GPS pings every 4 seconds
        avgPayloadKb: 2, // 2KB location packet
        writePayloadKb: 2,
        retentionDays: 90, // Hot geospatial telemetry kept 90 days
        replicationFactor: 3,
        description: 'Heavy write-intensive geospatial indexing cluster utilizing Uber H3 hexagonal hierarchical spatial index and in-memory geo-shards.'
      },
      {
        id: 'global-payment-gateway',
        title: 'Zero-Data-Loss Financial Ledger (Stripe Class)',
        dau: 50000000,
        readRatio: 50,
        writeRatio: 50,
        avgPayloadKb: 4,
        writePayloadKb: 4,
        retentionDays: 2555, // 7 years financial compliance
        replicationFactor: 5, // High multi-region quorum
        description: 'Strict ACID linearizable transaction processor requiring synchronous multi-region replication, idempotent tokenization, and zero data loss.'
      }
    ];
  }

  calculateCapacity(params) {
    const {
      dau = 100000000,
      readRatio = 90,
      writeRatio = 10,
      avgPayloadKb = 10,
      writePayloadKb = 50,
      retentionDays = 1825,
      replicationFactor = 3
    } = params;

    const SECONDS_PER_DAY = 86400;

    // Daily actions per active user (assumed avg 15 actions/day)
    const avgActionsPerDau = 15;
    const totalDailyRequests = dau * avgActionsPerDau;

    // QPS Calculations
    const avgQps = Math.round(totalDailyRequests / SECONDS_PER_DAY);
    const peakQps = Math.round(avgQps * 2.8); // 2.8x standard peak multiplier

    const readQps = Math.round((avgQps * readRatio) / 100);
    const writeQps = Math.round((avgQps * writeRatio) / 100);

    // Bandwidth Calculations
    const ingressBytesPerSec = writeQps * writePayloadKb * 1024;
    const egressBytesPerSec = readQps * avgPayloadKb * 1024;

    const ingressMbps = ((ingressBytesPerSec * 8) / (1024 * 1024)).toFixed(1);
    const egressMbps = ((egressBytesPerSec * 8) / (1024 * 1024)).toFixed(1);

    const ingressGbps = (ingressMbps / 1000).toFixed(2);
    const egressGbps = (egressMbps / 1000).toFixed(2);

    // Storage Calculations
    const dailyRawStorageBytes = writeQps * SECONDS_PER_DAY * writePayloadKb * 1024;
    const dailyRawStorageTb = (dailyRawStorageBytes / (1024 ** 4)).toFixed(2);
    
    // 5-Year Storage with Replication & 20% metadata index overhead
    const totalStorageTbRaw = dailyRawStorageTb * (retentionDays || 1825);
    const totalStorageWithReplicationTb = Math.round(totalStorageTbRaw * replicationFactor * 1.2);
    const totalStoragePb = (totalStorageWithReplicationTb / 1024).toFixed(2);

    // Cache Memory (Pareto 80/20 Rule)
    // 20% of daily read data cached in RAM
    const dailyReadVolumeBytes = totalDailyRequests * (readRatio / 100) * avgPayloadKb * 1024;
    const paretoCache20Bytes = dailyReadVolumeBytes * 0.20;
    const ramCacheTb = (paretoCache20Bytes / (1024 ** 4)).toFixed(2);
    const ramCacheGb = Math.round((paretoCache20Bytes / (1024 ** 3)));

    // Cluster Sizing
    // Standard c6i.4xlarge (16 vCPU, 32GB RAM, handles ~4,000 QPS)
    const apiGatewayInstances = Math.max(2, Math.ceil(peakQps / 4000));
    
    // Redis nodes (r6g.2xlarge with 52GB usable RAM per node, 2x for replica failover)
    const redisNodes = Math.max(3, Math.ceil((ramCacheGb / 52) * 2));

    // Database Primary-Replica Shards (1 primary handles ~2,500 write QPS)
    const dbShards = Math.max(2, Math.ceil(writeQps / 2500));

    // Bottlenecks & Architecture Audit
    const bottlenecks = [];
    if (parseFloat(egressGbps) > 100) {
      bottlenecks.push({
        component: 'Edge Egress Network',
        severity: 'CRITICAL',
        issue: `Egress bandwidth (${egressGbps} Gbps) exceeds single datacenter transit capacity.`,
        recommendation: 'Offload ≥95% of egress traffic to globally distributed Anycast CDNs (Cloudflare / Fastly) with origin shielding.'
      });
    }

    if (ramCacheGb > 1000) {
      bottlenecks.push({
        component: 'In-Memory Cache Cluster',
        severity: 'HIGH',
        issue: `Working set RAM (${ramCacheTb} TB) requires a large ${redisNodes}-node cluster with risk of thundering herd.`,
        recommendation: 'Implement consistent hashing with virtual nodes and two-tier caching (L1 local cache + L2 Redis cluster).'
      });
    }

    if (writeQps > 10000) {
      bottlenecks.push({
        component: 'Database Write Scalability',
        severity: 'HIGH',
        issue: `Write load (${writeQps.toLocaleString()} QPS) overwhelms single relational database instances.`,
        recommendation: 'Partition tables using range or hash sharding key; decouple ingestion with Kafka log buffer.'
      });
    }

    return {
      inputs: {
        dau,
        readRatio,
        writeRatio,
        avgPayloadKb,
        writePayloadKb,
        retentionDays,
        replicationFactor
      },
      trafficMetrics: {
        totalDailyRequests,
        avgQps,
        peakQps,
        readQps,
        writeQps
      },
      bandwidthMetrics: {
        ingressMbps: parseFloat(ingressMbps),
        egressMbps: parseFloat(egressMbps),
        ingressGbps: parseFloat(ingressGbps),
        egressGbps: parseFloat(egressGbps)
      },
      storageMetrics: {
        dailyRawStorageTb: parseFloat(dailyRawStorageTb),
        totalStoragePb: parseFloat(totalStoragePb),
        totalStorageTb: totalStorageWithReplicationTb
      },
      cacheMetrics: {
        ramCacheGb,
        ramCacheTb: parseFloat(ramCacheTb),
        rule: 'Pareto 80/20 (20% of daily read working set stored in Redis)'
      },
      clusterSizing: {
        apiGatewayInstances,
        redisNodes,
        dbShards,
        estimatedMonthlyAwsUsd: Math.round(
          (apiGatewayInstances * 180) + 
          (redisNodes * 320) + 
          (dbShards * 650) + 
          (totalStorageWithReplicationTb * 22) + 
          (parseFloat(egressGbps) * 450)
        )
      },
      bottlenecks,
      topologyComponents: [
        { name: 'DNS / Anycast CDN', role: 'Edge Caching & DDoS Mitigation', scale: 'Global Edge (PoPs)' },
        { name: 'Envoy L7 Load Balancer', role: 'TLS Termination & Path Routing', scale: 'Auto-scaled' },
        { name: 'Stateless API Gateways', role: 'Business Logic & JWT Validation', scale: `${apiGatewayInstances} Instances` },
        { name: 'Redis Cache Cluster', role: 'Pareto L2 In-Memory Store', scale: `${redisNodes} Nodes (${ramCacheGb} GB RAM)` },
        { name: 'Kafka Event Bus', role: 'Asynchronous Ingestion & Buffering', scale: 'Partitioned Topic Mesh' },
        { name: 'Distributed Primary-Replica DB', role: 'Transactional State', scale: `${dbShards} Active Shards` },
        { name: 'S3 / MinIO Object Store', role: 'Cold Media & Blob Storage', scale: `${totalStoragePb} PB (5-Yr Retention)` }
      ],
      staffBarRaiserRubric: {
        dimension1: 'Quantitative Back-of-the-Envelope Rigor',
        dimension2: 'Identification of Critical Chokepoints (Network vs RAM vs Disk)',
        dimension3: 'Trade-off Articulation (Eventual vs Strong Consistency, Write vs Read Fan-Out)',
        verdict: bottlenecks.length === 0 ? 'STRONG_PASS (Staff+ Level)' : 'PASS_WITH_TACTICAL_MITIGATIONS (Senior/Staff Level)'
      }
    };
  }
}

module.exports = new SystemDesignSizerEngine();
