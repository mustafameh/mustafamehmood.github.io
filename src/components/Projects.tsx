"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

function CaseStudy({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="border border-border rounded-xl bg-surface overflow-hidden hover:border-primary/20 transition-colors"
    >
      <div
        className="p-4 sm:p-6 md:p-8 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
            {project.title}
          </h3>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-text-muted shrink-0 mt-0.5"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m19 9-7 7-7-7" />
            </svg>
          </motion.span>
        </div>

        {/* The Problem */}
        <div className="mb-3 sm:mb-5">
          <span className="text-xs uppercase tracking-wider text-primary-light font-mono">
            The Problem
          </span>
          <p className="mt-1 text-text-secondary text-xs sm:text-sm leading-relaxed italic">
            {project.problem}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-5">
          {project.metrics.map((m, i) => (
            <div
              key={i}
              className="bg-surface-elevated rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-border"
            >
              <div className="text-lg sm:text-2xl font-bold text-primary-light">
                {m.value}
              </div>
              <div className="text-xs text-text-muted mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-mono rounded-md bg-surface-elevated text-text-secondary border border-border"
            >
              {t}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* The Approach */}
              <div className="mt-6 pt-6 border-t border-border">
                <span className="text-xs uppercase tracking-wider text-primary-light font-mono">
                  The Approach
                </span>
                <p className="mt-2 text-text-secondary text-sm leading-relaxed">
                  {project.approach}
                </p>
              </div>

              {/* The Evidence */}
              <div className="mt-6">
                <span className="text-xs uppercase tracking-wider text-primary-light font-mono">
                  The Evidence
                </span>
                <ul className="mt-2 space-y-2">
                  {project.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-sm text-text-secondary leading-relaxed flex gap-3"
                    >
                      <span className="text-primary-light mt-1.5 shrink-0">
                        &bull;
                      </span>
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Links */}
              <div className="mt-6 flex gap-4">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-foreground transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface/50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Projects"
          subtitle="Selected work"
        />
        <div className="space-y-4 sm:space-y-6">
          {projects.map((p, i) => (
            <CaseStudy key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
