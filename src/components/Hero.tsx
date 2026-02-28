"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/data";

interface DomainNode {
  id: string;
  label: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  fromIdx: number;
  toIdx: number;
}

const DOMAIN_DEFS = [
  { id: "agentic", label: "Agentic AI Systems", color: "#8b5cf6" },
  { id: "legal", label: "Legal AI", color: "#3b82f6" },
  { id: "lm", label: "Language Models", color: "#f59e0b" },
  { id: "cv", label: "Computer Vision", color: "#06b6d4" },
  { id: "health", label: "Health AI", color: "#10b981" },
];

function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<DomainNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const initNodes = useCallback(
    (w: number, h: number) => {
      const cx = w / 2;
      const isMobile = w < 500;
      const cy = h / 2;
      const radius = isMobile ? Math.min(w * 0.46, h * 0.28) : Math.min(w, h) * 0.38;
      const n = DOMAIN_DEFS.length;
      const AGENTIC_IDX = 0;

      // Start at π/2 so node 0 (Agentic AI) points downward
      const positions = DOMAIN_DEFS.map((_, i) => {
        const angle = Math.PI / 2 + (2 * Math.PI * i) / n;
        return {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        };
      });

      nodesRef.current = DOMAIN_DEFS.map((d, i) => ({
        ...d,
        x: positions[i].x,
        y: positions[i].y,
        baseX: positions[i].x,
        baseY: positions[i].y,
        radius: isMobile ? (i === AGENTIC_IDX ? 5 : 3.5) : (i === AGENTIC_IDX ? 7 : 5),
      }));

      // Pentagon outline edges
      const outerPairs: [number, number][] = [];
      for (let i = 0; i < n; i++) outerPairs.push([i, (i + 1) % n]);

      // Hub edges: every domain node flows INTO Agentic AI (idx 0)
      const hubPairs: [number, number][] = [];
      for (let i = 1; i < n; i++) hubPairs.push([i, AGENTIC_IDX]);

      const newParticles: Particle[] = [];
      // Outer pentagon particles
      for (const [from, to] of outerPairs) {
        for (let j = 0; j < 2; j++) {
          newParticles.push({
            x: 0, y: 0,
            progress: Math.random(),
            speed: 0.0008 + Math.random() * 0.0012,
            fromIdx: from, toIdx: to,
          });
        }
      }
      // Hub particles — flow toward Agentic AI
      for (const [from, to] of hubPairs) {
        for (let j = 0; j < 2; j++) {
          newParticles.push({
            x: 0, y: 0,
            progress: Math.random(),
            speed: 0.0006 + Math.random() * 0.001,
            fromIdx: from, toIdx: to,
          });
        }
      }
      particlesRef.current = newParticles;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      initNodes(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const draw = () => {
      time += 0.01;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const n = nodes.length;
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(time + node.baseX * 0.01) * 3;
        node.y = node.baseY + Math.cos(time + node.baseY * 0.01) * 3;
      }

      const AGENTIC_IDX = 0;

      // Pentagon outline
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Hub edges converging into Agentic AI
      for (let i = 1; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[AGENTIC_IDX].x, nodes[AGENTIC_IDX].y);
        ctx.strokeStyle = `${nodes[i].color}18`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (const p of particlesRef.current) {
        p.progress += p.speed;
        if (p.progress > 1) p.progress -= 1;
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        p.x = from.x + (to.x - from.x) * p.progress;
        p.y = from.y + (to.y - from.y) * p.progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 79, 144, 0.5)";
        ctx.fill();
      }

      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const isHub = idx === AGENTIC_IDX;
        const r = node.radius;

        if (isHub) {
          const glowR = 20 + Math.sin(time * 2) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}12`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}40`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const isMobileView = w < 500;
        const fontSize = isMobileView ? (isHub ? 9 : 8) : (isHub ? 13 : 12);
        ctx.font = `${isHub ? 600 : 500} ${fontSize}px var(--font-geist-sans), system-ui, sans-serif`;
        ctx.fillStyle = isHub ? "#ffffff" : "rgba(255,255,255,0.45)";
        ctx.textAlign = "center";
        const labelOffset = node.y > h / 2 ? (isMobileView ? 18 : 26) : (isMobileView ? -14 : -20);
        ctx.fillText(node.label, node.x, node.y + labelOffset);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initNodes]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export function Hero() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NodeGraph />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-3">
            {siteConfig.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-primary-light tracking-wide mb-6">
            {siteConfig.role}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          {siteConfig.tagline}
        </motion.p>

        {siteConfig.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm text-text-muted font-mono"
          >
            {siteConfig.location}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
            className="text-sm text-text-secondary hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" fill="currentColor" />
              <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z" fill="currentColor" opacity="0.6" />
              <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z" fill="currentColor" opacity="0.4" />
            </svg>
            Chat with mustafa.ai
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6"
        >
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-foreground transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <button
            onClick={() => setContactOpen(true)}
            className="text-sm text-text-secondary hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact
          </button>
        </motion.div>
      </div>

      {/* Contact popup */}
      <AnimatePresence>
        {contactOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setContactOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-surface border border-border rounded-xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Get in Touch</h3>
                <button
                  onClick={() => setContactOpen(false)}
                  className="text-text-muted hover:text-foreground transition-colors p-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-primary/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-light shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-xs text-text-muted truncate">{siteConfig.email}</div>
                  </div>
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-primary/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-light shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">LinkedIn</div>
                    <div className="text-xs text-text-muted">/in/mustafa-meh</div>
                  </div>
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-primary/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-light shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-xs text-text-muted">{siteConfig.phone}</div>
                  </div>
                </a>
                <button
                  onClick={() => {
                    setContactOpen(false);
                    setTimeout(() => window.dispatchEvent(new CustomEvent("open-chatbot")), 200);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-primary/30 transition-colors w-full text-left cursor-pointer"
                >
                  <svg className="w-5 h-5 text-primary-light shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" fill="currentColor" />
                    <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z" fill="currentColor" opacity="0.6" />
                    <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z" fill="currentColor" opacity="0.4" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Chat with mustafa.ai</div>
                    <div className="text-xs text-text-muted">AI portfolio assistant</div>
                  </div>
                </button>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-elevated hover:border-primary/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-light shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">GitHub</div>
                    <div className="text-xs text-text-muted">/mustafameh</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#experience" className="block animate-bounce">
          <svg
            className="w-5 h-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m19 9-7 7-7-7" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
