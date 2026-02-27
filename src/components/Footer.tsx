import { siteConfig } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
