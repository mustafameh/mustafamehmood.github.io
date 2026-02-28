import { Resend } from "resend";
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

async function sendMessage(args: ToolArgs): Promise<string> {
  const message = args.message;
  if (!message || message.trim().length === 0) {
    return JSON.stringify({ success: false, error: "Message cannot be empty." });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey === "your_resend_api_key_here") {
    return JSON.stringify({ success: false, error: "Messaging is temporarily unavailable." });
  }

  const senderName = args.sender_name?.trim() || "Anonymous visitor";
  const senderEmail = args.sender_email?.trim();
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "mustafa.ai <onboarding@resend.dev>",
    to: siteConfig.email,
    replyTo: senderEmail || undefined,
    subject: `New message from ${senderName} via mustafa.ai`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          New Message via mustafa.ai
        </h2>
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <p style="color: #334155; white-space: pre-wrap; line-height: 1.6; margin: 0;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; color: #64748b;">
          <tr><td style="padding: 4px 0;"><strong>From:</strong></td><td>${senderName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td></tr>
          ${senderEmail ? `<tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td><a href="mailto:${senderEmail}">${senderEmail}</a></td></tr>` : ""}
          <tr><td style="padding: 4px 0;"><strong>Time:</strong></td><td>${timestamp}</td></tr>
        </table>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return JSON.stringify({ success: false, error: "Failed to send message. Please try again." });
  }

  return JSON.stringify({ success: true, message: "Message delivered successfully." });
}

const syncToolRegistry: Record<string, (args: ToolArgs) => string> = {
  get_profile: getProfile,
  get_experience: getExperience,
  get_projects: getProjects,
  get_skills: getSkills,
  get_education: getEducation,
  get_publication: getPublication,
  get_contact: getContact,
};

const asyncToolRegistry: Record<string, (args: ToolArgs) => Promise<string>> = {
  send_message: sendMessage,
};

export async function executeTool(name: string, args: ToolArgs): Promise<string | null> {
  const syncFn = syncToolRegistry[name];
  if (syncFn) return syncFn(args);

  const asyncFn = asyncToolRegistry[name];
  if (asyncFn) return asyncFn(args);

  return null;
}

export function isValidTool(name: string): boolean {
  return name in syncToolRegistry || name in asyncToolRegistry;
}
