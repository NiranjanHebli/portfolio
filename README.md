# Portfolio

> **Interactive 3D Physics Lanyard & Cybernetic Dossier for an Agentic AI Systems Engineer.**  
> Built with Next.js 14, React Three Fiber, Three.js, Rapier WASM Physics, Zustand, and Tailwind CSS.

---

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Rapier Physics](https://img.shields.io/badge/Physics-Rapier%20WASM-red?style=for-the-badge)](https://rapier.rs/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## Overview

**Agentic Badge Portfolio** is an interactive, tactile portfolio interface styled as a high-security clearance terminal. At its core is a real-time 3D rigid-body physics simulation featuring a security credential card suspended from a dynamic braided lanyard.

Visitors can grab, drag, and fling the badge, inspect both sides in focus mode, trigger reactive agent state impulses, and explore the engineering persona, projects, Model Context Protocol (MCP) servers, and multi-agent orchestration architecture.

---

## Key Features

### 1. Real-Time 3D Physics Lanyard & Badge
- **Rapier WASM Rigid-Body Engine**: Multi-segment rope simulation connecting the anchor clip to the credential card with spherical and rope joints.
- **Tactile Drag & Fling**: Click and drag anywhere on the badge to pull the lanyard taut; releasing calculates pointer velocity and applies physical angular impulse and translational recoil.
- **Inspect & Flip Mode**: Transition smoothly between free-hanging physics mode and fixed-view inspection mode. Flip between the front clearance card and reverse telemetry layout.
- **Reactive Impulse Feedback**: Simulating AI agent states (`IDLE`, `THINKING`, `TOOL-CALLING`, `ERROR`) applies physical directional jolt impulses to the badge.

### 2. High-DPI Procedural Canvas Textures
- **Procedural Front & Back Textures**: Crisp, 1024x1620 procedural canvas generation with carbon weave background gradients, micro-grid lines, security cutouts, photo aperture, and clearance stamps.
- **Woven Lanyard Ribbon**: Repeating 2048x256 texture featuring cyan edge stitching and tactical typography (`AGENTIC AI | TOOL USE | RAG | MCP`).
- **Dynamic Lighting & Environment**: HDR ambient environment mapping with subtle rim lights and metallic/roughness tune-ups.

### 3. Cybernetic Clearance Dossier HUD
- **Telemetry HUD**: Left column displaying operative identity, clearance level (`LEVEL 5 / AGENT ARCHITECT`), technical summary, and core stack pills.
- **Interactive Control Deck**: Quick action toggles for Inspect Mode, Card Flip, and Agent State testing.
- **Zustand Reactive State**: Centralized state store managing badge interaction modes, agent telemetry, observability traces, and citation chips.

### 4. Performance & Accessibility
- **SSR-Safe Dynamic WebGL**: Three.js and Rapier components are dynamically loaded on the client side with custom loading spinners to eliminate SSR hydration mismatches.
- **Hardware Fallback**: Automatic WebGL detection displays a sleek fallback dossier on unsupported devices.
- **Keyboard Navigation**:
  - <kbd>Left Arrow</kbd> / <kbd>Right Arrow</kbd> : Flip card in inspect mode
  - <kbd>Esc</kbd> : Exit inspect mode and release badge back into physics world
- **Accessibility**: Listens to `prefers-reduced-motion` and supports Leva tuning controls via `?debug=1` or `?leva=1`.

---

## Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **3D Rendering** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Physics Engine** | Rapier WASM (`@react-three/rapier`), Maath interpolation |
| **State Management** | Zustand (Badge physics modes, agent trace timeline, UI state) |
| **Styling & UI** | Tailwind CSS, Lucide React icons, Framer Motion |
| **AI Ecosystem** | Model Context Protocol (MCP), LangGraph, CrewAI, Hybrid RAG |
| **Debugging** | Leva 3D GUI panel |

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/niranjan/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Controls & Interactions

| Action | Interaction |
|---|---|
| **Drag & Swing** | Click/tap and hold the badge, drag across the screen, then release. |
| **Inspect Badge** | Click the badge (without dragging) or click **"Inspect Badge"** in the HUD. |
| **Flip Card** | Press <kbd>Left Arrow</kbd> / <kbd>Right Arrow</kbd> or click **"Flip Card"** in the control panel. |
| **Exit Inspect** | Press <kbd>Esc</kbd> or toggle **"Exit Inspect (Physics)"**. |
| **Trigger Agent Impulse** | Click **"Agent State"** in the HUD to simulate tool execution or errors and watch the badge recoil physically. |
| **Open Debug GUI** | Append `?debug=1` or `?leva=1` to the URL for live physics tuning sliders (damping, stiffness, gravity, mass). |

---

## Customization Guide

### 1. Updating Persona & Experience Details
All persona information, projects, MCP server configurations, and clearance metadata are centralized in [`lib/persona.ts`](lib/persona.ts).

```typescript
export const PERSONA = {
  name: 'YOUR NAME',
  shortName: 'YOUR SHORT NAME',
  badgeId: 'AG-0942-LVL5',
  title: 'Agentic AI Engineer',
  clearance: 'LEVEL 5 / AGENT ARCHITECT',
  department: 'AUTONOMOUS SYSTEMS & MULTI-AGENT RUNTIME',
  // ...
};
```

### 2. Tuning 3D Physics
Physics constants (gravity, rope segment length, angular damping, restitution) can be adjusted in [`components/three/LanyardJoints.tsx`](components/three/LanyardJoints.tsx) or tuned dynamically via Leva with `?debug=1`.

### 3. Styling & Color Tokens
Tailwind colors (`terminal-bg`, `terminal-panel`, `terminal-cyan`, `terminal-emerald`) can be customized in [`tailwind.config.ts`](tailwind.config.ts).

### 4. Customizing the 3D Skills Galaxy
The interactive 3D skill visualizer (rendered at `/skills`) is powered by [`data/skills-galaxy.json`](data/skills-galaxy.json) and component architecture in [`components/skills/`](components/skills/).
- **Systems & Skills**: Each system specifies `type` (star, rocky, gas, orb, vision, ice, devops, cloud), position coordinates, timeline timings, palettes, and skills array.
- **Tour Modes**: Supports auto tour mode and scroll-scrub mode (`?mode=scrub`). Debug metrics and timeline controls can be opened via `?debug`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches Next.js development server with hot-reloading |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs Next.js ESLint checks |

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to adapt and build upon it for your own portfolio.
