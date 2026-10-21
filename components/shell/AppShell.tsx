'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  SunMoon,
  Github,
  Linkedin,
  Download,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { usePortfolioStore, TabId } from '@/lib/store';
import { PERSONA } from '@/lib/persona';

// Persistent 3D WebGL Scene mounted once in AppShell so navigating between tabs never destroys the WebGL/WASM context
const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
});

interface NavTabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  href: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_TABS: NavTabItem[] = [
  {
    id: 'id-card',
    label: 'Profile',
    shortLabel: 'Profile',
    href: '/',
    shortcut: '1',
    icon: User,
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Projects',
    href: '/projects',
    shortcut: '2',
    icon: FolderGit2,
  },
  {
    id: 'skills',
    label: 'Skills',
    shortLabel: 'Skills',
    href: '/skills',
    shortcut: '3',
    icon: Cpu,
  },
  {
    id: 'education',
    label: 'Education',
    shortLabel: 'Education',
    href: '/education',
    shortcut: '4',
    icon: GraduationCap,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null!);

  const isIdCardTab = pathname === '/';

  const activeTab = usePortfolioStore((s) => s.activeTab);
  const setActiveTab = usePortfolioStore((s) => s.setActiveTab);
  const badgeMode = usePortfolioStore((s) => s.badgeMode);
  const isHovered = usePortfolioStore((s) => s.isHovered);
  const sidebarCollapsed = usePortfolioStore((s) => s.sidebarCollapsed);
  const toggleSidebar = usePortfolioStore((s) => s.toggleSidebar);
  const theme = usePortfolioStore((s) => s.theme);
  const toggleTheme = usePortfolioStore((s) => s.toggleTheme);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  // Sync pathname -> activeTab in store
  useEffect(() => {
    if (pathname === '/') setActiveTab('id-card');
    else if (pathname.startsWith('/projects')) setActiveTab('projects');
    else if (pathname.startsWith('/skills')) setActiveTab('skills');
    else if (pathname.startsWith('/education')) setActiveTab('education');
  }, [pathname, setActiveTab]);

  // Sync theme attribute on document.body and document.documentElement
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.theme = theme;
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  // Global keyboard shortcuts: 1-4 switch tabs, '[' collapses sidebar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable);

      if (isEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key >= '1' && e.key <= '4') {
        const idx = Number(e.key) - 1;
        const tab = NAV_TABS[idx];
        if (tab) {
          e.preventDefault();
          router.push(tab.href);
        }
      } else if (e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router, toggleSidebar]);

  return (
    <div className="app-shell-root relative flex min-h-screen w-full bg-slate-950 text-slate-100 print:bg-white print:text-black print:min-h-0 print:block">
      {/* Skip Link */}
      <a href="#content" className="skip-link visually-hidden print:hidden">
        Skip to main content
      </a>

      {/* Subtle Ambient Grid Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 print:hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 55% 20%, rgba(56, 189, 248, 0.14), transparent 60%), linear-gradient(to right, rgba(30, 41, 59, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.35) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* Desktop Left Sidebar (>=768px): 260px expanded, 72px icon-only */}
      <aside
        aria-label="Portfolio Sidebar"
        style={{ width: sidebarCollapsed ? 72 : 260 }}
        className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col justify-between border-r border-slate-800/90 bg-slate-900/90 transition-[width] duration-200 ease-out md:flex print:hidden"
      >
        <div className="flex flex-col gap-3 p-3">
          {/* Sidebar Collapse Toggle */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label={sidebarCollapsed ? 'Expand sidebar ([)' : 'Collapse sidebar ([)'}
              title={sidebarCollapsed ? 'Expand sidebar ([)' : 'Collapse sidebar ([)'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Primary Navigation Tabs */}
          <nav aria-label="Primary">
            <ul className="space-y-1">
              {NAV_TABS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`group relative flex items-center rounded-xl px-3 py-2.5 font-mono text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        isActive
                          ? 'text-sky-300 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-tab"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 380, damping: 32 }
                          }
                          className="absolute inset-0 -z-10 rounded-xl border border-sky-500/40 bg-sky-500/10 shadow-[0_0_20px_-6px_rgba(56,189,248,0.45)]"
                        />
                      )}

                      <span className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition ${
                            isActive
                              ? 'text-sky-400'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer: Download Resume, Theme Toggle & Social Links */}
        <div className="space-y-2.5 border-t border-slate-800/90 p-3">
          <a
            href={PERSONA.resumeUrl}
            download="Niranjan_Hebli_Resume.pdf"
            title="Download Resume (PDF)"
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-sky-500/15 px-3 py-2 font-mono text-xs font-bold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`}
          >
            <Download className="h-3.5 w-3.5 shrink-0 text-sky-300" />
            {!sidebarCollapsed && <span>Download Resume</span>}
          </a>

          <div
            className={`flex items-center ${
              sidebarCollapsed ? 'flex-col gap-2' : 'justify-between'
            }`}
          >
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === 'high-contrast'}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                theme === 'high-contrast'
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-slate-800 bg-slate-950/90 text-slate-300 hover:border-slate-700 hover:text-sky-300'
              }`}
              aria-label={`Switch theme (currently ${theme})`}
              title={`Switch between Dark and High-Contrast mode (currently ${theme})`}
            >
              <SunMoon className={`h-3.5 w-3.5 ${theme === 'high-contrast' ? 'text-black' : 'text-sky-400'}`} />
              {!sidebarCollapsed && (
                <span>{theme === 'dark' ? 'Dark Mode' : 'Hi-Contrast'}</span>
              )}
            </button>

            <div className="flex items-center gap-1">
              <a
                href={PERSONA.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="rounded-lg border border-slate-800 bg-slate-950/90 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
              <a
                href={PERSONA.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="rounded-lg border border-slate-800 bg-slate-950/90 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Region */}
      <main
        id="content"
        ref={mainRef}
        tabIndex={-1}
        className="relative z-10 flex min-h-screen flex-1 flex-col overflow-x-clip pb-16 focus:outline-none md:pb-0 print:min-h-0 print:p-0 print:m-0 print:overflow-visible print:block print:bg-white print:text-black"
      >
        <div
          className={
            isIdCardTab
              ? 'relative grid min-h-screen flex-1 grid-cols-1 lg:grid-cols-12 print:block'
              : 'flex flex-1 flex-col print:block'
          }
        >
          {/* Page Content (Left 5 columns on ID Card tab with no stacking context on wrapper so background/text stay below the z-20/z-40 3D ID Card) */}
          <div
            className={
              isIdCardTab
                ? `relative flex flex-col lg:col-start-1 lg:col-end-6 lg:row-start-1 print:block ${
                    isHovered || badgeMode !== 'hanging'
                      ? 'pointer-events-none'
                      : 'pointer-events-none [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-30 [&_button]:pointer-events-auto [&_button]:relative [&_button]:z-30'
                  }`
                : 'flex flex-1 flex-col print:block'
            }
          >
            {children}
          </div>

          {/* Persistent 3D ID Card Canvas Container:
              Spans all 12 columns in row 1 with explicit 100vh height on desktop '/' so dragging the card left goes ABOVE the left panel,
              kept hidden when navigating to other tabs so it never occludes other views or GPU layers */}
          <div
            aria-hidden={!isIdCardTab}
            className={
              isIdCardTab
                ? `relative ${
                    isHovered || badgeMode !== 'hanging' ? 'z-40' : 'z-20'
                  } h-[62vh] min-h-[520px] w-full lg:col-start-1 lg:col-end-13 lg:row-start-1 lg:sticky lg:top-0 lg:h-screen print:hidden`
                : 'hidden print:hidden'
            }
          >
            <Scene isActive={isIdCardTab} />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar (<768px) */}
      <nav
        aria-label="Mobile Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-900/95 px-2 backdrop-blur-xl md:hidden print:hidden"
      >
        {NAV_TABS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 font-mono text-[10px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isActive ? 'text-sky-300 font-semibold' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-active-tab"
                  className="absolute inset-0 -z-10 rounded-xl border border-sky-500/40 bg-sky-500/10"
                />
              )}
              <Icon className="h-4 w-4" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreSheetOpen(true)}
          aria-expanded={moreSheetOpen}
          aria-label="More options and social links"
          className="flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 font-mono text-[10px] text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile "More" Bottom Sheet */}
      {moreSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Theme and Social Options"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm md:hidden print:hidden"
        >
          <div className="space-y-4 rounded-t-2xl border-t border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-100 uppercase">
                {PERSONA.shortName} // {PERSONA.title}
              </span>
              <button
                type="button"
                onClick={() => setMoreSheetOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-100"
                aria-label="Close More menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <a
              href={PERSONA.resumeUrl}
              download="Niranjan_Hebli_Resume.pdf"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-sky-500/20 py-2.5 font-mono text-xs font-bold text-sky-200"
            >
              <Download className="h-4 w-4 text-sky-300" />
              Download Resume (PDF)
            </a>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2.5 font-mono text-xs text-slate-200"
              >
                <SunMoon className="h-4 w-4 text-sky-400" />
                Theme: {theme}
              </button>
              <a
                href={PERSONA.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={PERSONA.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
