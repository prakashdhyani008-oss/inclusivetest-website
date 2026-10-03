import React, { useState, useEffect, useRef } from 'react';
import { PageView, ResourceArticle } from '../types';
import { resourcesArticles } from '../data/resourcesData';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  BookOpen 
} from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: (trigger?: React.MouseEvent | HTMLElement) => void;
}

const CATEGORIES = [
  'All',
  'WCAG',
  'Accessibility Testing',
  'Screen Readers',
  'Keyboard Accessibility',
  'VPAT / ACR',
  'Strategy'
];

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);
  const [searchAnnouncement, setSearchAnnouncement] = useState<string>('');

  const lastArticleTriggerRef = useRef<HTMLElement | null>(null);
  const articleModalRef = useRef<HTMLDivElement>(null);
  const articleCloseButtonRef = useRef<HTMLButtonElement>(null);

  const filteredArticles = resourcesArticles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Announce dynamic search results to assistive technology (WCAG 4.1.3)
  useEffect(() => {
    const count = filteredArticles.length;
    const resultText = count === 1 ? '1 result found' : `${count} results found`;
    const details = [
      searchQuery ? `for "${searchQuery}"` : '',
      selectedCategory !== 'All' ? `in category ${selectedCategory}` : ''
    ].filter(Boolean).join(' ');

    setSearchAnnouncement(`${resultText}${details ? ` ${details}` : ''}.`);
  }, [searchQuery, selectedCategory, filteredArticles.length]);

  // Arrow key navigation for category filter tabs (WCAG 2.1.1)
  const handleCategoryKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = CATEGORIES.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setSelectedCategory(CATEGORIES[nextIndex]);
    const nextButton = document.getElementById(`cat-tab-${CATEGORIES[nextIndex]}`);
    nextButton?.focus();
  };

  // Article Modal keyboard focus trap & Escape handling (WCAG 2.1.2 & 2.4.3)
  useEffect(() => {
    if (!selectedArticle) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseArticle();
        return;
      }

      if (e.key === 'Tab') {
        if (!articleModalRef.current) return;
        const focusable = articleModalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([aria-hidden="true"]), [href]:not([disabled]):not([aria-hidden="true"]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      articleCloseButtonRef.current?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [selectedArticle]);

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    setTimeout(() => {
      lastArticleTriggerRef.current?.focus();
      lastArticleTriggerRef.current = null;
    }, 50);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-10">
      
      {/* Live Region for Dynamic Search Announcements (WCAG 4.1.3) */}
      <div 
        id="search-live-announcement" 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {searchAnnouncement}
      </div>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Educational Knowledge Base</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto break-words leading-tight">
          Digital Accessibility Guides & Engineering Resources
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          In-depth technical guides on WCAG 2.2 criteria, manual testing protocols, screen reader behavior, and VPAT reporting for engineering and product teams.
        </p>

        {/* Search & Category Filter Bar */}
        <div className="pt-6 max-w-3xl mx-auto space-y-4">
          <div className="relative text-left">
            <label htmlFor="resource-search-input" className="sr-only">
              Search accessibility articles and guides
            </label>
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" aria-hidden="true" />
            <input
              id="resource-search-input"
              type="search"
              role="searchbox"
              aria-describedby="search-results-count"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. WCAG 2.2, keyboard traps, VPAT, screen readers)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-teal-600 focus:outline-none text-slate-800"
            />
          </div>

          {/* Category Tabs with Arrow Key Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Article Categories">
            {CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-tab-${cat}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedCategory(cat)}
                  onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-bold' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Visual Search Results Summary */}
          <div id="search-results-count" className="text-xs font-semibold text-slate-700 pt-1" aria-hidden="true">
            <span>Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}</span>
            {searchQuery && <span> for &ldquo;<span className="font-bold text-slate-900">{searchQuery}</span>&rdquo;</span>}
            {selectedCategory !== 'All' && <span> in <span className="font-bold text-teal-800">{selectedCategory}</span></span>}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-base font-semibold text-slate-700">No articles match your search criteria.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-teal-700 font-bold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded px-1.5 py-0.5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {art.category}
                    </span>
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug break-words">
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 font-medium">
                    <span>{art.author.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      lastArticleTriggerRef.current = e.currentTarget;
                      setSelectedArticle(art);
                    }}
                    aria-label={`Read full article: ${art.title}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-md px-1.5 py-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Article Reading Modal with Focus Restoration and 400% Zoom Reflow */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start min-h-full overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
          ref={articleModalRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseArticle();
            }
          }}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30 truncate">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400 truncate">• {selectedArticle.readTime}</span>
              </div>

              <button
                type="button"
                onClick={handleCloseArticle}
                ref={articleCloseButtonRef}
                aria-label="Close article viewer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Article Content Body */}
            <div className="p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-slate-800 overscroll-contain focus:outline-none" tabIndex={-1}>
              <h1 id="article-reader-title" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight break-words">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span>By <strong className="text-slate-800">{selectedArticle.author.name}</strong> ({selectedArticle.author.role})</span>
                <span>• Published {selectedArticle.date}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 break-words">
                {selectedArticle.content.introduction}
              </p>

              {/* Sections */}
              {selectedArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 pt-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 break-words">
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                      {p}
                    </p>
                  ))}

                  {sec.checklistItems && (
                    <ul className="space-y-2 pt-2 text-xs text-slate-700 bg-teal-50/50 p-4 rounded-xl border border-teal-100" aria-label={`Checklist for ${sec.heading}`}>
                      {sec.checklistItems.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="break-words leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white space-y-2 mt-8">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Summary Takeaway</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">{selectedArticle.content.summary}</p>
              </div>
            </div>

            {/* Modal Footer: Responsive reflow for 400% zoom */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleCloseArticle}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                Close Article
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleCloseArticle();
                  onOpenConsultation(e.currentTarget);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                Discuss with an Accessibility Specialist
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

