import Link from "next/link";
import Header from "@/components/Header";

export default function LegalPageShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="px-6 py-12">
        <article className="mx-auto max-w-2xl">
          <Link
            href="/#catalogo"
            className="font-mono text-[11px] uppercase tracking-widest2 text-taupe transition hover:text-amber"
          >
            ← Volver al catálogo
          </Link>
          {eyebrow && (
            <p className="mt-8 font-mono text-[10px] uppercase tracking-widest2 text-amber">{eyebrow}</p>
          )}
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ink/90">{children}</div>
        </article>
      </main>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line/40 pt-6">
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-taupe">{children}</div>
    </section>
  );
}
