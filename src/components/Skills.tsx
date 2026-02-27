"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { skills, skillDomains, projects } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const groupedSkills = useMemo(() => {
    const groups: Record<string, typeof skills> = {};
    for (const s of skills) {
      if (!groups[s.domain]) groups[s.domain] = [];
      groups[s.domain].push(s);
    }
    return groups;
  }, []);

  const isHighlighted = (skill: (typeof skills)[0]) => {
    if (!activeDomain && !activeProject) return true;
    if (activeDomain && skill.domain === activeDomain) return true;
    if (activeProject && skill.projects?.includes(activeProject)) return true;
    return false;
  };

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface/50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Skills"
          subtitle="Tap or hover a domain or project to filter"
        />

        {/* Domain filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {skillDomains.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
              onMouseEnter={() => setActiveDomain(d.id)}
              onMouseLeave={() => setActiveDomain(null)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                activeDomain === d.id
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-surface text-text-secondary hover:border-primary/20"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </button>
          ))}
        </div>

        {/* Project filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {projects.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActiveProject(activeProject === p.slug ? null : p.slug)}
              onMouseEnter={() => setActiveProject(p.slug)}
              onMouseLeave={() => setActiveProject(null)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
                activeProject === p.slug
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-surface-elevated text-text-muted hover:text-text-secondary"
              }`}
            >
              {p.title.split(":")[0]}
            </button>
          ))}
        </div>

        {/* Skills constellation */}
        <div className="space-y-8">
          {skillDomains.map((domain) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3
                className="text-sm font-mono uppercase tracking-wider mb-4 flex items-center gap-2"
                style={{ color: domain.color }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
                {domain.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(groupedSkills[domain.id] || []).map((skill) => {
                  const highlighted = isHighlighted(skill);
                  const sizeClass =
                    skill.size === 3
                      ? "text-sm px-4 py-2"
                      : skill.size === 2
                        ? "text-xs px-3 py-1.5"
                        : "text-xs px-2.5 py-1";

                  return (
                    <motion.span
                      key={skill.name}
                      animate={{
                        opacity: highlighted ? 1 : 0.25,
                        scale: highlighted ? 1 : 0.95,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg font-medium border transition-colors ${sizeClass} ${
                        highlighted
                          ? "border-border bg-surface-elevated text-foreground"
                          : "border-transparent bg-surface text-text-muted"
                      }`}
                      style={
                        highlighted && (activeDomain || activeProject)
                          ? {
                              borderColor: `${domain.color}40`,
                              backgroundColor: `${domain.color}10`,
                            }
                          : {}
                      }
                    >
                      {skill.name}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
