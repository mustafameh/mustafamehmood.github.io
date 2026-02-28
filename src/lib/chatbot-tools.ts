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

export type ConversationMessage = { role: "user" | "assistant"; content: string };

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

const MAX_TRANSCRIPT_MESSAGES = 10;

function escapeHtml(s: string): string {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatTranscript(messages: ConversationMessage[]): string {
  const take = messages.slice(-MAX_TRANSCRIPT_MESSAGES);
  return take
    .map((m) => {
      const label = m.role === "user" ? "Visitor" : "Assistant";
      const snippet = escapeHtml(m.content.slice(0, 500)) + (m.content.length > 500 ? "…" : "");
      return `<tr><td style="padding: 6px 0; vertical-align: top; font-size: 12px; color: #64748b;">${label}</td><td style="padding: 6px 0 6px 12px; font-size: 13px; color: #334155; border-left: 2px solid #e2e8f0;">${snippet}</td></tr>`;
    })
    .join("");
}

async function sendMessage(
  args: ToolArgs,
  context?: { conversation?: ConversationMessage[] }
): Promise<string> {
  const conversation = context?.conversation;
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

  const transcriptSection =
    conversation && conversation.length > 0
      ? `
        <h3 style="color: #1a1a2e; font-size: 14px; margin: 20px 0 8px 0;">Recent conversation</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          ${formatTranscript(conversation)}
        </table>
      `
      : "";

  const resend = new Resend(apiKey);
  const payload = {
    from: "mustafa.ai <onboarding@resend.dev>" as const,
    to: siteConfig.email,
    replyTo: senderEmail || undefined,
    subject: `New message from ${senderName} via mustafa.ai`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          New Message via mustafa.ai
        </h2>
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <p style="color: #334155; white-space: pre-wrap; line-height: 1.6; margin: 0;">${escapeHtml(message)}</p>
        </div>
        ${transcriptSection}
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; color: #64748b;">
          <tr><td style="padding: 4px 0;"><strong>From:</strong></td><td>${escapeHtml(senderName)}</td></tr>
          ${senderEmail ? `<tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(senderEmail)}">${escapeHtml(senderEmail)}</a></td></tr>` : ""}
          <tr><td style="padding: 4px 0;"><strong>Time:</strong></td><td>${timestamp}</td></tr>
        </table>
      </div>
    `,
  };

  const maxAttempts = 2;
  let lastError: { message?: string } | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { error } = await resend.emails.send(payload);
    if (!error) {
      return JSON.stringify({ success: true, message: "Message delivered successfully." });
    }
    lastError = error;
    const isNetworkError =
      typeof error?.message === "string" &&
      (error.message.includes("could not be resolved") || error.message.includes("fetch") || error.message.includes("network"));
    if (attempt < maxAttempts && isNetworkError) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    break;
  }

  console.error("Resend error:", lastError);
  const msg =
    lastError && typeof lastError?.message === "string" && lastError.message.length > 0
      ? lastError.message
      : "Failed to send message. Please try again.";
  return JSON.stringify({ success: false, error: msg });
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

const asyncToolRegistry: Record<
  string,
  (args: ToolArgs, context?: { conversation?: ConversationMessage[] }) => Promise<string>
> = {
  send_message: sendMessage,
};

export type ExecuteToolContext = { conversation?: ConversationMessage[] };

export async function executeTool(
  name: string,
  args: ToolArgs,
  context?: ExecuteToolContext
): Promise<string | null> {
  const syncFn = syncToolRegistry[name];
  if (syncFn) return syncFn(args);

  const asyncFn = asyncToolRegistry[name];
  if (asyncFn) return asyncFn(args, context);

  return null;
}

export function isValidTool(name: string): boolean {
  return name in syncToolRegistry || name in asyncToolRegistry;
}
