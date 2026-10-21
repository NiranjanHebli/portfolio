'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { PERSONA } from '@/lib/persona';

export interface BadgeProps {
  isHovered: boolean;
  isDragging: boolean;
  hoverLocalPoint: THREE.Vector2;
}

/**
 * Draws the ultra-clean front face of the ID badge onto the canvas context.
 * Integrates Niranjan's portrait photo into the photo frame.
 */
function drawCardFront(ctx: CanvasRenderingContext2D, img?: HTMLImageElement | null) {
  ctx.clearRect(0, 0, 1024, 1500);

  // 1. Deep space/slate base background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1500);
  bgGrad.addColorStop(0, '#060a14');
  bgGrad.addColorStop(0.35, '#0b1325');
  bgGrad.addColorStop(0.7, '#080d1a');
  bgGrad.addColorStop(1, '#04070d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1500);

  // 2. Subtle ambient radial glow
  const radialGlow = ctx.createRadialGradient(512, 540, 40, 512, 540, 560);
  radialGlow.addColorStop(0, 'rgba(14, 165, 233, 0.09)');
  radialGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.025)');
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, 1024, 1500);

  // 3. Subtle micro-grid watermark
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = 64; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
  for (let y = 100; y < 1440; y += 64) {
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }

  // 4. Card outer border stroke
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(28, 28, 968, 1444, 24);
  ctx.stroke();

  // 5. Top lanyard slot cutout
  ctx.fillStyle = '#02050a';
  ctx.beginPath();
  ctx.roundRect(412, 34, 200, 32, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6. Glowing top header accent stripe
  const accentGrad = ctx.createLinearGradient(64, 0, 960, 0);
  accentGrad.addColorStop(0, '#0284c7');
  accentGrad.addColorStop(0.5, '#38bdf8');
  accentGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(64, 88, 896, 4);

  // 7. Institution Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText('AI & SYSTEMS ENGINEERING', 512, 140);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('AUTONOMOUS AGENTS  //  AGENTIC WORKFLOWS & GENAI', 512, 178);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 208);
  ctx.lineTo(944, 208);
  ctx.stroke();

  // 8. Student Avatar Portrait Frame (Circular)
  const photoCenterX = 512;
  const photoCenterY = 430;
  const photoRadius = 185;

  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
  ctx.clip();

  // White base behind circular portrait
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    photoCenterX - photoRadius,
    photoCenterY - photoRadius,
    photoRadius * 2,
    photoRadius * 2
  );

  if (img && img.complete && img.naturalWidth > 0) {
    // Draw user's authentic portrait photo centered & fitted inside circle
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      photoCenterX - photoRadius,
      photoCenterY - photoRadius,
      photoRadius * 2,
      photoRadius * 2
    );
  } else {
    // Clean fallback while photo loads
    const photoBg = ctx.createLinearGradient(
      photoCenterX,
      photoCenterY - photoRadius,
      photoCenterX,
      photoCenterY + photoRadius
    );
    photoBg.addColorStop(0, '#0c1a30');
    photoBg.addColorStop(1, '#060a14');
    ctx.fillStyle = photoBg;
    ctx.fillRect(
      photoCenterX - photoRadius,
      photoCenterY - photoRadius,
      photoRadius * 2,
      photoRadius * 2
    );

    const avatarGrad = ctx.createRadialGradient(
      photoCenterX,
      photoCenterY - 30,
      16,
      photoCenterX,
      photoCenterY - 20,
      80
    );
    avatarGrad.addColorStop(0, '#7dd3fc');
    avatarGrad.addColorStop(0.5, '#0284c7');
    avatarGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = avatarGrad;

    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY - 30, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY + 160, 128, Math.PI * 1.16, Math.PI * 1.84);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NH', photoCenterX, photoCenterY - 20);
  }
  ctx.restore();

  // Outer primary glowing circular border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Outer secondary concentric halo ring
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(photoCenterX, photoCenterY, photoRadius + 8, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle circular tech tick marks at 0, 90, 180, 270 deg
  const tickDist = photoRadius + 14;
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 2.5;
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle) => {
    const x1 = photoCenterX + Math.cos(angle) * (photoRadius + 4);
    const y1 = photoCenterY + Math.sin(angle) * (photoRadius + 4);
    const x2 = photoCenterX + Math.cos(angle) * tickDist;
    const y2 = photoCenterY + Math.sin(angle) * tickDist;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // 9. Student Name
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 62px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(PERSONA.shortName, 512, 705);

  // 10. Engineer Status Pill
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.beginPath();
  ctx.roundRect(332, 742, 360, 64, 32);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px monospace';
  ctx.fillText('AI ENGINEER', 512, 783);

  // 11. Role & Architecture Details
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Autonomous Systems & Scalable GenAI', 512, 865);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px monospace';
  ctx.fillText('LangGraph | CrewAI | Dual MCP | Hybrid RAG', 512, 910);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 23px monospace';
  ctx.fillText('* CURRENTLY STUDYING AT IIT KGP  (2026 - 2028) *', 512, 958);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 1005);
  ctx.lineTo(914, 1005);
  ctx.stroke();

  // 12. Clean Engineering Verification Grid Box
  const cardBoxX = 72;
  const cardBoxY = 1045;
  const cardBoxW = 880;
  const cardBoxH = 360;
  const cardBoxR = 20;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(cardBoxX, cardBoxY, cardBoxW, cardBoxH, cardBoxR);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3-Column details layout inside verification box
  const cols = [
    { label: 'SPECIALIZATION', val: 'Agentic Systems', sub: 'Stateful Workflows', x: 220 },
    { label: 'ARCHITECTURE', val: 'Multi-Agent & RAG', sub: 'Enterprise Inference', x: 512 },
    { label: 'ROLE', val: 'AI Engineer', sub: 'Autonomous Systems', x: 804 },
  ];

  cols.forEach((col) => {
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(col.label, col.x, cardBoxY + 68);

    ctx.fillStyle = col.label === 'ROLE' ? '#34d399' : '#f8fafc';
    ctx.font = 'bold 27px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(col.val, col.x, cardBoxY + 115);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '19px monospace';
    ctx.fillText(col.sub, col.x, cardBoxY + 155);
  });

  // Vertical separators between columns
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
  ctx.lineWidth = 1.5;
  [366, 658].forEach((divX) => {
    ctx.beginPath();
    ctx.moveTo(divX, cardBoxY + 35);
    ctx.lineTo(divX, cardBoxY + 175);
    ctx.stroke();
  });

  // Horizontal divider inside box
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardBoxX + 32, cardBoxY + 205);
  ctx.lineTo(cardBoxX + cardBoxW - 32, cardBoxY + 205);
  ctx.stroke();

  // Academic Motto / Clean verification text
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 21px monospace';
  ctx.fillText('PRODUCTION MULTI-AGENT ORCHESTRATION & STATEFUL INFERENCE', 512, cardBoxY + 258);

  ctx.fillStyle = '#64748b';
  ctx.font = '18px monospace';
  ctx.fillText('NIRANJAN HEBLI  |  AI ENGINEER  |  PONDA - GOA / INDIA', 512, cardBoxY + 305);
}

/**
 * Generates an ultra-clean procedural back texture displaying Niranjan's contact information.
 */
function createCardBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d')!;

  // 1. Matching dark space/slate base background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1500);
  bgGrad.addColorStop(0, '#060a14');
  bgGrad.addColorStop(0.35, '#0b1325');
  bgGrad.addColorStop(0.7, '#080d1a');
  bgGrad.addColorStop(1, '#04070d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1500);

  // 2. Subtle ambient radial glow
  const radialGlow = ctx.createRadialGradient(512, 600, 40, 512, 600, 560);
  radialGlow.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
  radialGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.025)');
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, 1024, 1500);

  // 3. Subtle micro-grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = 64; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
  for (let y = 100; y < 1440; y += 64) {
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }

  // 4. Card outer border stroke
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(28, 28, 968, 1444, 24);
  ctx.stroke();

  // 5. Top lanyard slot cutout
  ctx.fillStyle = '#02050a';
  ctx.beginPath();
  ctx.roundRect(412, 34, 200, 32, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6. Glowing top header accent stripe
  const accentGrad = ctx.createLinearGradient(64, 0, 960, 0);
  accentGrad.addColorStop(0, '#0284c7');
  accentGrad.addColorStop(0.5, '#38bdf8');
  accentGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(64, 88, 896, 4);

  // 7. Header Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('AI ENGINEER PROFILE', 512, 144);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 21px monospace';
  ctx.fillText('NIRANJAN HEBLI  //  CONNECT & COLLABORATE', 512, 182);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 212);
  ctx.lineTo(944, 212);
  ctx.stroke();

  // 8. Contact Detail Cards (Clean, high-contrast, perfectly organized)
  const contactItems = [
    {
      badge: 'EMAIL',
      badgeColor: '#38bdf8',
      label: 'PRIMARY EMAIL',
      value: PERSONA.email,
    },
    {
      badge: 'LINKEDIN',
      badgeColor: '#38bdf8',
      label: 'LINKEDIN PROFILE',
      value: 'linkedin.com/in/niranjan-hebli-333211211',
    },
    {
      badge: 'GITHUB',
      badgeColor: '#a78bfa',
      label: 'GITHUB REPOSITORY',
      value: 'github.com/NiranjanHebli',
    },
    {
      badge: 'LOCATION',
      badgeColor: '#f59e0b',
      label: 'LOCATION / RESIDENCE',
      value: PERSONA.location,
    },
  ];

  const rowX = 72;
  const rowW = 880;
  const rowH = 136;
  let currentY = 250;

  contactItems.forEach((item) => {
    // Row background container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(rowX, currentY, rowW, rowH, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Badge pill on left
    const badgeW = 150;
    const badgeH = 64;
    const badgeX = rowX + 28;
    const badgeY = currentY + (rowH - badgeH) / 2;

    ctx.fillStyle = 'rgba(15, 30, 52, 0.9)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
    ctx.fill();

    ctx.strokeStyle = item.badgeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = item.badgeColor;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(item.badge, badgeX + badgeW / 2, badgeY + 40);

    // Text fields on right
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(item.label, rowX + 210, currentY + 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(item.value, rowX + 210, currentY + 92);

    currentY += rowH + 26;
  });

  // 9. Footer Info Card on Back
  const footerBoxX = 72;
  const footerBoxY = 920;
  const footerBoxW = 880;
  const footerBoxH = 480;
  const footerBoxR = 20;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(footerBoxX, footerBoxY, footerBoxW, footerBoxH, footerBoxR);
  ctx.fill();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px monospace';
  ctx.fillText('ENGINEERING CAPABILITIES & FOCUS', 512, footerBoxY + 75);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Stateful multi-agent systems, real-time inference & autonomous workflows.', 512, footerBoxY + 140);
  ctx.fillText('LangGraph | CrewAI over Dual MCP (SSE & Stdio) | Ragas Hybrid RAG.', 512, footerBoxY + 185);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('* OPEN FOR HIGH-IMPACT AI ENGINEERING & SYSTEMS ROLES *', 512, footerBoxY + 265);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(footerBoxX + 40, footerBoxY + 320);
  ctx.lineTo(footerBoxX + footerBoxW - 40, footerBoxY + 320);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px monospace';
  ctx.fillText('Response Time: Within 24 Hours | Email & LinkedIn Preferred', 512, footerBoxY + 370);

  ctx.fillStyle = '#64748b';
  ctx.font = '17px monospace';
  ctx.fillText('NIRANJAN HEBLI  |  AI ENGINEER  |  PONDA - GOA / INDIA', 512, footerBoxY + 415);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function Badge({ isHovered: _isHovered, isDragging: _isDragging }: BadgeProps) {
  const { frontTexture, backTexture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d')!;

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;

    // Load authentic user portrait photo
    const img = new Image();
    img.src = '/profile-photo.png';

    const render = () => {
      drawCardFront(ctx, img);
      tex.needsUpdate = true;
    };

    render();

    if (!img.complete) {
      img.onload = () => {
        render();
      };
    }

    const backTex = createCardBackTexture();

    return { frontTexture: tex, backTexture: backTex };
  }, []);

  // Compact ID card dimensions (0.76 x 1.12) so the entire card + lanyard easily fits inside the screen
  const cardWidth = 0.76;
  const cardHeight = 1.12;
  const cardDepth = 0.02;

  return (
    <group>
      {/* Compact Brushed Chrome Swivel Clip & Ring Assembly at top of card */}
      <group position={[0, cardHeight / 2 + 0.012, 0]} scale={0.72}>
        <RoundedBox args={[0.28, 0.095, 0.048]} radius={0.014} smoothness={4} position={[0, -0.02, 0]}>
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
        </RoundedBox>

        <mesh position={[0, 0.052, 0]}>
          <torusGeometry args={[0.055, 0.012, 16, 32]} />
          <meshStandardMaterial color="#e4e4e7" metalness={0.9} roughness={0.22} envMapIntensity={1.2} />
        </mesh>

        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.036, 0.075, 24]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
        </mesh>

        <mesh position={[0, 0.175, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.042, 0.01, 14, 28, Math.PI]} />
          <meshStandardMaterial color="#f4f4f5" metalness={0.9} roughness={0.2} envMapIntensity={1.3} />
        </mesh>
      </group>

      {/* Main Polycarbonate Card Body */}
      <RoundedBox args={[cardWidth, cardHeight, cardDepth]} radius={0.028} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color="#0b111c"
          metalness={0.2}
          roughness={0.45}
        />
      </RoundedBox>

      {/* Front Printed Laminate Plane (clean, glare-free finish with photo) */}
      <mesh position={[0, 0, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[cardWidth - 0.022, cardHeight - 0.022]} />
        <meshStandardMaterial
          map={frontTexture}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Back Printed Laminate Plane (clean, glare-free finish with contact info) */}
      <mesh position={[0, 0, -(cardDepth / 2 + 0.001)]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardWidth - 0.022, cardHeight - 0.022]} />
        <meshStandardMaterial
          map={backTexture}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
