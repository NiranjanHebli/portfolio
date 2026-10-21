'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Leva } from 'leva';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { LanyardJoints } from './LanyardJoints';
import { usePortfolioStore } from '@/lib/store';
import { PERSONA } from '@/lib/persona';

function IssuingBadgeLoader() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-sky-500/30 bg-slate-900/90 px-6 py-5 shadow-2xl">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
        <p className="font-mono text-xs tracking-widest text-sky-400 uppercase">
          LOADING 3D ID CARD // {PERSONA.badgeId}
        </p>
      </div>
    </div>
  );
}

/**
 * Ensures `isLoaded` is marked true both on initial mount and across Next.js Fast Refresh (HMR).
 */
function CanvasReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export function Scene({ isActive = true }: { isActive?: boolean }) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const [showLeva, setShowLeva] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const badgeMode = usePortfolioStore((s) => s.badgeMode);
  const setBadgeMode = usePortfolioStore((s) => s.setBadgeMode);
  const badgeSide = usePortfolioStore((s) => s.badgeSide);
  const flipBadge = usePortfolioStore((s) => s.flipBadge);
  const setIsHovered = usePortfolioStore((s) => s.setIsHovered);
  const setLowEndGpu = usePortfolioStore((s) => s.setLowEndGpu);
  const setReducedMotion = usePortfolioStore((s) => s.setReducedMotion);
  const webglSupported = usePortfolioStore((s) => s.webglSupported);
  const setWebglSupported = usePortfolioStore((s) => s.setWebglSupported);

  useEffect(() => {
    if (isActive) {
      setIsHovered(false);
    }
  }, [isActive, setIsHovered]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1' || params.get('leva') === '1') {
      setShowLeva(true);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onMotionChange);

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    return () => mediaQuery.removeEventListener('change', onMotionChange);
  }, [setReducedMotion, setWebglSupported]);

  // Keyboard controls for Flip (ArrowLeft/Right) while holding the card in Inspect Mode
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && badgeMode === 'inspecting') {
        e.preventDefault();
        flipBadge();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, badgeMode, flipBadge]);

  if (!webglSupported) {
    return (
      <div className="relative flex min-h-[460px] w-full flex-col items-center justify-center rounded-2xl border border-sky-500/30 bg-slate-900 p-8 text-center">
        <h2 className="mt-2 text-2xl font-bold text-slate-100">{PERSONA.shortName}</h2>
        <p className="font-mono text-sm text-sky-400">{PERSONA.clearance}</p>
        <p className="mt-3 max-w-md text-sm text-slate-400">{PERSONA.bioShort}</p>
      </div>
    );
  }

  return (
    <div
      className="relative h-full min-h-[520px] w-full select-none"
      role="region"
      aria-label="Interactive 3D ID Card and Lanyard. Pull the card to stretch and release, click to zoom and inspect, or swipe left/right in inspect mode to flip."
    >
      <Leva hidden={!showLeva || !isActive} collapsed={false} titleBar={{ title: 'Physics Tuning' }} />

      {!isLoaded && <IssuingBadgeLoader />}

      {/* Bottom Controls Below Card (Flip Option & Back to Physics Mode) when in Interactive Mode */}
      {isActive && badgeMode === 'inspecting' && (
        <div className="pointer-events-auto absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 lg:left-[70%]">
          <button
            type="button"
            onClick={() => flipBadge()}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/60 bg-slate-900/95 px-4 py-2 font-mono text-xs font-bold text-emerald-300 shadow-lg backdrop-blur-md transition hover:border-emerald-300 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <RotateCw className="h-4 w-4" />
            <span>Flip Card ({badgeSide === 'front' ? 'Show Back' : 'Show Front'})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setBadgeMode('hanging');
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/70 bg-slate-900/95 px-4 py-2 font-mono text-xs font-bold text-sky-300 shadow-lg backdrop-blur-md transition hover:border-sky-300 hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Physics Mode</span>
          </button>
        </div>
      )}

      <Canvas
        shadows
        dpr={dpr}
        frameloop={isActive ? 'always' : 'never'}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        camera={{ position: [0, 0.25, 4.8], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={(state) => {
          setIsLoaded(true);
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            setWebglSupported(false);
          });
          canvas.addEventListener('webglcontextrestored', () => {
            setWebglSupported(true);
          });
        }}
      >
        <CanvasReadySignal onReady={() => setIsLoaded(true)} />

        <PerformanceMonitor
          onDecline={() => {
            setDpr([1, 1.25]);
            setLowEndGpu(true);
          }}
          onIncline={() => {
            setDpr([1, 1.75]);
          }}
        />

        {/* Clean, Even Studio Lighting (no glare spots) */}
        <ambientLight intensity={1.15} />
        <directionalLight position={[2.5, 4.0, 4.5]} intensity={1.35} color="#f8fafc" />
        <directionalLight position={[-2.5, 2.0, -3.0]} intensity={0.6} color="#cbd5e1" />

        <Suspense fallback={null}>
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 0, 1]}>
              <Lightformer
                form="rect"
                intensity={4}
                rotation-x={Math.PI / 2}
                position={[0, 5, -9]}
                scale={[10, 10, 1]}
              />
              <Lightformer
                form="rect"
                intensity={2.5}
                color="#38bdf8"
                rotation-y={Math.PI / 2}
                position={[-5, 1, -1]}
                scale={[20, 0.6, 1]}
              />
              <Lightformer
                form="rect"
                intensity={3.2}
                color="#f8fafc"
                rotation-y={-Math.PI / 2}
                position={[10, 1, 0]}
                scale={[20, 1.2, 1]}
              />
              <Lightformer
                form="ring"
                color="#38bdf8"
                intensity={2.2}
                scale={4}
                position={[0, 2, 5]}
              />
            </group>
          </Environment>

          <Physics
            paused={!isActive || badgeMode === 'inspecting'}
            interpolate
            timeStep={1 / 60}
            gravity={[0, -14, 0]}
          >
            <LanyardJoints />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
