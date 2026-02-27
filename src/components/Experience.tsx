"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(exp.current ?? false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-6 sm:pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
          exp.current ? "bg-primary-light glow-border" : "bg-text-muted"
        }`}
      />

      <div
        className={`rounded-xl border transition-all cursor-pointer ${
          exp.current
            ? "border-primary/30 bg-primary/5 glow-border"
            : "border-border bg-surface hover:border-border/80"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold leading-tight">
                {exp.title}
              </h3>
              <p className="text-primary-light mt-1 text-sm font-medium">
                {exp.company}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
              <span className="text-xs text-text-muted font-mono">
                {exp.period}
              </span>
              <span className="text-xs text-text-muted">{exp.location}</span>
            </div>
          </div>

          {/* Metric callout */}
          <div className="flex items-baseline gap-2 mt-4 mb-2">
            <span className="text-2xl font-bold text-primary-light">
              {exp.metric}
            </span>
            <span className="text-xs text-text-secondary">
              {exp.metricLabel}
            </span>
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
                <ul className="mt-4 space-y-3">
                  {exp.highlights.map((h, i) => (
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
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 text-xs text-text-muted">
            {expanded ? "Click to collapse" : "Click to expand"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Experience" />
        <div className="relative">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
