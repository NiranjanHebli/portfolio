'use client';

import React, { useState } from 'react';
import {
  Check,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

type FilterType = 'all' | 'completed' | 'active';

export default function EducationPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  const scrollToCard = (cardId: string) => {
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCard(cardId);
      setTimeout(() => {
        setHighlightedCard(null);
      }, 1800);
    }
  };

  const getCardStyle = (status: 'completed' | 'active') => {
    if (filter === 'all') {
      return { opacity: 1, filter: 'none', transform: 'scale(1)' };
    }
    if (filter === status) {
      return { opacity: 1, filter: 'none', transform: 'scale(1)' };
    }
    return { opacity: 0.22, filter: 'grayscale(85%)', transform: 'scale(0.98)' };
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 antialiased overflow-x-hidden">
      {/* BEGIN: Ambient Background Glows */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-cyan-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-[45%] left-[10%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-[160px]" />
        {/* Grid overlay across full canvas */}
        <div className="absolute inset-0 bg-grid-pattern opacity-70" />
        <div className="absolute inset-0 radial-vignette opacity-85" />
      </div>
      {/* END: Ambient Background Glows */}

      {/* Sleek Single-Bar HUD & Controls matching Projects page navbar */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/20 bg-slate-900/90 px-4 py-2.5 shadow-xl sm:px-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 font-mono text-[11px] font-bold text-cyan-200">
              <GraduationCap className="h-3.5 w-3.5" />
              EDUCATION
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                  filter === 'all'
                    ? 'border-cyan-300 bg-sky-500/25 font-bold text-white shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]'
                    : 'border-white/15 bg-slate-950/60 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>All Milestones (3)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                  filter === 'completed'
                    ? 'border-cyan-300 bg-sky-500/25 font-bold text-white shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]'
                    : 'border-white/15 bg-slate-950/60 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>Completed (2)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                  filter === 'active'
                    ? 'border-cyan-300 bg-sky-500/25 font-bold text-white shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]'
                    : 'border-white/15 bg-slate-950/60 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>Active (1)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToCard('card-3')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/60 bg-sky-500/25 px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-[0_0_20px_-5px_rgba(56,189,248,0.65)] transition hover:bg-sky-500/35"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>IIT Kharagpur (Active)</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToCard('card-2')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-950/70 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 transition hover:border-white/40 hover:text-white"
            >
              <span>IIT Gandhinagar</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToCard('card-1')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-950/70 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 transition hover:border-white/40 hover:text-white"
            >
              <span>NIT Goa</span>
            </button>
          </div>
        </header>
      </div>

      {/* BEGIN: Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-24">
        {/* Page Title & Overview Stats */}
        <section className="text-center max-w-3xl mx-auto mt-2 sm:mt-4 mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Academic Pathway &amp; Milestones
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Tracing the educational trajectory from foundational computer science and engineering to advanced agentic artificial intelligence and machine learning research.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <div className="px-3 py-2 text-center rounded-xl bg-slate-900/50">
              <div className="text-xl font-bold text-white font-mono">3</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Degrees
              </div>
            </div>
            <div className="px-3 py-2 text-center rounded-xl bg-slate-900/50">
              <div className="text-xl font-bold text-emerald-400 font-mono">IIT &amp; NIT</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Institutes
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: Full-Width Horizontal Chronological Stepper Track                */}
        {/* ========================================================================= */}
        <section className="mb-14 px-2">
          <div className="relative bg-gradient-to-r from-slate-900/80 via-[#0d1627]/90 to-slate-900/80 border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Top Row: Stepper Meta Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.06] gap-3">
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="text-cyan-400 h-5 w-5" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200 uppercase">
                  Chronological Progression (2020 - 2028)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> 2 Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 1 In Progress
                </span>
              </div>
            </div>

            {/* Horizontal Stepper Bar Container */}
            <div className="relative py-2 sm:py-4">
              {/* Base Track Guideline */}
              <div className="absolute top-[38px] left-[6%] right-[6%] h-[3px] bg-slate-800/80 rounded-full z-0 hidden md:block" />
              {/* Glowing Progress Line spanning Cyan to Emerald */}
              <div className="absolute top-[38px] left-[6%] right-[6%] h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 rounded-full z-0 shadow-[0_0_16px_rgba(56,189,248,0.7)] hidden md:block" />

              {/* 3 Stepper Checkpoints Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative z-10">
                {/* Stepper Point 1 */}
                <div
                  className="flex md:flex-col items-center md:items-center text-left md:text-center group cursor-pointer"
                  onClick={() => scrollToCard('card-1')}
                >
                  <div className="relative flex items-center justify-center shrink-0 mr-4 md:mr-0 mb-0 md:mb-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-500 shadow-node-cyan border-2 border-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-slate-900 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center md:justify-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        05/2020 - 05/2024
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-cyan-300 transition-colors">
                      B.Tech in Computer Science
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">NIT Goa</p>
                  </div>
                </div>

                {/* Stepper Point 2 */}
                <div
                  className="flex md:flex-col items-center md:items-center text-left md:text-center group cursor-pointer"
                  onClick={() => scrollToCard('card-2')}
                >
                  <div className="relative flex items-center justify-center shrink-0 mr-4 md:mr-0 mb-0 md:mb-3">
                    <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/20">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-100 to-sky-400 shadow-node-cyan border-2 border-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-slate-900 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center md:justify-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        02/2026 - 07/2026
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-cyan-300 transition-colors">
                      PG Diploma in Agentic AI and ML
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">IIT Gandhinagar</p>
                  </div>
                </div>

                {/* Stepper Point 3 */}
                <div
                  className="flex md:flex-col items-center md:items-center text-left md:text-center group cursor-pointer"
                  onClick={() => scrollToCard('card-3')}
                >
                  <div className="relative flex items-center justify-center shrink-0 mr-4 md:mr-0 mb-0 md:mb-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-500 shadow-node-emerald border-2 border-white flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-900 animate-ping" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center md:justify-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        2026 - 2028
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-emerald-300 transition-colors">
                      M.Tech in CS &amp; Engineering
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">IIT Kharagpur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Horizontal Chronological Stepper Track */}

        {/* ========================================================================= */}
        {/* SECTION: 3-Column Milestone Academic Matrix Cards Deck                    */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {/* ========================================== */}
          {/* CARD 1: NIT Goa (B.Tech)                   */}
          {/* ========================================== */}
          <div
            className={`milestone-card flex flex-col transition-all duration-300 rounded-2xl ${
              highlightedCard === 'card-1' ? 'ring-2 ring-cyan-400/60' : ''
            }`}
            id="card-1"
            style={getCardStyle('completed')}
          >
            <article className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col h-full group">
              {/* Corner Ambient Radial Highlight */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              {/* Card Header: Date & CGPA Pill */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    05/2020 - 05/2024
                  </span>
                  <span className="h-[2px] w-6 bg-cyan-500/30 rounded-full inline-block" />
                </div>
                <span className="font-mono text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                  CGPA 8.16
                </span>
              </div>
              {/* Degree Title & Institute */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
                  Bachelor of Technology (B.Tech) in Computer Science
                </h3>
                <div className="flex items-center space-x-2 mt-3 text-slate-400 text-sm font-medium">
                  <span className="text-slate-400">National Institute of Technology, Goa</span>
                </div>
              </div>
            </article>
          </div>

          {/* ========================================== */}
          {/* CARD 2: IIT Gandhinagar (PG Diploma AI)   */}
          {/* ========================================== */}
          <div
            className={`milestone-card flex flex-col transition-all duration-300 rounded-2xl ${
              highlightedCard === 'card-2' ? 'ring-2 ring-cyan-400/60' : ''
            }`}
            id="card-2"
            style={getCardStyle('completed')}
          >
            <article className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col h-full group border-cyan-500/25">
              {/* Corner Ambient Radial Highlight */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl group-hover:bg-cyan-400/25 transition-all" />
              {/* Card Header: Date & CGPA Pill */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    02/2026 - 07/2026
                  </span>
                  <span className="h-[2px] w-6 bg-cyan-500/30 rounded-full inline-block" />
                </div>
                <span className="font-mono text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                  CGPA 10
                </span>
              </div>
              {/* Degree Title & Institute */}
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
                  Post Graduate Diploma in Agentic AI and ML
                </h3>
                <div className="flex items-center space-x-2 mt-3 text-slate-400 text-sm font-medium">
                  <span className="text-slate-400">Indian Institute of Technology, Gandhinagar</span>
                </div>
              </div>
              {/* Authentic Description from Snapshot */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mt-2">
                Building autonomous, tool-using AI systems and the machine learning foundations behind them.
              </p>
            </article>
          </div>

          {/* ========================================== */}
          {/* CARD 3: IIT Kharagpur (M.Tech) - Active    */}
          {/* ========================================== */}
          <div
            className={`milestone-card flex flex-col transition-all duration-300 rounded-2xl ${
              highlightedCard === 'card-3' ? 'ring-2 ring-emerald-400/60' : ''
            }`}
            id="card-3"
            style={getCardStyle('active')}
          >
            <article className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col h-full group border-emerald-500/30 hover:border-emerald-400/50">
              {/* Corner Ambient Radial Highlight */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all" />
              {/* Card Header: Date & CGPA Pill */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    2026 - 2028
                  </span>
                  <span className="h-[2px] w-6 bg-cyan-500/30 rounded-full inline-block" />
                </div>
                <span className="font-mono text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                  CGPA pending
                </span>
              </div>
              {/* Degree Title & Institute */}
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-emerald-200 transition-colors">
                  M.Tech in Computer Science &amp; Engineering
                </h3>
                <div className="flex items-center space-x-2 mt-3 text-slate-400 text-sm font-medium">
                  <span className="text-slate-400">Indian Institute of Technology (IIT) Kharagpur</span>
                </div>
              </div>
              {/* Status Badge with Green Dot */}
              <div className="mt-4 flex items-center space-x-2 text-xs font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Currently enrolled</span>
              </div>
            </article>
          </div>
        </section>
        {/* END: 3-Column Milestone Academic Matrix Cards Deck */}
      </main>
      {/* END: Main Content Area */}
    </div>
  );
}
