"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function Education() {
  return (
    <section id="education" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Education" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="border border-border rounded-xl bg-surface p-6 sm:p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-light"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m4 6 8-4 8 4" />
                <path d="m18 10 4-2" />
                <path d="m2 10 4-2" />
                <path d="M4 6v6a8 4 0 0 0 16 0V6" />
                <path d="M12 10v10" />
                <path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{education.university}</h3>
              <p className="text-xs text-text-muted">{education.location}</p>
            </div>
          </div>

          <div className="space-y-5">
            {education.degrees.map((deg) => (
              <div
                key={deg.level}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
              >
                <div>
                  <span className="font-medium">
                    {deg.level} {deg.field}
                  </span>
                  {deg.grade && (
                    <span className="ml-3 text-sm text-primary-light font-medium">
                      {deg.grade}
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted font-mono">
                  {deg.period}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
              Key Modules
            </h4>
            <div className="flex flex-wrap gap-2">
              {education.modules.map((m) => (
                <span
                  key={m}
                  className="text-xs px-2.5 py-1 rounded-md bg-surface-elevated text-text-secondary border border-border"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
