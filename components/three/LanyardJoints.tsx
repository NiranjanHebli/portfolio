'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { useControls } from 'leva';
import { easing } from 'maath';
import { Badge } from './Badge';
import { usePortfolioStore } from '@/lib/store';

interface PointerSample {
  pos: THREE.Vector3;
  time: number;
}

/**
 * Generates the repeating lanyard strap CanvasTexture.
 */
function createLanyardStrapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0b101b';
  ctx.fillRect(0, 0, 2048, 256);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, 14, 2048, 8);
  ctx.fillRect(0, 234, 2048, 8);

  ctx.fillStyle = '#0b101b';
  for (let x = 0; x < 2048; x += 32) {
    ctx.fillRect(x, 12, 12, 12);
    ctx.fillRect(x, 232, 12, 12);
  }

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 76px monospace';
  ctx.textBaseline = 'middle';
  const label = 'IIT KHARAGPUR  |  COMPUTER SCIENCE & ENGINEERING  |  ';
  ctx.fillText(label, 36, 130);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a procedural woven nylon twill normal map.
 */
function createWovenFabricNormalMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = (x + y * 0.5) * 0.45;
      const v = (y - x * 0.5) * 0.45;
      const nx = Math.sin(u) * 0.35;
      const ny = Math.cos(v) * 0.35;
      const nz = 0.87;

      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const normalTex = new THREE.CanvasTexture(canvas);
  normalTex.wrapS = THREE.RepeatWrapping;
  normalTex.wrapT = THREE.RepeatWrapping;
  normalTex.anisotropy = 8;
  normalTex.needsUpdate = true;
  return normalTex;
}

export function LanyardJoints() {
  const { viewport, camera, gl } = useThree();

  const badgeMode = usePortfolioStore((s) => s.badgeMode);
  const setBadgeMode = usePortfolioStore((s) => s.setBadgeMode);
  const badgeSide = usePortfolioStore((s) => s.badgeSide);
  const setBadgeSide = usePortfolioStore((s) => s.setBadgeSide);
  const isHovered = usePortfolioStore((s) => s.isHovered);
  const setIsHovered = usePortfolioStore((s) => s.setIsHovered);
  const lowEndGpu = usePortfolioStore((s) => s.lowEndGpu);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  const physicsConfig = useControls('Badge Physics & Lanyard', {
    mass: { value: 0.75, min: 0.2, max: 3.0, step: 0.05 },
    linearDamping: { value: 1.8, min: 0.1, max: 6.0, step: 0.1 },
    angularDamping: { value: 2.2, min: 0.1, max: 6.0, step: 0.1 },
    restitution: { value: 0.3, min: 0.0, max: 1.0, step: 0.05 },
    dragSpring: { value: 26.0, min: 5.0, max: 45.0, step: 1.0 },
    elasticReturnSpring: { value: 18.0, min: 5.0, max: 40.0, step: 1.0 },
    pullRecoilMultiplier: { value: 4.2, min: 0.5, max: 10.0, step: 0.2 },
    flingMultiplier: { value: 1.15, min: 0.2, max: 3.0, step: 0.05 },
    maxVelocity: { value: 18.0, min: 5.0, max: 35.0, step: 1.0 },
    strapWidth: { value: 0.095, min: 0.06, max: 0.22, step: 0.005 },
    uvScrollSpeed: { value: 0.0, min: 0.0, max: 0.4, step: 0.01 },
  });
  const physicsConfigRef = useRef(physicsConfig);
  physicsConfigRef.current = physicsConfig;

  // 1 fixed top anchor + 4 intermediate rope joints + 1 card body = 6 bodies
  const anchorRef = useRef<RapierRigidBody>(null!);
  const j1Ref = useRef<RapierRigidBody>(null!);
  const j2Ref = useRef<RapierRigidBody>(null!);
  const j3Ref = useRef<RapierRigidBody>(null!);
  const j4Ref = useRef<RapierRigidBody>(null!);
  const cardRef = useRef<RapierRigidBody>(null!);

  // Visual Three.js group inside cardRef so we can zoom/scale & rotate it while Physics is 100% paused
  const visualCardGroupRef = useRef<THREE.Group>(null!);

  const REST_CARD_Y = 0.26;
  const ANCHOR_Y = 1.68;
  const clipTopLocalY = 0.69;

  const smoothedJoints = useRef<THREE.Vector3[]>([
    new THREE.Vector3(0, ANCHOR_Y, 0),
    new THREE.Vector3(0, 1.50, 0),
    new THREE.Vector3(0, 1.32, 0),
    new THREE.Vector3(0, 1.14, 0),
    new THREE.Vector3(0, 0.96, 0),
    new THREE.Vector3(0, 0.95, 0),
  ]);

  const segLen = 0.34;
  useRopeJoint(anchorRef, j1Ref, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(j1Ref, j2Ref, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(j2Ref, j3Ref, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(j3Ref, j4Ref, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(anchorRef, j4Ref, [[0, 0, 0], [0, 0, 0], 1.65]);
  useSphericalJoint(j4Ref, cardRef, [
    [0, 0, 0],
    [0, clipTopLocalY, 0],
  ]);

  // Pointer & Drag state
  const [isDraggingPhysics, setIsDraggingPhysics] = useState(false);
  const pointerDownInfoRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    hasExceededClickThreshold: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    hasExceededClickThreshold: false,
  });

  const hoverLocalPointRef = useRef(new THREE.Vector2(0, 0));
  const grabOffsetRef = useRef(new THREE.Vector3());
  const dragDepthRef = useRef(0);
  const pointerHistoryRef = useRef<PointerSample[]>([]);

  // Inspect Mode rotation state (controlled ONLY by mouse drag when zoomed in)
  const inspectBaseYawRef = useRef(0);
  const inspectDragDeltaXRef = useRef(0);
  const isInspectRotatingRef = useRef(false);
  const inspectRotateStartXRef = useRef(0);

  const raycasterPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const unprojectRay = useMemo(() => new THREE.Raycaster(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // When entering Inspect Mode, start flat on the current side
  useEffect(() => {
    if (badgeMode === 'inspecting') {
      setIsDraggingPhysics(false);
      pointerDownInfoRef.current.isDown = false;
      inspectBaseYawRef.current = badgeSide === 'back' ? Math.PI : 0;
      inspectDragDeltaXRef.current = 0;
    }
  }, [badgeMode]);

  // Sync rotation if badgeSide is toggled via the Flip button below the card
  useEffect(() => {
    if (badgeMode !== 'inspecting') return;
    const currentStep = Math.abs(Math.round(inspectBaseYawRef.current / Math.PI)) % 2;
    const currentSide = currentStep === 1 ? 'back' : 'front';
    if (currentSide !== badgeSide) {
      inspectBaseYawRef.current += Math.PI;
    }
  }, [badgeSide, badgeMode]);

  // Window-level mouse rotation handler when in zoomed-in Inspect Mode:
  // Dragging the mouse left or right rotates the stationary zoomed card and flips it to the back/front!
  useEffect(() => {
    if (badgeMode !== 'inspecting') return;

    const onPointerDownWindow = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('button, a, input, textarea, select')) return;

      isInspectRotatingRef.current = true;
      inspectRotateStartXRef.current = e.clientX;
      inspectDragDeltaXRef.current = 0;
      document.body.style.cursor = 'grabbing';
    };

    const onPointerMoveWindow = (e: PointerEvent) => {
      if (!isInspectRotatingRef.current) return;
      inspectDragDeltaXRef.current = e.clientX - inspectRotateStartXRef.current;
    };

    const onPointerUpWindow = () => {
      if (!isInspectRotatingRef.current) return;
      isInspectRotatingRef.current = false;
      document.body.style.cursor = 'grab';

      const deltaX = inspectDragDeltaXRef.current;
      inspectDragDeltaXRef.current = 0;

      // If the user dragged left or right with their mouse (> 24px), flip the card 180 degrees in that direction
      if (Math.abs(deltaX) > 24) {
        const dir = deltaX > 0 ? 1 : -1;
        inspectBaseYawRef.current += dir * Math.PI;
        const normalizedStep = Math.abs(Math.round(inspectBaseYawRef.current / Math.PI)) % 2;
        setBadgeSide(normalizedStep === 1 ? 'back' : 'front');
      }
    };

    window.addEventListener('pointerdown', onPointerDownWindow);
    window.addEventListener('pointermove', onPointerMoveWindow);
    window.addEventListener('pointerup', onPointerUpWindow);

    return () => {
      window.removeEventListener('pointerdown', onPointerDownWindow);
      window.removeEventListener('pointermove', onPointerMoveWindow);
      window.removeEventListener('pointerup', onPointerUpWindow);
      document.body.style.cursor = 'auto';
    };
  }, [badgeMode, setBadgeSide]);

  const strapMap = useMemo(() => createLanyardStrapTexture(), []);
  const strapNormalMap = useMemo(() => createWovenFabricNormalMap(), []);

  const ribbonSegments = lowEndGpu ? 32 : 56;
  const ribbonCurve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(
      smoothedJoints.current.map((v) => v.clone())
    );
    c.curveType = 'chordal';
    return c;
  }, []);

  const ribbonGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertexCount = (ribbonSegments + 1) * 2;
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    for (let i = 0; i < ribbonSegments; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }

    for (let i = 0; i <= ribbonSegments; i++) {
      const u = i / ribbonSegments;
      uvs[i * 4] = u;
      uvs[i * 4 + 1] = 0;
      uvs[i * 4 + 2] = u;
      uvs[i * 4 + 3] = 1;

      normals[i * 6 + 2] = 1;
      normals[i * 6 + 5] = 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }, [ribbonSegments]);

  const wakeAllBodies = () => {
    anchorRef.current?.wakeUp();
    j1Ref.current?.wakeUp();
    j2Ref.current?.wakeUp();
    j3Ref.current?.wakeUp();
    j4Ref.current?.wakeUp();
    cardRef.current?.wakeUp();
  };

  useEffect(() => {
    const domEl = gl.domElement;
    if (!domEl) return;

    if (isDraggingPhysics) {
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      domEl.style.touchAction = 'none';
    } else if (isHovered || badgeMode === 'inspecting') {
      document.body.style.cursor = 'grab';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      domEl.style.touchAction = 'pan-y';
    } else {
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      domEl.style.touchAction = 'pan-y';
    }
  }, [isDraggingPhysics, isHovered, badgeMode, gl.domElement]);

  const getWorldPointAtDepth = (ndcX: number, ndcY: number, targetZ: number, out: THREE.Vector3) => {
    raycasterPlane.set(new THREE.Vector3(0, 0, 1), -targetZ);
    unprojectRay.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    unprojectRay.ray.intersectPlane(raycasterPlane, out);
    return out;
  };

  const dragNdcRef = useRef(new THREE.Vector2(0, 0));

  const getNdcFromClient = (clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const ndcX = ((clientX - rect.left) / width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / height) * 2 + 1;
    return { ndcX, ndcY };
  };

  // Window-level pointer tracking once the user presses down on the 3D card:
  // Allows pulling the card smoothly across the entire screen (including above the left panel)
  useEffect(() => {
    if (badgeMode === 'inspecting') return;

    const onWindowMove = (e: PointerEvent) => {
      if (!pointerDownInfoRef.current.isDown) return;

      const travelPx = Math.hypot(
        e.clientX - pointerDownInfoRef.current.startX,
        e.clientY - pointerDownInfoRef.current.startY
      );

      if (!pointerDownInfoRef.current.hasExceededClickThreshold && travelPx > 14) {
        pointerDownInfoRef.current.hasExceededClickThreshold = true;
        wakeAllBodies();
        setIsDraggingPhysics(true);
        setBadgeMode('dragging');
      }

      if (pointerDownInfoRef.current.hasExceededClickThreshold) {
        const now = performance.now();
        const { ndcX, ndcY } = getNdcFromClient(e.clientX, e.clientY);
        dragNdcRef.current.set(ndcX, ndcY);
        const worldPt = getWorldPointAtDepth(ndcX, ndcY, dragDepthRef.current, tempVec).clone();

        pointerHistoryRef.current.push({ pos: worldPt, time: now });
        pointerHistoryRef.current = pointerHistoryRef.current.filter((s) => now - s.time <= 120);
      }
    };

    const onWindowUp = () => {
      if (!pointerDownInfoRef.current.isDown) return;

      const wasPulling = pointerDownInfoRef.current.hasExceededClickThreshold;
      pointerDownInfoRef.current.isDown = false;
      pointerDownInfoRef.current.hasExceededClickThreshold = false;
      setIsDraggingPhysics(false);

      // If the user clicked the card without pulling (< 14px), enter zoomed, stationary Inspect Mode!
      if (!wasPulling) {
        if (cardRef.current) {
          cardRef.current.setTranslation({ x: 0, y: REST_CARD_Y, z: 0 }, true);
          cardRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
          cardRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          cardRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

          const restJointsY = [1.50, 1.32, 1.14, 0.96];
          [j1Ref.current, j2Ref.current, j3Ref.current, j4Ref.current].forEach((b, idx) => {
            if (!b) return;
            b.setTranslation({ x: 0, y: restJointsY[idx], z: 0 }, true);
            b.setLinvel({ x: 0, y: 0, z: 0 }, true);
            b.setAngvel({ x: 0, y: 0, z: 0 }, true);
          });
        }
        setBadgeMode('inspecting');
        return;
      }

      // Otherwise, the user pulled the card and released it: resume hanging physics with recoil!
      setBadgeMode('hanging');

      if (cardRef.current) {
        const cfg = physicsConfigRef.current;
        const cardPos = cardRef.current.translation();
        const pullDx = 0 - cardPos.x;
        const pullDy = REST_CARD_Y - cardPos.y;
        const pullDz = 0 - cardPos.z;

        let vx = pullDx * cfg.pullRecoilMultiplier;
        let vy = pullDy * cfg.pullRecoilMultiplier;
        let vz = pullDz * cfg.pullRecoilMultiplier;

        const samples = pointerHistoryRef.current;
        if (samples.length >= 2) {
          const oldest = samples[0];
          const latest = samples[samples.length - 1];
          const dtSec = Math.max(0.016, (latest.time - oldest.time) / 1000);

          vx += ((latest.pos.x - oldest.pos.x) / dtSec) * cfg.flingMultiplier * 0.55;
          vy += ((latest.pos.y - oldest.pos.y) / dtSec) * cfg.flingMultiplier * 0.55;
        }

        vx = THREE.MathUtils.clamp(vx, -cfg.maxVelocity, cfg.maxVelocity);
        vy = THREE.MathUtils.clamp(vy, -cfg.maxVelocity, cfg.maxVelocity);
        vz = THREE.MathUtils.clamp(vz, -cfg.maxVelocity * 0.4, cfg.maxVelocity * 0.4);

        cardRef.current.wakeUp();
        cardRef.current.setLinvel({ x: vx, y: vy, z: vz }, true);

        const spinY = THREE.MathUtils.clamp(
          vx * 0.08 + grabOffsetRef.current.x * vy * 0.18 - pullDx * 0.45,
          -2.8,
          2.8
        );
        const spinX = THREE.MathUtils.clamp(-vy * 0.035 + pullDy * 0.15, -0.9, 0.9);
        const spinZ = THREE.MathUtils.clamp(-pullDx * 0.25, -0.9, 0.9);
        cardRef.current.applyTorqueImpulse({ x: spinX, y: spinY, z: spinZ }, true);
      }
    };

    window.addEventListener('pointermove', onWindowMove);
    window.addEventListener('pointerup', onWindowUp);
    return () => {
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('pointerup', onWindowUp);
    };
  }, [badgeMode, setBadgeMode]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0 || badgeMode === 'inspecting') return;
    e.stopPropagation();

    if (!cardRef.current) return;
    const cardPos = cardRef.current.translation();
    dragDepthRef.current = cardPos.z;

    const { ndcX, ndcY } = getNdcFromClient(e.clientX, e.clientY);
    dragNdcRef.current.set(ndcX, ndcY);

    grabOffsetRef.current.set(
      e.point.x - cardPos.x,
      e.point.y - cardPos.y,
      e.point.z - cardPos.z
    );

    // Do NOT start dragging physics immediately on pointerdown so a normal click doesn't move the card!
    pointerDownInfoRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      hasExceededClickThreshold: false,
    };

    pointerHistoryRef.current = [
      {
        pos: new THREE.Vector3(e.point.x, e.point.y, cardPos.z),
        time: performance.now(),
      },
    ];
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!cardRef.current) return;
    const cardPos = cardRef.current.translation();
    const relX = THREE.MathUtils.clamp((e.point.x - cardPos.x) / 0.38, -1, 1);
    const relY = THREE.MathUtils.clamp((e.point.y - cardPos.y) / 0.56, -1, 1);
    hoverLocalPointRef.current.set(relX, relY);
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const card = cardRef.current;
    const anchor = anchorRef.current;
    const visualGroup = visualCardGroupRef.current;
    if (!card || !anchor || !visualGroup) return;

    // On desktop (>=960px canvas width), the Canvas spans 100% of <main> so the card can be dragged OVER the left panel.
    // Offset camera.x to the left by a fixed world-unit distance (-0.82) so the resting card (x = 0) sits centered in the right-hand columns.
    const isWideDesktop = state.size.width >= 960;
    const camOffsetX = isWideDesktop ? -0.82 : 0;
    const inspectCamOffsetX = isWideDesktop ? -0.58 : 0;

    // ========================================================================
    // A. ZOOMED & STATIONARY INSPECT MODE (When Card is Clicked)
    //    - Physics is paused in Scene.tsx (collar and card do NOT move)
    //    - Directly straighten & center the Three.js RigidBody group and lanyard
    //      so clicking a swinging card in physics mode never leaves it tilted or offset
    //    - Camera zooms in and visualGroup scales up so card is bigger
    //    - Rotating with mouse or Flip button turns visualGroup around Y (Front <-> Back)
    // ========================================================================
    if (badgeMode === 'inspecting') {
      // 1. Ensure Rapier bodies stay at straight vertical rest with zero velocity
      card.setTranslation({ x: 0, y: REST_CARD_Y, z: 0 }, false);
      card.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false);
      card.setLinvel({ x: 0, y: 0, z: 0 }, false);
      card.setAngvel({ x: 0, y: 0, z: 0 }, false);

      const restJointsY = [1.50, 1.32, 1.14, 0.96];
      [j1Ref.current, j2Ref.current, j3Ref.current, j4Ref.current].forEach((b, idx) => {
        if (!b) return;
        b.setTranslation({ x: 0, y: restJointsY[idx], z: 0 }, false);
        b.setLinvel({ x: 0, y: 0, z: 0 }, false);
        b.setAngvel({ x: 0, y: 0, z: 0 }, false);
      });

      // 2. Directly straighten the Three.js parent group of the RigidBody (since Physics is paused)
      if (visualGroup.parent) {
        easing.damp3(visualGroup.parent.position, [0, REST_CARD_Y, 0], 0.08, dt);
        easing.dampQ(visualGroup.parent.quaternion, new THREE.Quaternion(0, 0, 0, 1), 0.08, dt);
      }

      // 3. Zoom camera in while keeping full card + bottom controls in view
      easing.damp3(state.camera.position, [inspectCamOffsetX, 0.24, 3.35], 0.12, dt);

      // 4. Scale the card up and move it down slightly from the clip so the top is never clipped
      easing.damp3(visualGroup.scale, [1.15, 1.15, 1.15], 0.12, dt);
      easing.damp3(visualGroup.position, [0, -0.105, 0], 0.12, dt);

      // 5. Apply ONLY the user's mouse/flip rotation around the vertical Y axis
      const liveDragAngle = isInspectRotatingRef.current ? inspectDragDeltaXRef.current * 0.015 : 0;
      const targetWorldYaw = inspectBaseYawRef.current + liveDragAngle;
      const desiredWorldQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, targetWorldYaw, 0, 'YXZ')
      );
      easing.dampQ(visualGroup.quaternion, desiredWorldQuat, 0.1, dt);

      // 6. Straighten the lanyard collar to the vertical centerline above the clip and keep it stationary
      const inspectTargetsY = [ANCHOR_Y, 1.50, 1.32, 1.14, 0.96, REST_CARD_Y + clipTopLocalY];
      smoothedJoints.current.forEach((pt, idx) => {
        pt.x = THREE.MathUtils.lerp(pt.x, 0, Math.min(1, dt * 25));
        pt.y = THREE.MathUtils.lerp(pt.y, inspectTargetsY[idx], Math.min(1, dt * 25));
        pt.z = THREE.MathUtils.lerp(pt.z, 0, Math.min(1, dt * 25));
      });

      ribbonCurve.points.forEach((pt, idx) => {
        pt.copy(smoothedJoints.current[idx]);
      });

      const posAttr = ribbonGeometry.getAttribute('position') as THREE.BufferAttribute;
      const normAttr = ribbonGeometry.getAttribute('normal') as THREE.BufferAttribute;
      const halfWidth = physicsConfig.strapWidth * 0.5;
      const sideVec = new THREE.Vector3(1, 0, 0);
      const ptOnCurve = new THREE.Vector3();
      const tangent = new THREE.Vector3();
      const normalVec = new THREE.Vector3();

      for (let i = 0; i <= ribbonSegments; i++) {
        const u = i / ribbonSegments;
        ribbonCurve.getPoint(u, ptOnCurve);
        ribbonCurve.getTangent(u, tangent);
        normalVec.crossVectors(tangent, sideVec).normalize();

        posAttr.setXYZ(
          i * 2,
          ptOnCurve.x - sideVec.x * halfWidth,
          ptOnCurve.y - sideVec.y * halfWidth,
          ptOnCurve.z - sideVec.z * halfWidth
        );
        posAttr.setXYZ(
          i * 2 + 1,
          ptOnCurve.x + sideVec.x * halfWidth,
          ptOnCurve.y + sideVec.y * halfWidth,
          ptOnCurve.z + sideVec.z * halfWidth
        );

        normAttr.setXYZ(i * 2, normalVec.x, normalVec.y, normalVec.z);
        normAttr.setXYZ(i * 2 + 1, normalVec.x, normalVec.y, normalVec.z);
      }

      posAttr.needsUpdate = true;
      normAttr.needsUpdate = true;

      const curveLen = Math.max(0.35, ribbonCurve.getLength());
      strapMap.repeat.set(curveLen * 1.8, 1);
      strapNormalMap.repeat.set(curveLen * 14, 2);

      return;
    }

    // ========================================================================
    // B. NORMAL PHYSICS MODE (Camera at normal distance, scale = 1, position = 0)
    // ========================================================================
    easing.damp3(state.camera.position, [camOffsetX, 0.25, 4.8], 0.14, dt);
    easing.damp3(visualGroup.scale, [1, 1, 1], 0.14, dt);
    easing.damp3(visualGroup.position, [0, 0, 0], 0.14, dt);
    easing.dampQ(visualGroup.quaternion, new THREE.Quaternion(0, 0, 0, 1), 0.14, dt);

    const curAnchor = anchor.translation();
    anchor.setNextKinematicTranslation({
      x: THREE.MathUtils.lerp(curAnchor.x, 0, dt * 10),
      y: THREE.MathUtils.lerp(curAnchor.y, ANCHOR_Y, dt * 10),
      z: 0,
    });

    const cardPos = card.translation();
    const cardRot = card.rotation();

    // Active pointer pull/drag (can be pulled all the way across the left panel!)
    if (isDraggingPhysics) {
      wakeAllBodies();
      const targetWorld = getWorldPointAtDepth(
        dragNdcRef.current.x,
        dragNdcRef.current.y,
        dragDepthRef.current,
        tempVec
      );

      const desiredX = THREE.MathUtils.clamp(
        targetWorld.x - grabOffsetRef.current.x,
        isWideDesktop ? -2.65 : -viewport.width * 0.45,
        isWideDesktop ? 1.15 : viewport.width * 0.45
      );
      const desiredY = THREE.MathUtils.clamp(
        targetWorld.y - grabOffsetRef.current.y,
        -1.05,
        0.95
      );
      const desiredZ = THREE.MathUtils.clamp(
        targetWorld.z - grabOffsetRef.current.z,
        -0.6,
        1.1
      );

      const vx = THREE.MathUtils.clamp(
        (desiredX - cardPos.x) * physicsConfig.dragSpring,
        -physicsConfig.maxVelocity,
        physicsConfig.maxVelocity
      );
      const vy = THREE.MathUtils.clamp(
        (desiredY - cardPos.y) * physicsConfig.dragSpring,
        -physicsConfig.maxVelocity,
        physicsConfig.maxVelocity
      );
      const vz = THREE.MathUtils.clamp(
        (desiredZ - cardPos.z) * physicsConfig.dragSpring,
        -physicsConfig.maxVelocity,
        physicsConfig.maxVelocity
      );

      card.setLinvel({ x: vx, y: vy, z: vz }, true);

      // Update intermediate joints along the pulled line so the collar stretches smoothly with the pull
      const bodies = [j1Ref.current, j2Ref.current, j3Ref.current, j4Ref.current];
      bodies.forEach((b, i) => {
        if (!b) return;
        const frac = (i + 1) / 4;
        const targetJX = cardPos.x * frac;
        const targetJY = THREE.MathUtils.lerp(ANCHOR_Y, cardPos.y + clipTopLocalY, frac);
        const targetJZ = cardPos.z * frac;
        const jt = b.translation();
        b.setLinvel(
          {
            x: (targetJX - jt.x) * 24,
            y: (targetJY - jt.y) * 24,
            z: (targetJZ - jt.z) * 24,
          },
          true
        );
      });

      const pullAngleZ = THREE.MathUtils.clamp(-desiredX * 0.28, -0.45, 0.45);
      const curQuat = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      const baseYaw = badgeSide === 'back' ? Math.PI : 0;
      const pullQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, baseYaw, pullAngleZ, 'YXZ')
      );
      easing.dampQ(curQuat, pullQuat, 0.18, dt);
      card.setRotation(curQuat, true);
    } else if (reducedMotion) {
      card.setLinvel({ x: 0, y: 0, z: 0 }, true);
      card.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      // Hanging / Elastic Pendulum Physics Mode
      const lv = card.linvel();
      const av = card.angvel();

      let nvx = lv.x;
      let nvy = lv.y;
      let nvz = lv.z;

      const dispX = 0 - cardPos.x;
      const dispY = REST_CARD_Y - cardPos.y;
      const dispZ = 0 - cardPos.z;

      nvx += dispX * physicsConfig.elasticReturnSpring * dt;
      nvy += (14.0 + dispY * physicsConfig.elasticReturnSpring) * dt;
      nvz += dispZ * physicsConfig.elasticReturnSpring * dt;

      const bodies = [j1Ref.current, j2Ref.current, j3Ref.current, j4Ref.current];
      bodies.forEach((b, i) => {
        if (!b) return;
        const frac = (i + 1) / 4;
        const targetJX = cardPos.x * frac;
        const targetJY = THREE.MathUtils.lerp(ANCHOR_Y, cardPos.y + clipTopLocalY, frac);
        const targetJZ = cardPos.z * frac;
        const jt = b.translation();
        b.setLinvel(
          {
            x: (targetJX - jt.x) * 18,
            y: (targetJY - jt.y) * 18,
            z: (targetJZ - jt.z) * 18,
          },
          true
        );
      });

      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w)
      );
      const baseYaw = badgeSide === 'back' ? Math.PI : 0;
      const yawDiff = Math.atan2(Math.sin(baseYaw - euler.y), Math.cos(baseYaw - euler.y));
      const pitchDiff = 0 - euler.x;
      const rollDiff = -cardPos.x * 0.18 - euler.z;

      const maxV = physicsConfig.maxVelocity;
      card.setLinvel(
        {
          x: THREE.MathUtils.clamp(nvx, -maxV, maxV),
          y: THREE.MathUtils.clamp(nvy, -maxV, maxV),
          z: THREE.MathUtils.clamp(nvz, -maxV, maxV),
        },
        false
      );
      card.setAngvel(
        {
          x: THREE.MathUtils.clamp(av.x * 0.92 + pitchDiff * 4.5 * dt, -18, 18),
          y: THREE.MathUtils.clamp(av.y * 0.92 + yawDiff * 4.5 * dt, -24, 24),
          z: THREE.MathUtils.clamp(av.z * 0.92 + rollDiff * 4.5 * dt, -18, 18),
        },
        false
      );
    }

    // Rebuild CatmullRomCurve3 spline ribbon from the 6 chain points
    const allBodies = [anchorRef.current, j1Ref.current, j2Ref.current, j3Ref.current, j4Ref.current];
    allBodies.forEach((b, idx) => {
      if (!b) return;
      const t = b.translation();
      const raw = new THREE.Vector3(t.x, t.y, t.z);
      if (idx === 0) {
        smoothedJoints.current[idx].copy(raw);
      } else {
        smoothedJoints.current[idx].lerp(raw, Math.min(1, dt * 40));
      }
    });

    const cardQuat = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    const clipTopOffset = new THREE.Vector3(0, clipTopLocalY, 0).applyQuaternion(cardQuat);
    smoothedJoints.current[5].set(
      cardPos.x + clipTopOffset.x,
      cardPos.y + clipTopOffset.y,
      cardPos.z + clipTopOffset.z
    );

    ribbonCurve.points.forEach((pt, idx) => {
      pt.copy(smoothedJoints.current[idx]);
    });

    const posAttr = ribbonGeometry.getAttribute('position') as THREE.BufferAttribute;
    const normAttr = ribbonGeometry.getAttribute('normal') as THREE.BufferAttribute;
    const halfWidth = physicsConfig.strapWidth * 0.5;

    const cardRight = new THREE.Vector3(1, 0, 0).applyQuaternion(cardQuat);
    const topRight = new THREE.Vector3(1, 0, 0);
    const sideVec = new THREE.Vector3();
    const ptOnCurve = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const normalVec = new THREE.Vector3();

    for (let i = 0; i <= ribbonSegments; i++) {
      const u = i / ribbonSegments;
      ribbonCurve.getPoint(u, ptOnCurve);
      ribbonCurve.getTangent(u, tangent);

      sideVec.lerpVectors(topRight, cardRight, u * 0.65).normalize();
      normalVec.crossVectors(tangent, sideVec).normalize();

      posAttr.setXYZ(
        i * 2,
        ptOnCurve.x - sideVec.x * halfWidth,
        ptOnCurve.y - sideVec.y * halfWidth,
        ptOnCurve.z - sideVec.z * halfWidth
      );
      posAttr.setXYZ(
        i * 2 + 1,
        ptOnCurve.x + sideVec.x * halfWidth,
        ptOnCurve.y + sideVec.y * halfWidth,
        ptOnCurve.z + sideVec.z * halfWidth
      );

      normAttr.setXYZ(i * 2, normalVec.x, normalVec.y, normalVec.z);
      normAttr.setXYZ(i * 2 + 1, normalVec.x, normalVec.y, normalVec.z);
    }

    posAttr.needsUpdate = true;
    normAttr.needsUpdate = true;

    const curveLen = Math.max(0.35, ribbonCurve.getLength());
    strapMap.repeat.set(curveLen * 1.8, 1);
    strapNormalMap.repeat.set(curveLen * 14, 2);
  });

  return (
    <group>
      {/* 1. Fixed top viewport anchor */}
      <RigidBody ref={anchorRef} type="kinematicPosition" position={[0, ANCHOR_Y, 0]} colliders={false}>
        <BallCollider args={[0.04]} />
      </RigidBody>

      {/* 2. Intermediate rope chain bodies */}
      <RigidBody
        ref={j1Ref}
        position={[0, 1.50, 0]}
        colliders={false}
        linearDamping={physicsConfig.linearDamping}
        angularDamping={physicsConfig.angularDamping}
      >
        <BallCollider args={[0.04]} mass={0.35} />
      </RigidBody>

      <RigidBody
        ref={j2Ref}
        position={[0, 1.32, 0]}
        colliders={false}
        linearDamping={physicsConfig.linearDamping}
        angularDamping={physicsConfig.angularDamping}
      >
        <BallCollider args={[0.04]} mass={0.35} />
      </RigidBody>

      <RigidBody
        ref={j3Ref}
        position={[0, 1.14, 0]}
        colliders={false}
        linearDamping={physicsConfig.linearDamping}
        angularDamping={physicsConfig.angularDamping}
      >
        <BallCollider args={[0.04]} mass={0.35} />
      </RigidBody>

      <RigidBody
        ref={j4Ref}
        position={[0, 0.96, 0]}
        colliders={false}
        linearDamping={physicsConfig.linearDamping}
        angularDamping={physicsConfig.angularDamping}
      >
        <BallCollider args={[0.04]} mass={0.35} />
      </RigidBody>

      {/* 3. Compact Physical ID Badge RigidBody */}
      <RigidBody
        ref={cardRef}
        position={[0, REST_CARD_Y, 0]}
        colliders={false}
        ccd={true}
        canSleep={false}
        linearDamping={physicsConfig.linearDamping}
        angularDamping={physicsConfig.angularDamping}
      >
        <CuboidCollider
          args={[0.38, 0.56, 0.015]}
          mass={physicsConfig.mass}
          restitution={physicsConfig.restitution}
        />

        <group
          ref={visualCardGroupRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            hoverLocalPointRef.current.set(0, 0);
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <Badge
            isHovered={isHovered}
            isDragging={isDraggingPhysics}
            hoverLocalPoint={hoverLocalPointRef.current}
          />
        </group>
      </RigidBody>

      {/* 4. Woven Lanyard Collar / Spline Ribbon Mesh (stationary when Physics is paused in Inspect Mode) */}
      <mesh
        geometry={ribbonGeometry}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={strapMap}
          normalMap={strapNormalMap}
          normalScale={new THREE.Vector2(0.45, 0.45)}
          roughness={0.65}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
