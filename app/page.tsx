import Script from "next/script";
import Header from "@/components/Header";
import CatalogoGrid from "@/components/CatalogoGrid";
import { leerProductos, marcasUnicas } from "@/lib/productos";
import { NEGOCIO, REDES } from "@/lib/config";

// Revalida el catálogo del Sheet cada 60s en producción (ISR).
export const revalidate = 60;

export default async function Home() {
  const productos = await leerProductos();
  const marcas = marcasUnicas(productos);

  return (
    <>
      {/* Script de Culqi Checkout, requerido para procesar pagos */}
      <Script src="https://checkout.culqi.com/js/v4" strategy="afterInteractive" />

      <Header />

      {/* Catálogo de frente — sin hero */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <CatalogoGrid productos={productos} marcas={marcas} />
        </div>
      </section>

      <footer className="border-t-2 border-amber px-6 py-10 text-center text-xs text-taupe">
        <p>
          {NEGOCIO.nombre} · {NEGOCIO.email}
        </p>
        <p className="mt-2">
          <a href={REDES.instagram} target="_blank" className="mx-2 hover:text-amber">
            Instagram
          </a>
          <a href={REDES.facebook} target="_blank" className="mx-2 hover:text-amber">
            Facebook
          </a>
          <a href={REDES.tiktok} target="_blank" className="mx-2 hover:text-amber">
            TikTok
          </a>
        </p>
      </footer>
    </>
  );
}
