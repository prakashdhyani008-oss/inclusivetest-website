import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'audits',
    slug: 'accessibility-audits',
    title: 'Accessibility Audits',
    badge: 'Comprehensive Diagnostic',
    tagline: 'Identify accessibility barriers before they impact your users.',
    shortDescription: 'Comprehensive manual and automated accessibility assessments across web apps, mobile platforms, and digital ecosystems using real assistive technologies.',
    fullDescription: 'Our accessibility audits combine rigorous automated scanning with deep manual testing performed by certified accessibility specialists. We evaluate your entire digital product against WCAG 2.1 and WCAG 2.2 AA standards, testing with real screen readers, keyboard navigation, and custom assistive configurations.',
    includes: [
      'Comprehensive WCAG 2.1 & 2.2 AA / AAA assessments',
      'Expert manual testing covering 100% of interactive user journeys',
      'Automated baseline scans with rule-specific verification',
      'Keyboard-only navigation, focus order & trap analysis',
      'Multi-screen reader evaluations (NVDA, JAWS, VoiceOver, TalkBack)',
      'Mobile web and native iOS/Android accessibility evaluation',
      'Severity and user impact prioritization matrix',
      'WCAG criterion mapping with granular failure criteria'
    ],
    outcomes: [
      'Zero false-positive reporting with clear reproduction steps',
      'Prioritized backlog items ready for Jira, GitHub, or Azure DevOps',
      'Executive conformance summary for leadership & compliance teams',
      'Technical sprint-ready findings for engineering teams'
    ],
    methodology: [
      'Automated Rule Scanning for baseline attributes and structure',
      'Complete Manual Keyboard & Focus Management Path Tracing',
      'Assistive Technology Verification across desktop & mobile matrix',
      'Dynamic State & Single Page Application (SPA) DOM Mutation Inspection',
      'Color Contrast & Visual Reflow (400% zoom) Geometry Analysis'
    ],
    assistiveTech: ['NVDA (Windows)', 'JAWS (Windows)', 'VoiceOver (macOS / iOS)', 'TalkBack (Android)', 'Dragon NaturallySpeaking', 'ZoomText'],
    standardsCovered: ['WCAG 2.1 Level A/AA', 'WCAG 2.2 Level A/AA', 'Section 508 (US Federal)', 'EN 301 549 (EU Mandate)'],
    ctaLabel: 'Learn About Accessibility Audits'
  },
  {
    id: 'remediation',
    slug: 'remediation-support',
    title: 'Remediation Support',
    badge: 'Engineering Enablement',
    tagline: 'Turn accessibility findings into practical, verified fixes.',
    shortDescription: 'Hands-on technical guidance, code-level recommendations, and pairing with your development teams to resolve accessibility barriers efficiently.',
    fullDescription: 'An audit report is only as valuable as your team’s ability to fix the issues. Our remediation support bridges the gap between compliance requirements and front-end engineering. We provide copy-pasteable accessible code patterns, architectural ARIA guidance, and direct developer pairing to accelerate remediation sprints.',
    includes: [
      'Developer-friendly remediation guidance with framework-specific patterns',
      'Production-ready code recommendations (React, Vue, Angular, Next.js, HTML/CSS)',
      'ARIA attribute architecture & state synchronization guidance',
      'Semantic HTML structure & headless component consultation',
      'Focus management algorithms for complex modals, drawers & SPAs',
      'Design system accessibility reviews & token guidance',
      'Fix validation and iterative re-testing sessions'
    ],
    outcomes: [
      'Reduced engineering friction and zero guesswork for developers',
      'Prevention of architectural regression in future releases',
      'Accelerated time-to-remediation by up to 3x',
      'Upskilled internal engineering and QA teams'
    ],
    methodology: [
      'Remediation Backlog Triage & Sprint Planning Alignment',
      'Technical Code Pattern Formulation for Design System Components',
      'Collaborative Developer Pairing and Code Reviews (PR Reviews)',
      'Live Validation & Re-verification of Deployed Fixes'
    ],
    assistiveTech: ['Chrome DevTools Accessibility Tree', 'Screen Reader Simulation', 'Accessibility Object Model (AOM)', 'Keyboard Focus Trap Validators'],
    standardsCovered: ['WAI-ARIA 1.2 Authoring Practices', 'WCAG 2.1 / 2.2 AA Techniques', 'HTML5 Semantic Standard'],
    ctaLabel: 'Explore Remediation Support'
  },
  {
    id: 'vpat',
    slug: 'vpat-acr',
    title: 'VPAT / Accessibility Conformance Reporting',
    badge: 'Enterprise Procurement & Governance',
    tagline: 'Clearly communicate your product’s accessibility conformance.',
    shortDescription: 'Authoritative, evidence-based Voluntary Product Accessibility Templates (VPAT) and Accessibility Conformance Reports (ACR) for enterprise procurement.',
    fullDescription: 'Enterprise and public sector buyers require verified Accessibility Conformance Reports before approving software purchases. InclusiveTest conducts rigorous evaluations and produces industry-standard ACRs (utilizing the latest VPAT edition) backed by reproducible technical evidence.',
    includes: [
      'Structured technical accessibility conformance assessment',
      'VPAT 2.5 edition authoring (WCAG, Section 508, or EU EN 301 549 editions)',
      'Granular evaluation of all applicable WCAG Level A and AA criteria',
      'Evidence-based reporting with specific product feature documentation',
      'Remarks and explanation drafting for "Supports", "Partially Supports", and "Not Supported"',
      'Documentation updates for product release cycles and minor versions'
    ],
    outcomes: [
      'Credible, transparent ACR documentation for procurement security reviews',
      'Elimination of deal stalls in enterprise sales cycles',
      'Objective benchmark for product roadmaps and future accessibility milestones'
    ],
    methodology: [
      'Representative Sample Scope Definition (Core workflows & views)',
      'Criterion-by-Criterion Conformance Testing',
      'Formal Statement Drafting in conformance with ITI VPAT guidelines',
      'Final Legal/Technical Verification & Signature Release'
    ],
    assistiveTech: ['VoiceOver', 'NVDA', 'JAWS', 'High Contrast OS Themes'],
    standardsCovered: ['VPAT 2.5 WCAG Edition', 'VPAT 2.5 508 Edition', 'VPAT 2.5 EU Edition (EN 301 549)', 'VPAT 2.5 INT (International)'],
    ctaLabel: 'Learn About VPAT Services'
  },
  {
    id: 'legal',
    slug: 'legal-guidance',
    title: 'Legal Accessibility Guidance',
    badge: 'Risk Mitigation & Prioritization',
    tagline: 'Understand your accessibility responsibilities and prioritize technical risk reduction.',
    shortDescription: 'Technical accessibility analysis and priority roadmapping to help organizations navigate regulatory requirements, demand letters, and settlement frameworks.',
    fullDescription: 'Navigating accessibility regulations requires technical clarity. InclusiveTest provides objective, technical assessments to help leadership and corporate counsel understand digital accessibility realities, prioritize high-risk barriers, and establish defensible remediation timelines.',
    includes: [
      'Technical assessment of digital assets referenced in regulatory inquiries',
      'Critical user journey barrier identification and prioritization',
      'Remediation roadmap drafting with defensible milestone timelines',
      'Objective technical documentation of accessibility progress over time',
      'Accessibility statement drafting & digital feedback mechanism setup',
      'Third-party vendor and widget risk evaluation'
    ],
    outcomes: [
      'Actionable clarity on technical accessibility obligations',
      'Prioritized remediation backlog focused on high-impact barriers',
      'Verifiable trail of continuous accessibility improvement'
    ],
    methodology: [
      'Baseline Risk Diagnostic of Public-Facing Customer Journeys',
      'Technical Gap Analysis against Relevant Standards',
      'Remediation Phasing and Feasibility Blueprinting',
      'Ongoing Conformance Tracking and Milestone Attestation'
    ],
    assistiveTech: ['Full Assistive Suite Across Desktop and Mobile'],
    standardsCovered: ['ADA Title III Technical Frameworks', 'Section 508 Standards', 'European Accessibility Act (EAA)', 'Unruh Civil Rights Act Standards'],
    ctaLabel: 'Discuss Your Accessibility Requirements'
  }
];
