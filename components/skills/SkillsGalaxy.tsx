'use client';

import React, { useEffect, useRef } from 'react';
import { mountGalaxy } from './Galaxy.js';
import './galaxy.css';

export interface SkillsGalaxyProps {
  mode?: 'auto' | 'scrub';
  className?: string;
  skill?: string;
}

export default function SkillsGalaxy(props: SkillsGalaxyProps = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const g = mountGalaxy(ref.current, props);
    return () => g.dispose();
  }, [props.mode]);

  return (
    <section
      ref={ref}
      className={props.className}
      aria-label="Skills galaxy"
    />
  );
}
