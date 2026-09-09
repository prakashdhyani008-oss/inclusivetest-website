import React, { useState } from 'react';
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
  onOpenConsultation: () => void;
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

  const filteredArticles = resourcesArticles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 sm:space-y-24 py-10">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Educational Knowledge Base</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          Digital Accessibility Guides & Engineering Resources
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          In-depth technical guides on WCAG 2.2 criteria, manual testing protocols, screen reader behavior, and VPAT reporting for engineering and product teams.
        </p>

        {/* Search & Category Filter Bar */}
        <div className="pt-6 max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search accessibility articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. WCAG 2.2, keyboard traps, VPAT, screen readers)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-teal-600 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Article Categories">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
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
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {art.category}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span>{art.author.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(art)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:text-teal-900"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Article Reading Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400">• {selectedArticle.readTime}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article viewer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Article Content Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800">
              <h1 id="article-reader-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span>By <strong>{selectedArticle.author.name}</strong> ({selectedArticle.author.role})</span>
                <span>Published {selectedArticle.date}</span>
              </div>

              <p className="text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedArticle.content.introduction}
              </p>

              {/* Sections */}
              {selectedArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 pt-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm text-slate-700 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {sec.checklistItems && (
                    <ul className="space-y-2 pt-2 text-xs text-slate-700 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                      {sec.checklistItems.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="p-5 rounded-xl bg-slate-900 text-white space-y-2 mt-8">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Summary Takeaway</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedArticle.content.summary}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close Article
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedArticle(null);
                  onOpenConsultation();
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow"
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
