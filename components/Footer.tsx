import Link from "next/link";
import { NEGOCIO, REDES } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t-2 border-amber px-6 py-10 text-center text-xs text-taupe">
      <p>
        {NEGOCIO.nombre} · {NEGOCIO.email}
      </p>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/terminos-y-condiciones" className="hover:text-amber">
          Términos y condiciones
        </Link>
        <Link href="/cambios-y-devoluciones" className="hover:text-amber">
          Cambios y devoluciones
        </Link>
        <Link href="/libro-de-reclamaciones" className="font-medium text-ink hover:text-amber">
          Libro de Reclamaciones
        </Link>
      </p>
      <p className="mt-3">
        <a href={REDES.instagram} target="_blank" rel="noreferrer" className="mx-2 hover:text-amber">
          Instagram
        </a>
        <a href={REDES.facebook} target="_blank" rel="noreferrer" className="mx-2 hover:text-amber">
          Facebook
        </a>
        <a href={REDES.tiktok} target="_blank" rel="noreferrer" className="mx-2 hover:text-amber">
          TikTok
        </a>
      </p>
    </footer>
  );
}
