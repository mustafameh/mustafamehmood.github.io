import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} — Mustafa Mehmood`,
    description: post.meta.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <time className="text-xs font-mono text-text-muted">
            {post.meta.date}
          </time>
          <h1 className="text-4xl font-bold tracking-tight mt-2 mb-4">
            {post.meta.title}
          </h1>
          {post.meta.tags.length > 0 && (
            <div className="flex gap-2">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary-light prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border prose-code:text-primary-light prose-code:bg-surface-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </div>
      </article>
    </main>
  );
}
