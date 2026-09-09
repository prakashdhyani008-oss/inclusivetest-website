import { ResourceArticle } from '../types';

export const resourcesArticles: ResourceArticle[] = [
  {
    id: 'art-01',
    slug: 'why-automated-accessibility-testing-isnt-enough',
    title: "Why Automated Accessibility Testing Isn't Enough",
    category: 'Accessibility Testing',
    readTime: '6 min read',
    date: 'August 2026',
    featured: true,
    excerpt: 'Automated scanners catch at most 25% to 35% of accessibility barriers. Discover why manual testing with assistive technology is irreplaceable for genuine digital inclusion.',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Accessibility Consultant'
    },
    content: {
      introduction: 'In the race to meet accessibility benchmarks, many engineering organizations deploy automated linter plugins, browser extensions, and CI/CD pipelines. While automated tooling is an indispensable first step for catching missing image alt attributes and blatant color contrast failures, relying solely on automated scans creates a dangerous illusion of accessibility.',
      sections: [
        {
          heading: 'The Limitations of Algorithmic Heuristics',
          paragraphs: [
            'Automated testing tools inspect the DOM using static rules and CSS computed values. While they can detect if an <img> tag has an alt attribute, an algorithm cannot determine whether alt="blue background shape 2.png" accurately conveys the editorial meaning of an infographic, or whether the image should have been marked as decorative (alt="").',
            'Similarly, automated tools cannot test contextual focus management in single-page applications (SPAs), tab trap recovery, or whether an interactive widget speaks intelligible audio descriptions when navigated with a screen reader.'
          ],
          checklistItems: [
            'Automated tools verify code syntax; manual testing evaluates human comprehension.',
            'Algorithms miss dynamic state changes rendered via JavaScript after user gestures.',
            'Overlay widgets frequently create worse accessibility barriers than the ones they claim to fix.'
          ]
        },
        {
          heading: 'The 30% Coverage Reality',
          paragraphs: [
            'Industry consensus from W3C, WebAIM, and leading accessibility researchers confirms that automated testing tools can reliably detect only 25% to 35% of WCAG success criteria failures.',
            'The remaining 65% to 75% of criteria require human judgment, manual keyboard navigation, screen reader auditory verification, and cognitive clarity assessment.'
          ]
        }
      ],
      summary: 'True accessibility requires a balanced hybrid methodology: automated scans for rapid baseline regression prevention, combined with rigorous manual expert testing using real assistive technology.'
    }
  },
  {
    id: 'art-02',
    slug: '5-accessibility-issues-manual-testing-can-catch',
    title: '5 Critical Accessibility Barriers Only Manual Testing Can Catch',
    category: 'Accessibility Testing',
    readTime: '7 min read',
    date: 'July 2026',
    featured: true,
    excerpt: 'From hidden keyboard focus traps to misleading ARIA live announcements, see real-world failure modes that bypass automated scanners completely.',
    author: {
      name: 'Marcus Vance',
      role: 'Senior Assistive Tech Specialist'
    },
    content: {
      introduction: 'Automated scanners often give websites a green checkmark even when a keyboard or screen reader user cannot complete checkout. Here are five high-severity accessibility barriers that only skilled human testers can uncover.',
      sections: [
        {
          heading: '1. Misleading or Inaccurate Accessible Names',
          paragraphs: [
            'An automated scanner checks if a button has an accessible name. If a developer sets aria-label="Submit Form" on a "Delete Account" button, the scanner records a passing grade, but the assistive technology user is severely misled.'
          ]
        },
        {
          heading: '2. Modal Dialog Keyboard Traps & Escape Key Inaction',
          paragraphs: [
            'When a promotional or authentication modal appears, does focus shift inside the modal? Does pressing Tab wrap within the modal? Can the user press ESC to dismiss it? Automated tools cannot evaluate multi-step keyboard interaction sequences.'
          ]
        },
        {
          heading: '3. Meaningful Reading Order vs. Visual Flexbox/Grid Layouts',
          paragraphs: [
            'CSS flex-direction: row-reverse or CSS grid order properties can reposition items visually without changing the underlying DOM order. Keyboard and screen reader users will experience a disjointed, chaotic reading order.'
          ]
        },
        {
          heading: '4. Dynamic Live Region Silence on Async API Calls',
          paragraphs: [
            'When a user submits a form and receives an async validation error or stock availability notice, does the screen reader announce it without interrupting current focus? Without role="status" and aria-live="polite", the update goes unnoticed.'
          ]
        },
        {
          heading: '5. Custom Gesture Conflicts on Touch Screens',
          paragraphs: [
            'Carousels and maps that require complex multi-finger gestures or path-based dragging without simple single-point button alternatives fail WCAG 2.5.1 and 2.5.7, which scanners cannot test.'
          ]
        }
      ],
      summary: 'Conducting regular manual testing sessions ensures your digital experiences work in real life, not just on paper.'
    }
  },
  {
    id: 'art-03',
    slug: 'wcag-2-2-what-product-teams-should-know',
    title: 'WCAG 2.2: What Product Managers & Designers Must Know',
    category: 'WCAG',
    readTime: '8 min read',
    date: 'June 2026',
    featured: false,
    excerpt: 'An executive breakdown of the 9 new success criteria in WCAG 2.2, including Focus Appearance, Target Size Minimum, and Accessible Authentication.',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Accessibility Consultant'
    },
    content: {
      introduction: 'The Web Content Accessibility Guidelines (WCAG) 2.2 update builds upon WCAG 2.1 by introducing critical usability requirements for people with cognitive, visual, and motor disabilities.',
      sections: [
        {
          heading: 'Key Criteria Product Teams Must Implement',
          paragraphs: [
            '1. Focus Appearance (2.4.11 - Level AA): Focus indicators must have an area of at least 2px perimeter thickness and a 3:1 contrast ratio against the unfocused state.',
            '2. Target Size Minimum (2.5.8 - Level AA): Interactive targets must measure at least 24x24 CSS pixels or have adequate spacing offset.',
            '3. Accessible Authentication (3.3.8 - Level AA): Logins must not rely on cognitive function tests (such as memorizing passwords or solving puzzles) without copy-paste or password manager support.',
            '4. Redundant Entry (3.3.7 - Level A): Previously entered information in multi-step checkouts must be auto-populated or available for selection.'
          ]
        }
      ],
      summary: 'Updating your design system tokens and authentication flows to meet WCAG 2.2 safeguards future compliance and elevates usability for everyone.'
    }
  },
  {
    id: 'art-04',
    slug: 'keyboard-accessibility-what-developers-need-to-test',
    title: 'Keyboard Accessibility: The Definitive Developer Testing Protocol',
    category: 'Keyboard Accessibility',
    readTime: '6 min read',
    date: 'May 2026',
    featured: false,
    excerpt: 'A practical, repeatable keyboard testing routine for front-end engineers to verify focus visibility, logical tab order, and bypass blocks.',
    author: {
      name: 'Marcus Vance',
      role: 'Senior Assistive Tech Specialist'
    },
    content: {
      introduction: 'Keyboard accessibility is the cornerstone of web accessibility. Many assistive devices—including screen readers, switch access, and mouth sticks—rely entirely on the keyboard navigation layer.',
      sections: [
        {
          heading: 'The 4-Step Keyboard Sanity Check',
          paragraphs: [
            'Step 1: Put your mouse away. Navigate through your application using only Tab, Shift+Tab, Enter, Spacebar, and Arrow keys.',
            'Step 2: Verify that every interactive control has a clearly visible focus indicator with at least 3:1 contrast ratio.',
            'Step 3: Ensure there are no keyboard traps. If you can Tab into a widget, you must be able to Tab or ESC out.',
            'Step 4: Check for a functional Skip to Main Content link as the first focusable item on the page.'
          ]
        }
      ],
      summary: 'Embedding keyboard testing into your team’s pull request review checklist catches over 60% of critical accessibility barriers before they reach production.'
    }
  },
  {
    id: 'art-05',
    slug: 'understanding-vpat-and-accessibility-conformance-reports',
    title: 'Understanding VPAT and Accessibility Conformance Reports (ACRs)',
    category: 'VPAT / ACR',
    readTime: '9 min read',
    date: 'April 2026',
    featured: false,
    excerpt: 'How B2B SaaS companies use VPAT 2.5 reports to satisfy enterprise procurement demands and avoid sales deal friction.',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Accessibility Consultant'
    },
    content: {
      introduction: 'If your organization sells software to enterprise corporations, universities, or government bodies, you have likely received requests for a VPAT (Voluntary Product Accessibility Template).',
      sections: [
        {
          heading: 'What Is the Difference Between a VPAT and an ACR?',
          paragraphs: [
            'A VPAT is a standardized blank reporting template created by the Information Technology Industry Council (ITI).',
            'When an accessibility consulting partner like InclusiveTest evaluates your product and populates the template with evidence-based conformance findings, the completed document is called an Accessibility Conformance Report (ACR).'
          ]
        },
        {
          heading: 'The Four VPAT Editions',
          paragraphs: [
            '1. VPAT WCAG Edition: Evaluates WCAG 2.1/2.2 Level A and AA standards.',
            '2. VPAT 508 Edition: Evaluates US Federal Section 508 standards.',
            '3. VPAT EU Edition: Evaluates European Standard EN 301 549.',
            '4. VPAT INT: The comprehensive International edition incorporating all three standards.'
          ]
        }
      ],
      summary: 'An accurate, transparent ACR backed by reproducible testing gives enterprise buyers the confidence they need to sign software contracts quickly.'
    }
  },
  {
    id: 'art-06',
    slug: 'wcag-vs-en-301-549-whats-the-difference',
    title: "WCAG vs. EN 301 549: What's the Difference?",
    category: 'Strategy',
    readTime: '5 min read',
    date: 'March 2026',
    featured: false,
    excerpt: 'Navigating international accessibility standards: understanding how the European Accessibility Act maps onto W3C guidelines.',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Accessibility Consultant'
    },
    content: {
      introduction: 'With the enforcement of the European Accessibility Act (EAA), global product leaders frequently ask how EU standards compare to W3C’s WCAG.',
      sections: [
        {
          heading: 'Technical Harmonization with Distinct Scopes',
          paragraphs: [
            'EN 301 549 directly incorporates WCAG 2.1 Level AA for its web requirements (Clause 9). However, EN 301 549 is much broader in scope: it contains specific accessibility mandates for non-web software (Clause 11), telecommunications, hardware, two-way voice communication, and documentation.',
            'Meeting WCAG 2.1 AA achieves compliance for your web platform, but full EN 301 549 conformance requires evaluating cross-platform software workflows and customer support channels.'
          ]
        }
      ],
      summary: 'Understanding the relationship between global standards ensures your product meets compliance across both North American and European markets without duplicating audit efforts.'
    }
  }
];
