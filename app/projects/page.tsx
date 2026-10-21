'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FolderGit2,
  ExternalLink,
  Move3d,
  ChevronUp,
  ChevronDown,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  PROJECTS,
  Project,
  getProjectBySlug,
} from '@/data/content';
import { usePortfolioStore } from '@/lib/store';

const TOTAL_SLABS = PROJECTS.length;

const GLASS_SLAB_THEMES = [
  {
    border: 'border-cyan-300/80',
    glow: 'shadow-[0_20px_50px_rgba(8,145,178,0.35),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_20px_rgba(56,189,248,0.4)]',
    badge: 'bg-sky-400/25 text-sky-100 border-cyan-300/60',
    strip: 'from-sky-500/30 via-cyan-400/15 to-slate-900',
    edgeWallBg:
      'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 18%, rgba(14,165,233,0.75) 50%, rgba(12,74,110,0.95) 82%, rgba(186,230,253,0.9) 100%)',
    sideWallBg:
      'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.85) 18%, rgba(14,165,233,0.75) 50%, rgba(12,74,110,0.95) 82%, rgba(186,230,253,0.9) 100%)',
    sliceBorderBright: 'rgba(165, 243, 252, 0.85)',
    sliceBorderMid: 'rgba(56, 189, 248, 0.55)',
    sliceBg: 'rgba(12, 74, 110, 0.88)',
  },
  {
    border: 'border-emerald-300/80',
    glow: 'shadow-[0_20px_50px_rgba(16,185,129,0.35),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_20px_rgba(16,185,129,0.4)]',
    badge: 'bg-emerald-400/25 text-emerald-100 border-emerald-300/60',
    strip: 'from-emerald-500/30 via-teal-400/15 to-slate-900',
    edgeWallBg:
      'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(110,231,183,0.85) 18%, rgba(16,185,129,0.75) 50%, rgba(6,78,59,0.95) 82%, rgba(167,243,208,0.9) 100%)',
    sideWallBg:
      'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(110,231,183,0.85) 18%, rgba(16,185,129,0.75) 50%, rgba(6,78,59,0.95) 82%, rgba(167,243,208,0.9) 100%)',
    sliceBorderBright: 'rgba(167, 243, 208, 0.85)',
    sliceBorderMid: 'rgba(16, 185, 129, 0.55)',
    sliceBg: 'rgba(6, 78, 59, 0.88)',
  },
  {
    border: 'border-sky-300/80',
    glow: 'shadow-[0_20px_50px_rgba(34,211,238,0.35),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_20px_rgba(34,211,238,0.4)]',
    badge: 'bg-cyan-400/25 text-cyan-100 border-sky-300/60',
    strip: 'from-cyan-500/30 via-sky-400/15 to-slate-900',
    edgeWallBg:
      'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(103,232,249,0.85) 18%, rgba(6,182,212,0.75) 50%, rgba(22,78,99,0.95) 82%, rgba(207,250,254,0.9) 100%)',
    sideWallBg:
      'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(103,232,249,0.85) 18%, rgba(6,182,212,0.75) 50%, rgba(22,78,99,0.95) 82%, rgba(207,250,254,0.9) 100%)',
    sliceBorderBright: 'rgba(207, 250, 254, 0.85)',
    sliceBorderMid: 'rgba(34, 211, 238, 0.55)',
    sliceBg: 'rgba(22, 78, 99, 0.88)',
  },
];

interface GlassSlabFrontContentProps {
  project: Project;
  slabIndex: number;
  isActiveFace: boolean;
}

/**
 * Front Surface of the Thick 3D Glass Slab containing ONLY verified resume information.
 */
function GlassSlabFrontContent({
  project,
  slabIndex,
  isActiveFace,
}: GlassSlabFrontContentProps) {
  const theme = GLASS_SLAB_THEMES[slabIndex % GLASS_SLAB_THEMES.length];

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-y-auto rounded-3xl border-2 ${theme.border} bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 ${theme.glow} ${
        isActiveFace ? 'pointer-events-auto' : 'pointer-events-none select-none'
      }`}
    >
      {/* Optical Glass Specular Sheen & Top/Bottom Refractive Prism Edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(125deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.03)_28%,transparent_48%,rgba(56,189,248,0.08)_82%,rgba(255,255,255,0.14)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/95 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent"
      />

      {/* Top Glass Slab Header Bar */}
      <div
        className={`relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-gradient-to-r ${theme.strip} px-6 py-4 sm:px-8`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-bold ${theme.badge}`}
          >
            <Layers className="h-3.5 w-3.5" />
            PROJECT 0{slabIndex + 1} / 0{TOTAL_SLABS}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-200">
            <Calendar className="h-3.5 w-3.5 text-cyan-300" />
            {project.githubMeta.lastCommit} - {project.githubMeta.lastCommit}
          </span>

          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-slate-900/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-white transition hover:border-cyan-300 hover:bg-slate-800"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-cyan-300" />
            <span>GitHub Link</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Glass Slab Body */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-9">
        <div>
          <div className="border-b border-white/15 pb-5">
            <h2 className="text-2xl font-bold text-white sm:text-4xl">
              {project.title}
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Resume Bullet Points */}
            <div className="space-y-3.5 lg:col-span-7">
              <h3 className="font-mono text-xs font-bold tracking-wider text-cyan-300 uppercase">
                Key Contributions &amp; Implementation
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-100 sm:text-base">
                {project.metrics.map((metric, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 rounded-2xl border border-white/15 bg-slate-950/85 p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/20 font-mono text-xs font-bold text-cyan-200">
                      0{idx + 1}
                    </span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies & Linked Resume Experience/Education */}
            <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-white/15 bg-slate-950/85 p-6 lg:col-span-5">
              <div className="space-y-5">
                <div>
                  <h4 className="font-mono text-xs font-bold text-sky-300 uppercase">
                    Technologies Used
                  </h4>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/20 bg-slate-900 px-3 py-1.5 font-mono text-xs font-medium text-cyan-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-white/15 pt-4">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/50 bg-sky-500/25 px-4 py-3 font-mono text-xs font-bold text-white transition hover:bg-sky-500/35"
                >
                  <FolderGit2 className="h-4 w-4 text-cyan-200" />
                  <span>View Repository on GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper to normalize relative slab offset into [-1.5, +1.5) for the 3 resume projects.
 */
function getNormalizedSlabOffset(slabIndex: number, progress: number): number {
  let offset = (slabIndex - progress) % TOTAL_SLABS;
  if (offset < -1.5) offset += TOTAL_SLABS;
  if (offset >= 1.5) offset -= TOTAL_SLABS;
  return offset;
}

// Clean, solid 3D glass core planes (back plate, mid rib, and front face) with zero Z-fighting
const CORE_SLICES_Z = [-36, -18, 0, 18];

/**
 * Visibly Thick 72px 3D Glass Block Slab (`HALF_THICKNESS = 36px`, `FULL_THICKNESS = 72px`).
 * - Completely vertical (`rotateX(0deg) rotateY(0deg)`) at rest (no sideways tilt!).
 * - Polished 3D glass edge walls with backface culling to eliminate any compositor flicker.
 */
interface ThickGlassSlab3DProps {
  project: Project;
  slabIndex: number;
  progressSpring: MotionValue<number>;
  isActiveFace: boolean;
}

function ThickGlassSlab3D({
  project,
  slabIndex,
  progressSpring,
  isActiveFace,
}: ThickGlassSlab3DProps) {
  const theme = GLASS_SLAB_THEMES[slabIndex % GLASS_SLAB_THEMES.length];

  const slabTransform = useTransform(progressSpring, (progress) => {
    const offset = getNormalizedSlabOffset(slabIndex, progress);

    // Upright, straight vertical orientation at rest (`rotateX = 0, rotateY = 0`)
    let translateY = 0;
    let translateZ = 0;
    let rotateX = 0;

    if (offset <= 0) {
      // Outgoing Thick Glass Slab rotating vertically upward and away (t goes 0 -> 1)
      const t = Math.min(1.5, -offset);
      translateY = -t * 920;
      translateZ = -Math.sin(t * Math.PI * 0.85) * 320 - t * 180;
      rotateX = Math.sin(Math.min(1, t) * Math.PI * 0.65) * 68;
    } else {
      // Incoming Thick Glass Slab rising vertically from below (u goes 1 -> 0)
      const u = Math.min(1.5, offset);
      translateY = u * 920;
      translateZ = -Math.sin(u * Math.PI * 0.85) * 320 - u * 180;
      rotateX = -Math.sin(Math.min(1, u) * Math.PI * 0.65) * 68;
    }

    return `translate3d(0px, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg)`;
  });

  const slabOpacity = useTransform(progressSpring, (progress) => {
    const offset = Math.abs(getNormalizedSlabOffset(slabIndex, progress));
    if (offset < 0.65) return 1;
    return Math.max(0, 1 - (offset - 0.65) * 2.8);
  });

  const slabDisplay = useTransform(progressSpring, (progress) => {
    const offset = Math.abs(getNormalizedSlabOffset(slabIndex, progress));
    return offset >= 1.05 ? 'none' : 'block';
  });

  const slabZIndex = useTransform(progressSpring, (progress) => {
    const offset = getNormalizedSlabOffset(slabIndex, progress);
    return Math.abs(offset) < 0.5 ? 30 : 20;
  });

  const HALF_THICKNESS = 36; // 72px total 3D slab thickness
  const FULL_THICKNESS = HALF_THICKNESS * 2;

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transform: slabTransform,
        opacity: slabOpacity,
        display: slabDisplay,
        zIndex: slabZIndex,
        willChange: 'transform, opacity',
      }}
      className={`absolute inset-x-6 top-6 bottom-6 m-auto h-[calc(100%-3rem)] w-[calc(100%-3rem)] max-w-[1280px] sm:inset-x-10 ${
        isActiveFace ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* 1. SOLID 3D GLASS CORE PLATES (Back plate & internal glass density) */}
      {CORE_SLICES_Z.map((zDepth, idx) => (
        <div
          key={zDepth}
          aria-hidden="true"
          style={{
            transform: `translateZ(${zDepth}px)`,
            borderColor: idx === 0 ? theme.sliceBorderBright : theme.sliceBorderMid,
            backgroundColor: idx === 0 ? '#082f49' : theme.sliceBg,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl border-[3px]"
        />
      ))}

      {/* 2. TOP, BOTTOM, LEFT & RIGHT 72px-THICK POLISHED 3D GLASS WALLS (with backface culling to prevent flicker) */}
      {/* Top 72px-Thick Polished Glass Wall */}
      <div
        aria-hidden="true"
        style={{
          height: `${FULL_THICKNESS}px`,
          top: `-${HALF_THICKNESS}px`,
          transform: 'rotateX(90deg)',
          backgroundImage: theme.edgeWallBg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="pointer-events-none absolute inset-x-5 flex flex-col justify-between rounded-lg border-2 border-white/90 px-5 py-1.5 shadow-[0_0_24px_rgba(56,189,248,0.4)]"
      >
        <div className="h-[2px] w-full bg-white" />
        <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-widest text-slate-950 uppercase">
          <span>PROJECT 0{slabIndex + 1}</span>
          <span>{project.title}</span>
        </div>
        <div className="h-[2px] w-full bg-white" />
      </div>

      {/* Bottom 72px-Thick Polished Glass Wall */}
      <div
        aria-hidden="true"
        style={{
          height: `${FULL_THICKNESS}px`,
          bottom: `-${HALF_THICKNESS}px`,
          transform: 'rotateX(-90deg)',
          backgroundImage: theme.edgeWallBg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="pointer-events-none absolute inset-x-5 flex flex-col justify-between rounded-lg border-2 border-white/90 px-5 py-1.5 shadow-[0_0_24px_rgba(56,189,248,0.4)]"
      >
        <div className="h-[2px] w-full bg-white" />
        <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-widest text-slate-950 uppercase">
          <span>PROJECT 0{slabIndex + 1}</span>
          <span>{project.title}</span>
        </div>
        <div className="h-[2px] w-full bg-white" />
      </div>

      {/* Left 72px-Thick Polished Glass Wall */}
      <div
        aria-hidden="true"
        style={{
          width: `${FULL_THICKNESS}px`,
          left: `-${HALF_THICKNESS}px`,
          transform: 'rotateY(-90deg)',
          backgroundImage: theme.sideWallBg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="pointer-events-none absolute inset-y-5 flex justify-between rounded-lg border-2 border-white/90 p-1.5 shadow-[0_0_24px_rgba(56,189,248,0.4)]"
      >
        <div className="h-full w-[2px] bg-white" />
        <div className="h-full w-[2px] bg-white" />
      </div>

      {/* Right 72px-Thick Polished Glass Wall */}
      <div
        aria-hidden="true"
        style={{
          width: `${FULL_THICKNESS}px`,
          right: `-${HALF_THICKNESS}px`,
          transform: 'rotateY(90deg)',
          backgroundImage: theme.sideWallBg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="pointer-events-none absolute inset-y-5 flex justify-between rounded-lg border-2 border-white/90 p-1.5 shadow-[0_0_24px_rgba(56,189,248,0.4)]"
      >
        <div className="h-full w-[2px] bg-white" />
        <div className="h-full w-[2px] bg-white" />
      </div>

      {/* 3. FRONT SURFACE (`translateZ(+36px)`) */}
      <div
        style={{
          transform: `translateZ(${HALF_THICKNESS}px)`,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="absolute inset-0 h-full w-full"
      >
        <GlassSlabFrontContent
          project={project}
          slabIndex={slabIndex}
          isActiveFace={isActiveFace}
        />
      </div>
    </motion.div>
  );
}

function ProjectsRouteView() {
  const searchParams = useSearchParams();
  const setSelectedProjectSlug = usePortfolioStore((s) => s.setSelectedProjectSlug);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isDraggingSlab, setIsDraggingSlab] = useState(false);

  const dragStartRef = useRef<{ y: number; startStep: number } | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

  // Normalize active project index (0..2)
  const activeFaceIndex = ((stepIndex % TOTAL_SLABS) + TOTAL_SLABS) % TOTAL_SLABS;

  const progressSpring = useSpring(0, {
    stiffness: reducedMotion ? 300 : 68,
    damping: reducedMotion ? 40 : 22,
    mass: 0.9,
    restDelta: 0.0005,
  });

  const rotateToSlab = (nextStep: number) => {
    setStepIndex(nextStep);
    progressSpring.set(nextStep);
  };

  // Sync URL `?open=<slug>` -> rotate to that project's thick glass slab
  useEffect(() => {
    const openSlug = searchParams.get('open');
    if (openSlug && getProjectBySlug(openSlug)) {
      setSelectedProjectSlug(openSlug);
      const idx = PROJECTS.findIndex((p) => p.slug === openSlug);
      if (idx >= 0) {
        rotateToSlab(idx);
      }
    }
  }, [searchParams, setSelectedProjectSlug]);

  // Keyboard Up/Down/Left/Right arrows to rotate to next/previous thick glass slab
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        rotateToSlab(stepIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        rotateToSlab(stepIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepIndex]);

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, pre')) return;
    setIsDraggingSlab(true);
    dragStartRef.current = { y: e.clientY, startStep: stepIndex };
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSlab || !dragStartRef.current) return;
    const dy = e.clientY - dragStartRef.current.y;
    const deltaSteps = -dy / 320;
    progressSpring.set(dragStartRef.current.startStep + deltaSteps);
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSlab || !dragStartRef.current) return;
    const dy = e.clientY - dragStartRef.current.y;
    setIsDraggingSlab(false);

    if (Math.abs(dy) > 36) {
      const dir = dy < 0 ? 1 : -1;
      rotateToSlab(dragStartRef.current.startStep + dir);
    } else {
      rotateToSlab(dragStartRef.current.startStep);
    }
    dragStartRef.current = null;
  };

  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastWheelTimeRef.current < 650) return;
    if (Math.abs(e.deltaY) > 25) {
      lastWheelTimeRef.current = now;
      rotateToSlab(stepIndex + (e.deltaY > 0 ? 1 : -1));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-3 p-3 sm:p-5">
      {/* Sleek Single-Bar HUD & Controls */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/20 bg-slate-900/90 px-4 py-2.5 shadow-xl sm:px-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 font-mono text-[11px] font-bold text-cyan-200">
            <Move3d className="h-3.5 w-3.5" />
            PROJECTS
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            {PROJECTS.map((proj, idx) => {
              const isCurrent = activeFaceIndex === idx;

              return (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => {
                    let diff = idx - activeFaceIndex;
                    if (diff < 0) diff += TOTAL_SLABS;
                    rotateToSlab(stepIndex + diff);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                    isCurrent
                      ? 'border-cyan-300 bg-sky-500/25 font-bold text-white shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]'
                      : 'border-white/15 bg-slate-950/60 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>
                    0{idx + 1}. {proj.title.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => rotateToSlab(stepIndex + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/60 bg-sky-500/25 px-4 py-1.5 font-mono text-xs font-bold text-white shadow-[0_0_25px_-5px_rgba(56,189,248,0.65)] transition hover:bg-sky-500/35"
          >
            <ChevronUp className="h-4 w-4" />
            <span>Next Project</span>
          </button>

          <button
            type="button"
            onClick={() => rotateToSlab(stepIndex - 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-slate-950/70 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 transition hover:border-white/45 hover:text-white"
          >
            <ChevronDown className="h-4 w-4" />
            <span>Prev</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          FULL-VIEWPORT VERTICAL 3D THICK GLASS SLAB WINDOW
          - Upright vertical orientation (`rotateX(0deg) rotateY(0deg)` at rest)
          - 72px-thick 3D glass extrusion visible as slabs rotate vertically
          - Constant 920px vertical separation so slabs never intersect
         ==================================================================== */}
      <div
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
        onWheel={handleStageWheel}
        style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        className={`relative flex h-[calc(100vh-110px)] min-h-[680px] w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900/55 via-sky-950/25 to-slate-950/85 shadow-2xl sm:min-h-[740px] ${
          isDraggingSlab ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Ambient Glass Caustics */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.20),transparent_62%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.14),transparent_55%)]"
        />

        {/* Floating Up/Down Controls on Right Edge */}
        <div className="absolute right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5">
          <button
            type="button"
            onClick={() => rotateToSlab(stepIndex + 1)}
            aria-label="Rotate to next project glass slab"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/60 bg-sky-500/30 text-white shadow-lg transition hover:border-cyan-200 hover:bg-sky-500/45"
            title="Next Project"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => rotateToSlab(stepIndex - 1)}
            aria-label="Rotate to previous project glass slab"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-slate-900/85 text-slate-200 shadow-lg transition hover:border-cyan-300 hover:text-white"
            title="Previous Project"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* The 3 Resume Project Thick 3D Glass Slabs */}
        {PROJECTS.map((proj, slabIdx) => (
          <ThickGlassSlab3D
            key={proj.slug}
            project={proj}
            slabIndex={slabIdx}
            progressSpring={progressSpring}
            isActiveFace={activeFaceIndex === slabIdx}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 font-mono text-xs text-cyan-400">
          LOADING PROJECTS...
        </div>
      }
    >
      <ProjectsRouteView />
    </Suspense>
  );
}
