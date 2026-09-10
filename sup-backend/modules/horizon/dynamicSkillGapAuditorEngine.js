/**
 * dynamicSkillGapAuditorEngine.js
 * Feature 53: Dynamic Skill Gap & Certification Pathway Auditor
 * 
 * Provides:
 *  - Automated JD-vs-Transcript competency cross-referencing.
 *  - Calculation of JD Match Readiness % and deficit categorization.
 *  - Highest-ROI Industry Certification mapping (AWS SAA, CKA Kubernetes, GCP PCA, Terraform).
 *  - Week-by-week agile certification sprint roadmap generation.
 */

const CERTIFICATIONS_REGISTRY = [
  {
    id: 'CKA_K8S',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation (CNCF) / Linux Foundation',
    badge: '☸️',
    difficulty: 'High (Hands-On Lab Exam)',
    prepDurationWeeks: 8,
    marketDemandScore: 96,
    avgSalaryUpliftPct: 24,
    coreCompetencies: ['Kubernetes', 'Container Orchestration', 'Docker', 'Troubleshooting', 'Cluster Architecture', 'RBAC & Networking', 'Ingress Controllers'],
    weeklySprint: [
      { week: 'Weeks 1-2', focus: 'Core Architecture, API Primitives, Pod Lifecycles & Namespaces' },
      { week: 'Weeks 3-4', focus: 'Workloads, Deployments, DaemonSets, StatefulSets & Storage (PV/PVC)' },
      { week: 'Weeks 5-6', focus: 'Cluster Networking, CNI Plugins, CoreDNS & Ingress Controller Configuration' },
      { week: 'Weeks 7-8', focus: 'Killer.sh Exam Simulation, ETCD Backup/Restore & Live Cluster Troubleshooting' }
    ]
  },
  {
    id: 'AWS_SAA',
    name: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
    issuer: 'Amazon Web Services (AWS)',
    badge: '☁️',
    difficulty: 'Moderate to High',
    prepDurationWeeks: 6,
    marketDemandScore: 98,
    avgSalaryUpliftPct: 28,
    coreCompetencies: ['AWS', 'VPC & Multi-Tier Networks', 'IAM & Cloud Security', 'EC2 & Autoscaling', 'S3 Storage Classes', 'Serverless (Lambda & DynamoDB)', 'RDS High Availability'],
    weeklySprint: [
      { week: 'Weeks 1-2', focus: 'IAM Policies, Multi-AZ VPC Architecture & Compute (EC2, ECS, ASG)' },
      { week: 'Weeks 3-4', focus: 'Data Storage (S3, EFS, EBS) & Database Design (RDS Multi-AZ, DynamoDB DAX)' },
      { week: 'Weeks 5-6', focus: 'Event-Driven Architectures (SQS, SNS, EventBridge, Lambda) & 6 Full Practice Mocks' }
    ]
  },
  {
    id: 'TF_ASSOC',
    name: 'HashiCorp Certified: Terraform Associate (003)',
    issuer: 'HashiCorp',
    badge: '🧱',
    difficulty: 'Moderate',
    prepDurationWeeks: 4,
    marketDemandScore: 92,
    avgSalaryUpliftPct: 20,
    coreCompetencies: ['Terraform', 'Infrastructure as Code (IaC)', 'HCL Syntax', 'Terraform State Management', 'Modules & Workspaces', 'Cloud Provisioning'],
    weeklySprint: [
      { week: 'Week 1', focus: 'Terraform Architecture, Providers, Resource Blocks & Variables in HCL' },
      { week: 'Week 2', focus: 'Remote State Backends, State Locking (DynamoDB/S3), and State Manipulation' },
      { week: 'Week 3', focus: 'Module Decomposition, Root vs Child Modules, and Registry Integration' },
      { week: 'Week 4', focus: 'Workspaces, Security Best Practices (Sensitive Vars), and Official Mock Drills' }
    ]
  },
  {
    id: 'GCP_PCA',
    name: 'Google Cloud Certified Professional Cloud Architect',
    issuer: 'Google Cloud Platform (GCP)',
    badge: '🌐',
    difficulty: 'High (Case-Study Intensive)',
    prepDurationWeeks: 7,
    marketDemandScore: 94,
    avgSalaryUpliftPct: 30,
    coreCompetencies: ['Google Cloud', 'GKE Kubernetes Engine', 'BigQuery Analytics', 'Cloud Spanner', 'IAM Governance', 'Hybrid Cloud Anthos'],
    weeklySprint: [
      { week: 'Weeks 1-2', focus: 'GCP Organization Hierarchy, IAM Custom Roles, Shared VPC & Cloud Interconnect' },
      { week: 'Weeks 3-4', focus: 'Compute Engine, Google Kubernetes Engine (GKE Autopilot) & Cloud Run' },
      { week: 'Weeks 5-6', focus: 'Data Solutions (Cloud Spanner, Bigtable, Pub/Sub, BigQuery) & Security Perimeter' },
      { week: 'Week 7', focus: 'EHR Healthcare & Mountkirk Games Case Study Deep-Dives + Practice Exams' }
    ]
  }
];

const JOB_ARCHETYPES = [
  {
    id: 'CLOUD_DEVOPS_ENGINEER',
    title: 'Cloud DevOps & Site Reliability Engineer (SRE)',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD pipelines', 'Linux internals', 'Prometheus', 'Networking'],
    recommendedCertId: 'CKA_K8S'
  },
  {
    id: 'BACKEND_DISTRIBUTED_SWE',
    title: 'Backend Distributed Systems Engineer',
    requiredSkills: ['Go', 'Distributed Systems', 'Kafka', 'Redis', 'PostgreSQL', 'Microservices', 'Docker', 'AWS'],
    recommendedCertId: 'AWS_SAA'
  },
  {
    id: 'AI_ML_SYSTEMS_ENGINEER',
    title: 'AI/ML Platform & Infrastructure Engineer',
    requiredSkills: ['Python', 'Docker', 'Kubernetes', 'PyTorch', 'Vector DBs', 'Model Serving (Triton)', 'Cloud Architecture'],
    recommendedCertId: 'GCP_PCA'
  }
];

const PRESETS = [
  {
    id: 'undergrad_cloud_devops',
    label: 'CS Senior Targeting DevOps / SRE (Lacks K8s & Terraform)',
    studentName: 'Sanjay Krishnan',
    targetRoleId: 'CLOUD_DEVOPS_ENGINEER',
    transcriptCourses: ['Operating Systems', 'Computer Networks', 'Database Systems', 'Linux Administration'],
    existingSkills: ['Linux internals', 'Docker', 'Python', 'Git', 'CI/CD pipelines']
  },
  {
    id: 'swe_distributed_backend',
    label: 'Full-Stack Dev Pivoting to Distributed Backend (Lacks AWS & Kafka)',
    studentName: 'Meera Nambiar',
    targetRoleId: 'BACKEND_DISTRIBUTED_SWE',
    transcriptCourses: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Web Technologies'],
    existingSkills: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs']
  },
  {
    id: 'data_to_mlops',
    label: 'Data Analyst Moving to AI Platform Engineer',
    studentName: 'Vivek Chawla',
    targetRoleId: 'AI_ML_SYSTEMS_ENGINEER',
    transcriptCourses: ['Applied Statistics', 'Machine Learning Foundations', 'Database Management'],
    existingSkills: ['Python', 'SQL', 'PyTorch', 'Docker']
  }
];

class DynamicSkillGapAuditorEngine {
  getCertifications() {
    return CERTIFICATIONS_REGISTRY;
  }

  getJobArchetypes() {
    return JOB_ARCHETYPES;
  }

  getPresets() {
    return PRESETS;
  }

  /**
   * Cross-references user skills + transcript with target role requirements
   */
  auditSkillGap(params) {
    const {
      studentName = 'Candidate',
      targetRoleId = 'CLOUD_DEVOPS_ENGINEER',
      transcriptCourses = [],
      existingSkills = [],
      studentSkills = [],
      customJdText = ''
    } = params;

    const archetype = JOB_ARCHETYPES.find(a => a.id === targetRoleId) || JOB_ARCHETYPES[0];
    const targetSkills = [...archetype.requiredSkills];

    // Normalize student profile skills
    const candidateSkillPool = new Set(
      [...existingSkills, ...studentSkills, ...transcriptCourses].map(s => s.trim().toLowerCase())
    );

    const matchedStrengths = [];
    const missingDeficits = [];

    targetSkills.forEach(skill => {
      const lower = skill.toLowerCase();
      const isMatched = Array.from(candidateSkillPool).some(cs => cs.includes(lower) || lower.includes(cs));
      if (isMatched) {
        matchedStrengths.push(skill);
      } else {
        missingDeficits.push(skill);
      }
    });

    const matchRatePct = Math.round((matchedStrengths.length / targetSkills.length) * 100);

    // Map highest-ROI certification
    let recommendedCert = CERTIFICATIONS_REGISTRY.find(c => c.id === archetype.recommendedCertId) || CERTIFICATIONS_REGISTRY[0];
    
    // If specific deficit matches CKA or Terraform or AWS
    if (missingDeficits.some(d => d.toLowerCase().includes('kubernetes') || d.toLowerCase().includes('docker'))) {
      recommendedCert = CERTIFICATIONS_REGISTRY.find(c => c.id === 'CKA_K8S');
    } else if (missingDeficits.some(d => d.toLowerCase().includes('aws') || d.toLowerCase().includes('cloud'))) {
      recommendedCert = CERTIFICATIONS_REGISTRY.find(c => c.id === 'AWS_SAA');
    } else if (missingDeficits.some(d => d.toLowerCase().includes('terraform'))) {
      recommendedCert = CERTIFICATIONS_REGISTRY.find(c => c.id === 'TF_ASSOC');
    }

    return {
      studentName,
      targetRole: archetype.title,
      targetRoleId: archetype.id,
      matchRatePct,
      readinessGrade: matchRatePct >= 75 ? 'Tier-1 Immediate Fit' : (matchRatePct >= 50 ? 'Moderate Fit (Needs 1 Cert)' : 'High Gap (Requires Full Roadmap)'),
      totalRequiredSkills: targetSkills.length,
      matchedStrengths,
      missingDeficits,
      recommendedCertification: {
        id: recommendedCert.id,
        name: recommendedCert.name,
        issuer: recommendedCert.issuer,
        badge: recommendedCert.badge,
        difficulty: recommendedCert.difficulty,
        prepDurationWeeks: recommendedCert.prepDurationWeeks,
        marketDemandScore: recommendedCert.marketDemandScore,
        avgSalaryUpliftPct: recommendedCert.avgSalaryUpliftPct,
        weeklySprint: recommendedCert.weeklySprint
      },
      auditSummary: `Candidate matches ${matchedStrengths.length} of ${targetSkills.length} core competencies (${matchRatePct}%). Closing deficit in [${missingDeficits.join(', ')}] via ${recommendedCert.name} will elevate candidate into the top 10th percentile applicant pool.`
    };
  }
}

module.exports = new DynamicSkillGapAuditorEngine();
