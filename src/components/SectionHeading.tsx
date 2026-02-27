"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-text-secondary text-base sm:text-lg">{subtitle}</p>
      )}
      <div className="mt-4 h-px w-16 bg-primary" />
    </motion.div>
  );
}
