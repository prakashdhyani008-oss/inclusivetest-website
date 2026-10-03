import React, { useState, useEffect, useRef } from 'react';
import { 
  mockReportFindings 
} from '../data/mockReportData';
import { AccessibilityFinding, SeverityLevel, RemediationStatus } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Code, 
  Volume2, 
  ListOrdered, 
  Wrench, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  CheckCheck,
  Search
} from 'lucide-react';

interface InteractiveReportViewerProps {
  onOpenConsultation?: (trigger?: React.MouseEvent | HTMLElement) => void;
}

export const InteractiveReportViewer: React.FC<InteractiveReportViewerProps> = ({ onOpenConsultation }) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(mockReportFindings[0].id);
  const [activeTab, setActiveTab] = useState<'code' | 'audio' | 'steps' | 'recommendation'>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [findingsState, setFindingsState] = useState<AccessibilityFinding[]>(mockReportFindings);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const hasMountedRef = useRef(false);

  const activeFinding = findingsState.find(f => f.id === selectedFindingId) || findingsState[0];

  const handleSelectFinding = (finding: AccessibilityFinding) => {
    setSelectedFindingId(finding.id);
    setLiveAnnouncement(`Selected finding ${finding.id}: ${finding.issueTitle}, ${finding.severity} severity.`);
  };

  const handleSelectTab = (tabId: 'code' | 'audio' | 'steps' | 'recommendation', label: string) => {
    setActiveTab(tabId);
    setLiveAnnouncement(`Showing ${label} for finding ${activeFinding.id}.`);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setLiveAnnouncement('Remediated fix code copied to clipboard.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStatusToggle = (findingId: string) => {
    setFindingsState(prev => prev.map(f => {
      if (f.id === findingId) {
        const nextStatus: RemediationStatus = 
          f.validationStatus === 'Open Finding' ? 'In Remediation' :
          f.validationStatus === 'In Remediation' ? 'Remediated & Validated' : 'Open Finding';
        setLiveAnnouncement(`Simulated status for ${f.id} changed to ${nextStatus}.`);
        return { ...f, validationStatus: nextStatus };
      }
      return f;
    }));
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: RemediationStatus) => {
    switch (status) {
      case 'Remediated & Validated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Remediated & Validated</span>
          </span>
        );
      case 'In Remediation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>In Remediation</span>
          </span>
        );
      case 'Open Finding':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Finding</span>
          </span>
        );
    }
  };

  const filteredFindings = findingsState.filter(f => {
    const matchesStatus = activeStatusFilter === 'all' || f.validationStatus === activeStatusFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      f.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.wcagCriterion.includes(searchQuery) ||
      f.wcagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.affectedComponent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Announce search and filter updates to assistive technology (WCAG 4.1.3)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const count = filteredFindings.length;
    const resultText = count === 1 ? '1 result found' : `${count} results found`;
    const details = [
      searchQuery ? `for "${searchQuery}"` : '',
      activeStatusFilter !== 'all' ? `with status ${activeStatusFilter}` : ''
    ].filter(Boolean).join(' ');

    setLiveAnnouncement(`${resultText}${details ? ` ${details}` : ''}.`);
  }, [searchQuery, activeStatusFilter, filteredFindings.length]);

  const tabsList: Array<{ id: 'code' | 'audio' | 'steps' | 'recommendation'; label: string; icon: React.ReactNode }> = [
    { id: 'code', label: 'Code Fix (Before vs After)', icon: <Code className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'audio', label: 'Screen Reader Transcription', icon: <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'steps', label: 'Reproduction Steps', icon: <ListOrdered className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'recommendation', label: 'Remediation Recipe', icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> }
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabsList.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabsList.length) % tabsList.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabsList.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActiveTab(tabsList[nextIndex].id);
    const targetTab = document.getElementById(`tab-${tabsList[nextIndex].id}`);
    targetTab?.focus();
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Live Region for Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Report Header Bar */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Interactive Deliverable Preview</span>
          </div>
          <h2 id="report-viewer-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Reports Your Development Team Can Actually Use
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            No vague generic warnings. Every finding includes exact WCAG criteria, user impact, screen reader transcriptions, and copy-pasteable code fixes.
          </p>
        </div>

        {/* Action button */}
        {onOpenConsultation && (
          <button
            type="button"
            onClick={(e) => onOpenConsultation(e.currentTarget)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start lg:self-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95"
          >
            <span>Request Sample Audit for Your App</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Column: Finding Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 border-r border-slate-800 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-300 font-semibold gap-2 flex-wrap">
            <span>Audit Findings ({filteredFindings.length})</span>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" aria-hidden="true" focusable="false" />
              <label htmlFor="findings-status-filter" className="sr-only">Filter audit findings by status</label>
              <select
                id="findings-status-filter"
                aria-label="Filter audit findings by status"
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-1 focus:ring-1 focus:ring-teal-400 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Open Finding">Open</option>
                <option value="In Remediation">In Progress</option>
                <option value="Remediated & Validated">Validated</option>
              </select>
            </div>
          </div>

          {/* Search Box with Accessible Label & Role */}
          <div className="pt-2.5 pb-2 border-b border-slate-800">
            <label htmlFor="findings-search-input" className="sr-only">
              Search findings by issue, criterion, or component
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" aria-hidden="true" focusable="false" />
              <input
                id="findings-search-input"
                type="search"
                role="searchbox"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search findings (e.g. contrast, keyboard)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:ring-1 focus:ring-teal-400 focus:outline-none"
              />
            </div>
            {/* Visual Results Count Summary */}
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{filteredFindings.length} {filteredFindings.length === 1 ? 'result' : 'results'} found</span>
              {(searchQuery || activeStatusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveStatusFilter('all'); }}
                  className="text-teal-400 hover:underline text-[10px] focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded px-1"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          <ul className="space-y-2 mt-3 overflow-y-auto max-h-[500px] pr-1 list-none p-0 m-0" aria-label="Audit findings list">
            {filteredFindings.length === 0 ? (
              <li className="text-center py-8 text-xs text-slate-400 space-y-2">
                <p>No findings match your search or filter.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveStatusFilter('all'); }}
                  className="text-teal-400 font-bold hover:underline"
                >
                  Clear search
                </button>
              </li>
            ) : filteredFindings.map((finding) => {
              const isSelected = finding.id === activeFinding.id;
              return (
                <li key={finding.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectFinding(finding)}
                    aria-pressed={isSelected}
                    aria-label={`${finding.id}: WCAG ${finding.wcagCriterion} ${finding.issueTitle}, ${finding.severity} severity, status: ${finding.validationStatus}`}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${
                      isSelected 
                        ? 'bg-slate-850 border-teal-500 ring-1 ring-teal-500/50 shadow-md' 
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-mono text-teal-400 font-bold">
                        WCAG {finding.wcagCriterion} (Level {finding.wcagLevel})
                      </span>
                      {getSeverityBadge(finding.severity)}
                    </div>

                    <h3 className="block text-xs font-bold text-white leading-snug line-clamp-2">
                      {finding.issueTitle}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                      <span className="truncate max-w-[140px]">{finding.category}</span>
                      <span className={`text-[10px] font-medium ${
                        finding.validationStatus === 'Remediated & Validated' ? 'text-emerald-400' :
                        finding.validationStatus === 'In Remediation' ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {finding.validationStatus}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Column: Finding Inspector Deep-Dive (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Finding Title & Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">
                    {activeFinding.id}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    WCAG {activeFinding.wcagCriterion}: {activeFinding.wcagName} (Level {activeFinding.wcagLevel})
                  </span>
                  {getSeverityBadge(activeFinding.severity)}
                </div>

                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {activeFinding.issueTitle}
                </h3>
                
                <p className="text-xs font-mono text-slate-300 mt-1">
                  Affected: <span className="text-white font-semibold">{activeFinding.affectedComponent}</span>
                </p>
              </div>

              {/* Status Toggle Interaction */}
              <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Status Simulation:</span>
                <button
                  type="button"
                  onClick={() => handleStatusToggle(activeFinding.id)}
                  aria-label={`Current remediation status: ${activeFinding.validationStatus}. Click to simulate next validation state.`}
                  title="Click to toggle status simulation"
                  className="hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md"
                >
                  {getStatusBadge(activeFinding.validationStatus)}
                </button>
              </div>
            </div>

            {/* User Impact Callout */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
                Real User Impact
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeFinding.userImpact}
              </p>
            </div>

            {/* Interactive Inspector Tabs */}
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto" role="tablist" aria-label="Finding Details Tabs">
                {tabsList.map((tab, idx) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-controls={`panel-${tab.id}`}
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => handleSelectTab(tab.id, tab.label)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 ${
                        isSelected 
                          ? 'bg-teal-500 text-slate-950 shadow font-extrabold' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: CODE FIX */}
              {activeTab === 'code' && (
                <div
                  role="tabpanel"
                  id="panel-code"
                  aria-labelledby="tab-code"
                  tabIndex={0}
                  className="pt-4 space-y-3 animate-in fade-in duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl"
                >
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Developer-Ready Code Recipe ({activeFinding.codeSnippet.language})</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(activeFinding.codeSnippet.good)}
                      aria-label={copiedCode ? 'Remediated code copied to clipboard' : 'Copy verified remediated fix code to clipboard'}
                      className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded px-1.5 py-0.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{copiedCode ? 'Copied Remediated Code' : 'Copy Fix Code'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                    {/* Inaccessible Snippet */}
                    <div className="bg-slate-950 border border-rose-900/60 rounded-xl p-3 overflow-x-auto" aria-label="Problematic Implementation Code">
                      <div className="text-[10px] uppercase font-bold text-rose-400 mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
                        <span>Problematic Implementation</span>
                      </div>
                      <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {activeFinding.codeSnippet.bad}
                      </pre>
                    </div>

                    {/* Remediated Snippet */}
                    <div className="bg-slate-950 border border-teal-700/60 rounded-xl p-3 overflow-x-auto" aria-label="Verified Remediated Fix Code">
                      <div className="text-[10px] uppercase font-bold text-teal-400 mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-400" aria-hidden="true" />
                        <span>Verified Remediated Fix</span>
                      </div>
                      <pre className="text-teal-200 leading-relaxed whitespace-pre-wrap">
                        {activeFinding.codeSnippet.good}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCREEN READER TRANSCRIPTION */}
              {activeTab === 'audio' && (
                <div
                  role="tabpanel"
                  id="panel-audio"
                  aria-labelledby="tab-audio"
                  tabIndex={0}
                  className="pt-4 space-y-3 animate-in fade-in duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl"
                >
                  <div className="text-xs text-slate-300">
                    Tested Assistive Environment: <strong className="text-white">{activeFinding.screenReaderTranscription.technology}</strong>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 border border-rose-900/50 rounded-xl p-4 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-rose-400">What Screen Reader Actually Speaks:</span>
                      <p className="font-mono text-slate-200 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/40">
                        {activeFinding.screenReaderTranscription.actual}
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-teal-800/50 rounded-xl p-4 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-teal-400">Expected Accessible Announcement:</span>
                      <p className="font-mono text-teal-200 bg-teal-950/40 p-2.5 rounded-lg border border-teal-800/40">
                        {activeFinding.screenReaderTranscription.expected}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REPRODUCTION STEPS */}
              {activeTab === 'steps' && (
                <div
                  role="tabpanel"
                  id="panel-steps"
                  aria-labelledby="tab-steps"
                  tabIndex={0}
                  className="pt-4 space-y-2 animate-in fade-in duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    How QA & Engineers Can Replicate:
                  </span>
                  <ol className="space-y-2 text-xs text-slate-200">
                    {activeFinding.reproductionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0" aria-hidden="true">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* TAB 4: REMEDIATION RECOMMENDATION */}
              {activeTab === 'recommendation' && (
                <div
                  role="tabpanel"
                  id="panel-recommendation"
                  aria-labelledby="tab-recommendation"
                  tabIndex={0}
                  className="pt-4 space-y-3 animate-in fade-in duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl"
                >
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-teal-400 block">Engineering Guidance</span>
                    <p className="leading-relaxed">{activeFinding.remediationRecommendation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer of Inspector */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Finding in Sample Audit Batch</span>
            <span className="text-teal-400 font-semibold">Every finding is exportable to Jira & GitHub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
