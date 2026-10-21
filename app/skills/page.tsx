'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SkillsGalaxy = dynamic(
  () => import('@/components/skills/SkillsGalaxy'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-1 items-center justify-center bg-[#05060f] font-mono text-xs tracking-widest text-[#66f0ff]">
        INITIALIZING SKILL GALAXY...
      </div>
    ),
  }
);

export default function SkillsPage() {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[#05060f]">
      <SkillsGalaxy />
    </div>
  );
}
