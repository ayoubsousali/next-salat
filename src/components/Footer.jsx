import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-4 flex justify-center pb-1">
      <a
        href="https://github.com/ayoubsousali/next-salat"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-full text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
        title="عرض الشفرة على Github"
        aria-label="عرض الشفرة على Github"
      >
        <Github className="h-4 w-4" />
      </a>
    </footer>
  );
}
