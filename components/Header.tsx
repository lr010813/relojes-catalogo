"use client";

import { useEffect, useState } from "react";
import { NEGOCIO, REDES } from "@/lib/config";
import { useCart } from "@/lib/CartContext";

function useRelojEnVivo() {
  const [hora, setHora] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setHora(
        now.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return hora;
}

export default function Header() {
  const hora = useRelojEnVivo();
  const { cantidadTotal, abrirCarrito } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-amber bg-paper/95 backdrop-blur">
      <div className="flex items-center justify-between border-b border-line/40 px-6 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-taupe">
        <span>Lima, Perú</span>
        <span>{hora || "--:--:--"}</span>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-display text-2xl font-medium tracking-tight text-ink">
          {NEGOCIO.nombre}
        </a>

        <nav className="hidden gap-10 font-body text-[13px] uppercase tracking-widest2 text-taupe md:flex">
          <a href="/#catalogo" className="transition hover:text-amber">
            Catálogo
          </a>
          <a href={REDES.whatsapp} target="_blank" className="transition hover:text-amber">
            Contacto
          </a>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={REDES.instagram}
            target="_blank"
            aria-label="Instagram"
            className="text-taupe transition hover:text-amber"
          >
            <IconInstagram />
          </a>
          <a
            href={REDES.facebook}
            target="_blank"
            aria-label="Facebook"
            className="text-taupe transition hover:text-amber"
          >
            <IconFacebook />
          </a>
          <a
            href={REDES.tiktok}
            target="_blank"
            aria-label="TikTok"
            className="text-taupe transition hover:text-amber"
          >
            <IconTikTok />
          </a>
          <button
            type="button"
            onClick={abrirCarrito}
            aria-label="Abrir carrito"
            className="relative text-taupe transition hover:text-amber"
          >
            <IconCarrito />
            {cantidadTotal > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-amber px-1 font-mono text-[9px] leading-none text-paper">
                {cantidadTotal}
              </span>
            )}
          </button>
          <a
            href={REDES.whatsapp}
            target="_blank"
            className="ml-1 border border-amber px-4 py-1.5 text-[11px] uppercase tracking-widest2 text-amber transition hover:bg-amber hover:text-paper"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function IconCarrito() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.6L5 4H2" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M15 8h-2a2 2 0 0 0-2 2v10M9 13h6" />
      <path d="M13 20V13" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3-3.46" />
      <path d="M14 4c.5 2.5 2 4 5 4.2" />
    </svg>
  );
}
