"use client";

import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  r: number;
  alpha: number;
  seed: number;
}

const TRAIL_MAX_POINTS = 45;
const TRAIL_HEAD_R = 115;
const TRAIL_NOISE_AMP = 26;
const TRAIL_BLOB_PTS = 20;
const TRAIL_FADE_SPEED = 0.90;
const TRAIL_SAMPLE_DIST = 8;

export function HeroSupportPathsReveal() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let headRadius = 0;
    let lastSampleX = -9999;
    let lastSampleY = -9999;
    let trail: Point[] = [];
    let animId: number | null = null;
    let time = 0;

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (prefersReducedMotion) {
        drawStatic();
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    // Draw the two flowing journeys artwork
    function drawArtwork(targetCtx: CanvasRenderingContext2D, alphaMultiplier = 1) {
      if (width <= 0 || height <= 0) return;

      targetCtx.save();

      // Flowing Path 1: Survivor Journey (Graceful organic curve)
      targetCtx.beginPath();
      targetCtx.moveTo(-40, height * 0.72);
      targetCtx.bezierCurveTo(
        width * 0.22,
        height * 0.88,
        width * 0.38,
        height * 0.25,
        width * 0.68,
        height * 0.42
      );
      targetCtx.bezierCurveTo(
        width * 0.82,
        height * 0.52,
        width * 0.92,
        height * 0.22,
        width + 40,
        height * 0.32
      );
      targetCtx.strokeStyle = `rgba(15, 118, 110, ${0.45 * alphaMultiplier})`;
      targetCtx.lineWidth = 3.5;
      targetCtx.lineCap = "round";
      targetCtx.stroke();

      // Flowing Path 2: Support Journey (Walking alongside, harmonizing)
      targetCtx.beginPath();
      targetCtx.moveTo(-30, height * 0.82);
      targetCtx.bezierCurveTo(
        width * 0.18,
        height * 0.65,
        width * 0.42,
        height * 0.38,
        width * 0.62,
        height * 0.52
      );
      targetCtx.bezierCurveTo(
        width * 0.78,
        height * 0.64,
        width * 0.88,
        height * 0.38,
        width + 50,
        height * 0.46
      );
      targetCtx.strokeStyle = `rgba(45, 159, 150, ${0.4 * alphaMultiplier})`;
      targetCtx.lineWidth = 2.5;
      targetCtx.lineCap = "round";
      targetCtx.stroke();

      // Secondary Subtle Path: Gentle Gold Thread of Hope
      targetCtx.beginPath();
      targetCtx.moveTo(-20, height * 0.76);
      targetCtx.bezierCurveTo(
        width * 0.26,
        height * 0.78,
        width * 0.48,
        height * 0.32,
        width * 0.72,
        height * 0.48
      );
      targetCtx.bezierCurveTo(
        width * 0.85,
        height * 0.58,
        width * 0.94,
        height * 0.28,
        width + 30,
        height * 0.38
      );
      targetCtx.strokeStyle = `rgba(197, 155, 39, ${0.35 * alphaMultiplier})`;
      targetCtx.lineWidth = 1.5;
      targetCtx.lineCap = "round";
      targetCtx.setLineDash([8, 12]);
      targetCtx.stroke();
      targetCtx.setLineDash([]);

      // Subtle Terracotta Warmth Bridge
      targetCtx.beginPath();
      targetCtx.moveTo(width * 0.34, height * 0.45);
      targetCtx.bezierCurveTo(
        width * 0.44,
        height * 0.42,
        width * 0.52,
        height * 0.47,
        width * 0.58,
        height * 0.46
      );
      targetCtx.strokeStyle = `rgba(184, 106, 89, ${0.28 * alphaMultiplier})`;
      targetCtx.lineWidth = 1.2;
      targetCtx.stroke();

      // Constellation / Sanctuary points (Gentle resting nodes along the path)
      const nodes = [
        { x: width * 0.22, y: height * 0.78, r: 3.5, color: "rgba(15, 118, 110, " },
        { x: width * 0.42, y: height * 0.36, r: 4.0, color: "rgba(197, 155, 39, " },
        { x: width * 0.65, y: height * 0.46, r: 3.5, color: "rgba(45, 159, 150, " },
        { x: width * 0.84, y: height * 0.42, r: 3.0, color: "rgba(197, 155, 39, " },
      ];

      nodes.forEach((node) => {
        // Outer soft glow
        targetCtx.beginPath();
        targetCtx.arc(node.x, node.y, node.r * 2.6, 0, Math.PI * 2);
        targetCtx.fillStyle = `${node.color}${0.18 * alphaMultiplier})`;
        targetCtx.fill();

        // Inner solid core
        targetCtx.beginPath();
        targetCtx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        targetCtx.fillStyle = `${node.color}${0.75 * alphaMultiplier})`;
        targetCtx.fill();
      });

      targetCtx.restore();
    }

    // Static drawing for reduced motion or fallback
    function drawStatic() {
      if (!ctx || width <= 0 || height <= 0) return;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      drawArtwork(ctx, 0.18);
      ctx.restore();
    }

    if (prefersReducedMotion) {
      drawStatic();
      return () => {
        ro.disconnect();
      };
    }

    // Generate smooth organic blob path
    function buildOrganicBlob(
      targetCtx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      t: number,
      seed: number
    ) {
      if (r <= 2) return;
      const pts: { x: number; y: number }[] = [];
      const angleStep = (Math.PI * 2) / TRAIL_BLOB_PTS;

      for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
        const theta = i * angleStep;
        // Multi-frequency sinusoidal noise for continuous morphing
        const noise1 = Math.sin(3 * theta + t * 1.8 + seed) * (TRAIL_NOISE_AMP * 0.55);
        const noise2 = Math.cos(2 * theta - t * 1.2 + seed * 1.5) * (TRAIL_NOISE_AMP * 0.35);
        const noise3 = Math.sin(5 * theta + t * 0.6) * (TRAIL_NOISE_AMP * 0.2);
        const rad = Math.max(10, r + (noise1 + noise2 + noise3) * (r / TRAIL_HEAD_R));

        pts.push({
          x: cx + Math.cos(theta) * rad,
          y: cy + Math.sin(theta) * rad,
        });
      }

      if (pts.length < 3) return;

      targetCtx.moveTo((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      for (let i = 0; i < pts.length; i++) {
        const next = pts[(i + 1) % pts.length];
        const nextNext = pts[(i + 2) % pts.length];
        const midX = (next.x + nextNext.x) / 2;
        const midY = (next.y + nextNext.y) / 2;
        targetCtx.quadraticCurveTo(next.x, next.y, midX, midY);
      }
    }

    function render() {
      if (!ctx || width <= 0 || height <= 0) return;

      time += 0.022;

      // Soft easing for head position
      const targetRadius = isHovering ? TRAIL_HEAD_R : 0;
      headRadius += (targetRadius - headRadius) * (isHovering ? 0.12 : 0.035);

      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      // Sample cursor path if moved enough
      if (isHovering && headRadius > 15) {
        const dx = currentX - lastSampleX;
        const dy = currentY - lastSampleY;
        const dist = Math.hypot(dx, dy);

        if (dist >= TRAIL_SAMPLE_DIST) {
          trail.unshift({
            x: currentX,
            y: currentY,
            r: headRadius,
            alpha: 1.0,
            seed: Math.random() * 100,
          });
          lastSampleX = currentX;
          lastSampleY = currentY;

          if (trail.length > TRAIL_MAX_POINTS) {
            trail.length = TRAIL_MAX_POINTS;
          }
        }
      }

      // Fade & shrink older trail points
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha *= TRAIL_FADE_SPEED;
        p.r *= 0.965;
        if (p.alpha < 0.01 || p.r < 4) {
          trail.splice(i, 1);
        }
      }

      // Draw loop
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Layer 1: Ambient baseline state (Extremely subtle, 7% opacity)
      drawArtwork(ctx, 0.07);

      // Layer 2: Morphing organic reveal mask
      const hasActiveTrail = trail.length > 0 || (isHovering && headRadius > 5);

      if (hasActiveTrail) {
        // Create an offscreen buffer or draw with compositing
        ctx.save();

        // Define the organic mask path combining head + trail
        ctx.beginPath();

        if (isHovering && headRadius > 5) {
          buildOrganicBlob(ctx, currentX, currentY, headRadius, time, 42);
        }

        for (let i = 0; i < trail.length; i++) {
          const pt = trail[i];
          buildOrganicBlob(ctx, pt.x, pt.y, pt.r * (0.6 + pt.alpha * 0.4), time + i * 0.1, pt.seed);
        }

        ctx.clip();

        // Inside the organic mask: Render the luminous full-intensity Support Paths
        drawArtwork(ctx, 0.95);

        // Soft organic aura at cursor center
        if (isHovering && headRadius > 20) {
          const grad = ctx.createRadialGradient(
            currentX,
            currentY,
            0,
            currentX,
            currentY,
            headRadius * 1.2
          );
          grad.addColorStop(0, "rgba(220, 235, 221, 0.22)");
          grad.addColorStop(0.6, "rgba(197, 155, 39, 0.08)");
          grad.addColorStop(1, "rgba(220, 235, 221, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
      }

      ctx.restore();

      // Check if animation should continue or sleep to conserve CPU
      if (hasActiveTrail || isHovering || headRadius > 0.5) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    }

    function startAnimationIfNeeded() {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    }

    // Pointer Event Listeners on parent container (so buttons remain clickable while tracking works everywhere)
    const targetElement = container.parentElement || container;

    function handlePointerEnter(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      isHovering = true;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;
      lastSampleX = targetX;
      lastSampleY = targetY;
      startAnimationIfNeeded();
    }

    function handlePointerMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      isHovering = true;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      startAnimationIfNeeded();
    }

    function handlePointerLeave() {
      isHovering = false;
      startAnimationIfNeeded();
    }

    targetElement.addEventListener("pointerenter", handlePointerEnter as EventListener, { passive: true });
    targetElement.addEventListener("pointermove", handlePointerMove as EventListener, { passive: true });
    targetElement.addEventListener("pointerleave", handlePointerLeave as EventListener, { passive: true });

    return () => {
      ro.disconnect();
      if (animId) cancelAnimationFrame(animId);
      targetElement.removeEventListener("pointerenter", handlePointerEnter as EventListener);
      targetElement.removeEventListener("pointermove", handlePointerMove as EventListener);
      targetElement.removeEventListener("pointerleave", handlePointerLeave as EventListener);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
