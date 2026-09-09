import { AccessibilityStandard } from '../types';

export const standardsData: AccessibilityStandard[] = [
  {
    id: 'wcag-22',
    code: 'WCAG 2.2',
    title: 'Web Content Accessibility Guidelines 2.2',
    jurisdiction: 'Global Standard (W3C / WAI)',
    applicability: 'Web Applications, Single Page Apps, Digital Documents, Component Libraries',
    summary: 'The modern gold-standard benchmark published by W3C, introducing 9 new success criteria including focus appearance (2.4.11), target size minimum (2.5.8), dragging movements (2.5.7), and accessible authentication (3.3.8).',
    wcagMapping: 'Level A, AA, AAA Criteria Structure',
    legalContext: 'Serves as the foundational technical benchmark referenced by federal, regional, and international accessibility laws worldwide.'
  },
  {
    id: 'wcag-21',
    code: 'WCAG 2.1',
    title: 'Web Content Accessibility Guidelines 2.1',
    jurisdiction: 'International Web Standard',
    applicability: 'Mobile Viewports, Touch Interfaces, Orientation & Reflow',
    summary: 'Expanded earlier guidelines with 17 critical criteria specifically addressing mobile web, touch target gestures, reflow at 400% zoom, non-text contrast (1.4.11), and text spacing.',
    wcagMapping: 'Level A & AA Core Conformance',
    legalContext: 'Currently referenced as the compliance target in many federal settlements and enterprise procurement specifications.'
  },
  {
    id: 'section-508',
    code: 'Section 508',
    title: 'Rehabilitation Act Section 508',
    jurisdiction: 'United States Federal Agencies & Federal Contractors',
    applicability: 'Electronic & Information Technology (EIT), Federal Portals, Enterprise Software Sold to U.S. Government',
    summary: 'Federal procurement regulation requiring US federal agencies and their technology vendors to procure, develop, and maintain accessible software, hardware, and digital documentation.',
    wcagMapping: 'Incorporates WCAG 2.0 Level AA by reference for web and non-web software',
    legalContext: 'Mandatory requirement for VPAT / ACR documentation when bidding on US federal and state government contracts.'
  },
  {
    id: 'en-301-549',
    code: 'EN 301 549',
    title: 'European Standard EN 301 549',
    jurisdiction: 'European Union & European Accessibility Act (EAA)',
    applicability: 'Public Sector Digital Services, E-commerce, Banking, Transport, SaaS sold in EU',
    summary: 'The harmonized European standard for ICT accessibility, setting binding technical requirements for public sector websites/apps and commercial digital products under the European Accessibility Act.',
    wcagMapping: 'Harmonized directly with WCAG 2.1 Level AA with additional ICT clauses for non-web software',
    legalContext: 'Enforceable legal standard across all 27 EU member states with significant compliance deadlines under the EAA.'
  }
];

export const standardsDistinctionNote = {
  headline: 'Understanding Standards vs. Laws',
  explanation: 'While WCAG provides the technical guidelines, regulations like ADA Title III, Section 508, and the European Accessibility Act (EN 301 549) reference these technical standards within distinct legal jurisdictions. The applicable benchmark depends on your product distribution, corporate headquarters, target users, and procurement contracts.'
};
