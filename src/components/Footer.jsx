import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-6 flex flex-col items-center gap-2 pb-2 text-center sm:mt-8">
      <p className="text-xs text-muted sm:text-sm">تقبل الله صلاتكم</p>
      <a
        href="https://github.com/ayoubsousali/next-salat"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-full text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
        title="عرض الشفرة على Github"
        aria-label="عرض الشفرة على Github"
      >
        <Github className="h-5 w-5" />
      </a>
    </footer>
  );
}
