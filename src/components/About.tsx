"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="About" />

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-text-secondary leading-relaxed">
              I&apos;m an Applied AI Researcher currently at{" "}
              <span className="text-foreground font-medium">
                Thomson Reuters
              </span>
              , where I build multi-agent systems for legal due diligence in
              high-stakes M&amp;A transactions. My work sits at the intersection
              of large language models and domains where accuracy isn&apos;t
              optional.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Before this, I worked on RLHF training pipelines at Outlier AI,
              improving tool-use capabilities for models deployed by Google and
              Meta. I also spent two years in computational neuroscience,
              building ML systems for neurological disorder diagnosis — work that
              led to a peer-reviewed{" "}
              <span className="text-foreground font-medium">
                Springer Nature publication
              </span>
              .
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="border border-border rounded-xl bg-surface p-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-text-muted mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
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
                  </div>
                  <div>
                    <div className="text-sm break-all sm:break-normal">{siteConfig.email}</div>
                    <div className="text-xs text-text-muted">Email</div>
                  </div>
                </a>

                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm">LinkedIn</div>
                    <div className="text-xs text-text-muted">
                      /in/mustafa-meh
                    </div>
                  </div>
                </a>

                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm">GitHub</div>
                    <div className="text-xs text-text-muted">
                      /mustafameh
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm">{siteConfig.phone}</div>
                    <div className="text-xs text-text-muted">Phone</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
