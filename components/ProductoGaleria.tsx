"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductoGaleria({
  imagenes,
  alt,
}: {
  imagenes: string[];
  alt: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  const irA = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    const gap = 12;
    const step = slide.offsetWidth + gap;
    const clamped = Math.min(Math.max(index, 0), imagenes.length - 1);
    el.scrollTo({ left: clamped * step, behavior: "smooth" });
    setActivo(clamped);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || imagenes.length <= 1) return;

    const onScroll = () => {
      const slide = el.querySelector<HTMLElement>("[data-slide]");
      if (!slide) return;
      const gap = 12;
      const step = slide.offsetWidth + gap;
      const index = Math.round(el.scrollLeft / step);
      setActivo(Math.min(Math.max(index, 0), imagenes.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [imagenes.length]);

  if (imagenes.length <= 1) {
    return (
      <div className="border border-b-2 border-line/40 border-b-amber bg-white p-4">
        <div className="relative aspect-square overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagenes[0]} alt={alt} className="h-full w-full object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative border border-b-2 border-line/40 border-b-amber bg-white">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto p-4"
        >
          {imagenes.map((src, i) => (
            <div
              key={`${src}-${i}`}
              data-slide
              className="relative aspect-square w-[88%] shrink-0 snap-center overflow-hidden bg-white sm:w-[92%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} — foto ${i + 1}`} className="h-full w-full object-contain" />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Foto anterior"
          disabled={activo === 0}
          onClick={() => irA(activo - 1)}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/80 text-ink transition hover:bg-white disabled:opacity-30"
        >
          <FlechaIzquierda />
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          disabled={activo === imagenes.length - 1}
          onClick={() => irA(activo + 1)}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/80 text-ink transition hover:bg-white disabled:opacity-30"
        >
          <FlechaDerecha />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {imagenes.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-1.5 w-1.5 ${i === activo ? "bg-amber" : "bg-line/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function FlechaIzquierda() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 6 9 12l6 6" />
    </svg>
  );
}

function FlechaDerecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
