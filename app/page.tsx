'use client';

import React, { Suspense } from 'react';
import {
  Download,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Code2,
  Award,
} from 'lucide-react';
import { PERSONA } from '@/lib/persona';

function IdCardTabContent() {
  return (
    <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          {PERSONA.shortName}
          <span className="mt-1.5 block bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text font-mono text-lg font-semibold text-transparent sm:text-2xl">
            {PERSONA.title}
          </span>
        </h1>

        {/* Contact & Location Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-slate-300">
          <a
            href={`mailto:${PERSONA.email}`}
            className="inline-flex items-center gap-1.5 hover:text-sky-300"
          >
            <Mail className="h-3.5 w-3.5 text-sky-400" />
            <span>{PERSONA.email}</span>
          </a>
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span>{PERSONA.location}</span>
          </span>
        </div>

        <p className="max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
          {PERSONA.bioShort}
        </p>

        {/* Primary CTA: Download Resume + Profile Links */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href={PERSONA.resumeUrl}
            download="Niranjan_Hebli_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/70 bg-sky-500/20 px-4 py-2 font-mono text-xs font-bold text-sky-200 shadow-lg transition hover:border-sky-300 hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Download className="h-4 w-4 text-sky-300" />
            <span>Download Resume</span>
          </a>

          <a
            href={PERSONA.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-slate-700 hover:text-sky-300"
          >
            <Linkedin className="h-3.5 w-3.5 text-sky-400" />
            <span>LinkedIn</span>
          </a>

          <a
            href={PERSONA.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-slate-700 hover:text-sky-300"
          >
            <Github className="h-3.5 w-3.5 text-slate-200" />
            <span>GitHub</span>
          </a>

          <a
            href={PERSONA.codechefUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-slate-700 hover:text-amber-300"
          >
            <Code2 className="h-3.5 w-3.5 text-amber-400" />
            <span>CodeChef</span>
          </a>

          <a
            href={PERSONA.googleSkillBoostUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-slate-700 hover:text-emerald-300"
          >
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Google Skill Boost</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12 font-mono text-xs text-sky-400">
          LOADING PROFILE...
        </div>
      }
    >
      <IdCardTabContent />
    </Suspense>
  );
}
