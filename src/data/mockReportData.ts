import { AccessibilityFinding } from '../types';

export const mockReportFindings: AccessibilityFinding[] = [
  {
    id: 'IT-FINDING-01',
    issueTitle: 'Primary Action Icon Button Has No Accessible Name',
    wcagCriterion: '4.1.2',
    wcagName: 'Name, Role, Value',
    wcagLevel: 'A',
    severity: 'High',
    category: 'Semantics & ARIA',
    affectedComponent: 'Global Navigation & Checkout Header (<button class="cart-btn">)',
    viewport: 'Desktop & Mobile',
    userImpact: 'Screen-reader users hear only "button" or the SVG raw path data with no indication of what the button does or what item count is active.',
    reproductionSteps: [
      'Navigate to the main application header using VoiceOver or NVDA.',
      'Press Tab to focus on the shopping cart icon button.',
      'Listen to the assistive technology announcement.'
    ],
    screenReaderTranscription: {
      technology: 'VoiceOver on macOS (Safari) / NVDA on Windows',
      expected: '"Shopping cart, 3 items, button"',
      actual: '"Unlabeled button" or "graphic button"'
    },
    codeSnippet: {
      language: 'tsx',
      bad: `<!-- ❌ Inaccessible: Icon-only button with no textual computation -->
<button onClick={openCart} className="p-2 rounded-full hover:bg-slate-100">
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4..." />
  </svg>
  <span className="badge">3</span>
</button>`,
      good: `<!-- ✅ Remediated: Accessible name with dynamic count announcement & aria-hidden on decorative SVG -->
<button 
  type="button"
  onClick={openCart}
  aria-label={\`Shopping cart with \${itemCount} items\`}
  className="p-2 rounded-full hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600"
>
  <svg aria-hidden="true" focusable="false" className="w-6 h-6" viewBox="0 0 24 24">
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4..." />
  </svg>
  <span aria-hidden="true" className="badge">{itemCount}</span>
</button>`
    },
    remediationRecommendation: 'Add an aria-label attribute with a descriptive label that dynamically updates with state. Mark the child SVG icon as aria-hidden="true" and focusable="false" to prevent Internet Explorer/WebKit SVG focus bugs.',
    validationStatus: 'Remediated & Validated'
  },
  {
    id: 'IT-FINDING-02',
    issueTitle: 'Low Contrast Secondary Metadata Text Below 4.5:1 Ratio',
    wcagCriterion: '1.4.3',
    wcagName: 'Contrast (Minimum)',
    wcagLevel: 'AA',
    severity: 'Medium',
    category: 'Color & Contrast',
    affectedComponent: 'Billing Dashboard & Transaction List (.text-slate-400)',
    viewport: 'Desktop & Mobile',
    userImpact: 'Users with low vision, age-related contrast loss, or those using devices in bright sunlight cannot read transaction timestamps and status metadata.',
    reproductionSteps: [
      'Open the Dashboard Activity stream.',
      'Inspect the timestamp labels (#94A3B8 on #FFFFFF background).',
      'Measure contrast using color picker — measured ratio is 2.82:1 (Required: 4.5:1 for standard body text).'
    ],
    screenReaderTranscription: {
      technology: 'Visual Display / High Contrast Assessment',
      expected: 'Contrast ratio >= 4.5:1 for regular text below 18pt / 14pt bold',
      actual: 'Measured ratio: 2.82:1 (#94A3B8 on #FFFFFF) — FAILS WCAG 1.4.3'
    },
    codeSnippet: {
      language: 'css',
      bad: `/* ❌ Inaccessible: Slate-400 (#94a3b8) on white fails at 2.82:1 ratio */
.transaction-timestamp {
  color: #94a3b8; /* Ratio: 2.82:1 */
  font-size: 0.875rem;
}`,
      good: `/* ✅ Remediated: Slate-600 (#475569) provides 5.74:1 ratio, comfortably exceeding 4.5:1 */
.transaction-timestamp {
  color: #475569; /* Ratio: 5.74:1 (WCAG AA Compliant) */
  font-size: 0.875rem;
  font-weight: 500;
}`
    },
    remediationRecommendation: 'Update the design token for subtle metadata text from slate-400 (#94a3b8) to slate-600 (#475569) or darker. This yields a 5.74:1 contrast ratio that complies with WCAG AA standard.',
    validationStatus: 'Remediated & Validated'
  },
  {
    id: 'IT-FINDING-03',
    issueTitle: 'Modal Dialog Fails to Trap Focus and Restore Focus on Close',
    wcagCriterion: '2.1.2',
    wcagName: 'No Keyboard Trap / Focus Management',
    wcagLevel: 'A',
    severity: 'Critical',
    category: 'Keyboard & Focus',
    affectedComponent: 'Filter Sidebar & Quick Action Modal (<div class="modal">)',
    viewport: 'Keyboard Navigation',
    userImpact: 'Keyboard-only users pressing Tab escape behind the open modal into obscured background elements, becoming completely disoriented and unable to complete checkout.',
    reproductionSteps: [
      'Open the "Filter Results" modal dialog using the keyboard (Enter key).',
      'Press Tab repeatedly through all modal controls.',
      'Notice focus moves to the background page behind the overlay instead of wrapping to the first modal control.',
      'Press ESC — the modal does not close.'
    ],
    screenReaderTranscription: {
      technology: 'JAWS 2024 / NVDA Keyboard Traversal',
      expected: 'Focus constrained inside dialog; ESC closes and restores focus to trigger button.',
      actual: 'Focus spills onto hidden main page; Screen reader reads underlying inactive table.'
    },
    codeSnippet: {
      language: 'tsx',
      bad: `<!-- ❌ Inaccessible: Plain div with no role, no focus lock, no ESC listener -->
<div className="fixed inset-0 bg-black/50">
  <div className="bg-white p-6">
    <h3>Filter Options</h3>
    <button onClick={onClose}>Close</button>
  </div>
</div>`,
      good: `<!-- ✅ Remediated: role="dialog", aria-modal="true", aria-labelledby, focus trap & ESC handler -->
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-heading"
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
  ref={dialogRef}
  className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
>
  <FocusLock returnFocus autoFocus>
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md">
      <h3 id="modal-heading" className="text-xl font-bold">Filter Options</h3>
      {/* Interactive controls */}
      <button 
        type="button" 
        onClick={onClose} 
        aria-label="Close filter dialog"
        className="focus-visible:ring-2 focus-visible:ring-teal-600"
      >
        Close
      </button>
    </div>
  </FocusLock>
</div>`
    },
    remediationRecommendation: 'Implement standard WAI-ARIA Dialog modal pattern: assign role="dialog", aria-modal="true", and aria-labelledby. Trap tab focus within the dialog bounds and listen for Escape key to close, returning focus to the opening element.',
    validationStatus: 'In Remediation'
  },
  {
    id: 'IT-FINDING-04',
    issueTitle: 'Form Inputs Lack Explicit Accessible Labels (Placeholder Only)',
    wcagCriterion: '3.3.2',
    wcagName: 'Labels or Instructions',
    wcagLevel: 'A',
    severity: 'High',
    category: 'Forms & Input',
    affectedComponent: 'User Signup & Password Reset Forms (<input type="email">)',
    viewport: 'Desktop & Mobile',
    userImpact: 'Placeholders disappear as soon as a user starts typing, leaving users with cognitive disabilities, memory constraints, or screen readers without context for required format.',
    reproductionSteps: [
      'Navigate to the signup form using a screen reader.',
      'Tab to the input field with placeholder "e.g. name@company.com".',
      'Type one character — label disappears.'
    ],
    screenReaderTranscription: {
      technology: 'TalkBack on Android Chrome',
      expected: '"Work Email, required, edit box, enter your company email address"',
      actual: '"Edit box, e.g. name@company.com" (Lost once populated)'
    },
    codeSnippet: {
      language: 'tsx',
      bad: `<!-- ❌ Inaccessible: Placeholder used as replacement for visible and accessible label -->
<input 
  type="email" 
  placeholder="Work Email (Required)" 
  className="border p-2"
/>`,
      good: `<!-- ✅ Remediated: Explicit <label> with htmlFor, visible requirement indicator, aria-describedby for errors -->
<div className="flex flex-col gap-1.5">
  <label htmlFor="work-email" className="text-sm font-semibold text-slate-900">
    Work Email <span className="text-rose-600" aria-hidden="true">*</span>
    <span className="sr-only">(Required)</span>
  </label>
  <input 
    id="work-email"
    type="email" 
    required
    aria-required="true"
    aria-describedby="email-hint"
    placeholder="name@company.com"
    className="border border-slate-300 rounded-lg p-2.5 focus-visible:ring-2 focus-visible:ring-teal-600"
  />
  <p id="email-hint" className="text-xs text-slate-500">We will never share your email address.</p>
</div>`
    },
    remediationRecommendation: 'Provide a visible <label> tag programmatically associated to the input via matching "for" / "htmlFor" and "id" attributes. Use aria-describedby for helper hints and error states.',
    validationStatus: 'Open Finding'
  }
];
