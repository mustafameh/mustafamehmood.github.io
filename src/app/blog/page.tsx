import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Blog — Mustafa Mehmood",
  description: "Writing about AI, ML, and building things that matter.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
        <p className="text-text-secondary mb-8">
          Writing about AI, ML, and building things that matter.
        </p>
        <div className="h-px w-16 bg-primary mb-12" />

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">Posts coming soon.</p>
            <p className="text-text-muted text-sm mt-2">
              Add <code className="font-mono text-primary-light">.mdx</code>{" "}
              files to <code className="font-mono text-primary-light">content/posts/</code> to publish.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="border border-border rounded-xl p-6 bg-surface hover:border-primary/20 transition-colors">
                  <time className="text-xs font-mono text-text-muted">
                    {post.date}
                  </time>
                  <h2 className="text-xl font-semibold mt-2 group-hover:text-primary-light transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                    {post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
