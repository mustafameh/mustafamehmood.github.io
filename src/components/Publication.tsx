"use client";

import { motion } from "framer-motion";
import { publication } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function Publication() {
  return (
    <section id="publication" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Publication"
          subtitle="Peer-reviewed research"
        />

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
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">
                {publication.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {publication.authors} ({publication.year})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Springer Nature
            </span>
            <span className="text-xs text-text-muted italic">
              {publication.journal}
            </span>
          </div>

          <blockquote className="border-l-2 border-primary/30 pl-4 text-sm text-text-secondary leading-relaxed mb-6 italic">
            {publication.summary}
          </blockquote>

          <a
            href={publication.doi}
            target="_blank"
            rel="noopener noreferrer"
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
            View on Springer Nature (DOI)
          </a>
        </motion.div>
      </div>
    </section>
  );
}
