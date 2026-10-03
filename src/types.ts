export type PageView = 'home' | 'services' | 'audits' | 'remediation' | 'vpat' | 'legal' | 'about' | 'resources' | 'contact' | 'report-preview';

export type ServiceType = 
  | 'Accessibility Audit'
  | 'Remediation Support'
  | 'VPAT / ACR'
  | 'Accessibility Consulting'
  | 'Legal Accessibility Guidance'
  | 'Ongoing Accessibility Testing'
  | 'Agency Partnership';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  badge: string;
  includes: string[];
  outcomes: string[];
  methodology: string[];
  assistiveTech: string[];
  standardsCovered: string[];
  ctaLabel: string;
}

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type RemediationStatus = 'Open Finding' | 'In Remediation' | 'Remediated & Validated';

export interface AccessibilityFinding {
  id: string;
  issueTitle: string;
  wcagCriterion: string;
  wcagName: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  severity: SeverityLevel;
  userImpact: string;
  affectedComponent: string;
  viewport: 'Desktop & Mobile' | 'Desktop' | 'Mobile Screen Reader' | 'Keyboard Navigation';
  reproductionSteps: string[];
  screenReaderTranscription: {
    technology: string;
    expected: string;
    actual: string;
  };
  codeSnippet: {
    bad: string;
    good: string;
    language: string;
  };
  remediationRecommendation: string;
  validationStatus: RemediationStatus;
  category: 'Semantics & ARIA' | 'Color & Contrast' | 'Keyboard & Focus' | 'Forms & Input' | 'Structure';
}

export interface ConsultationBookingState {
  date: string;
  time: string;
  timezone: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  url: string;
  serviceNeeded: ServiceType;
  projectScope: string;
  message: string;
  confirmed: boolean;
  bookingRef?: string;
  meetLink?: string;
}

export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  category: 'WCAG' | 'Accessibility Testing' | 'Screen Readers' | 'Keyboard Accessibility' | 'ARIA' | 'Strategy' | 'VPAT / ACR';
  readTime: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
  };
  featured?: boolean;
  content: {
    introduction: string;
    sections: {
      heading: string;
      paragraphs: string[];
      codeExample?: {
        title: string;
        code: string;
      };
      checklistItems?: string[];
    }[];
    summary: string;
  };
}

export interface AccessibilityStandard {
  id: string;
  code: string;
  title: string;
  jurisdiction: string;
  applicability: string;
  summary: string;
  wcagMapping: string;
  legalContext: string;
}

export interface TargetAudiencePersona {
  role: string;
  context: string;
  keyChallenge: string;
  inclusiveTestSolution: string;
  businessImpact: string;
}
