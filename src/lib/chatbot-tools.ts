import {
  siteConfig,
  experiences,
  projects,
  skills,
  skillDomains,
  education,
  publication,
} from "./data";

type ToolArgs = Record<string, string | undefined>;

function getProfile(): string {
  return JSON.stringify({
    name: siteConfig.name,
    role: siteConfig.role,
    tagline: siteConfig.tagline,
  });
}

function getExperience(args: ToolArgs): string {
  const company = args.company?.toLowerCase();
  const filtered = company
    ? experiences.filter((e) => e.company.toLowerCase().includes(company))
    : experiences;

  return JSON.stringify(
    filtered.map((e) => ({
      title: e.title,
      company: e.company,
      location: e.location,
      period: e.period,
      current: e.current ?? false,
      metric: e.metric,
      metricLabel: e.metricLabel,
      highlights: e.highlights,
    }))
  );
}

function getProjects(args: ToolArgs): string {
  const slug = args.slug?.toLowerCase();
  const filtered = slug
    ? projects.filter((p) => p.slug.toLowerCase() === slug)
    : projects;

  return JSON.stringify(
    filtered.map((p) => ({
      title: p.title,
      problem: p.problem,
      approach: p.approach,
      techStack: p.techStack,
      metrics: p.metrics,
      highlights: p.highlights,
      links: p.links,
    }))
  );
}

function getSkills(args: ToolArgs): string {
  const domain = args.domain?.toLowerCase();
  const filtered = domain
    ? skills.filter((s) => s.domain.toLowerCase() === domain)
    : skills;

  const domains = skillDomains.map((d) => ({
    id: d.id,
    label: d.label,
  }));

  return JSON.stringify({
    domains,
    skills: filtered.map((s) => ({
      name: s.name,
      domain: s.domain,
      projects: s.projects,
    })),
  });
}

function getEducation(): string {
  return JSON.stringify({
    university: education.university,
    location: education.location,
    degrees: education.degrees,
    modules: education.modules,
  });
}

function getPublication(): string {
  return JSON.stringify({
    authors: publication.authors,
    year: publication.year,
    title: publication.title,
    journal: publication.journal,
    publisher: publication.publisher,
    doi: publication.doi,
    summary: publication.summary,
  });
}

function getContact(): string {
  return JSON.stringify({
    email: siteConfig.email,
    phone: siteConfig.phone,
    linkedin: siteConfig.linkedin,
    github: siteConfig.github,
  });
}

const toolRegistry: Record<string, (args: ToolArgs) => string> = {
  get_profile: getProfile,
  get_experience: getExperience,
  get_projects: getProjects,
  get_skills: getSkills,
  get_education: getEducation,
  get_publication: getPublication,
  get_contact: getContact,
};

export function executeTool(name: string, args: ToolArgs): string | null {
  const fn = toolRegistry[name];
  if (!fn) return null;
  return fn(args);
}

export function isValidTool(name: string): boolean {
  return name in toolRegistry;
}
