import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ProductoGaleria from "@/components/ProductoGaleria";
import BotonCompra from "@/components/BotonCompra";
import { obtenerProducto } from "@/lib/productos";
import { NEGOCIO, REDES } from "@/lib/config";

export default async function RelojPage({ params }: { params: { id: string } }) {
  const producto = await obtenerProducto(params.id);
  if (!producto) notFound();

  return (
    <>
      <Script src="https://checkout.culqi.com/js/v4" strategy="afterInteractive" />
      <Header />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <Link
            href="/#catalogo"
            className="font-mono text-[11px] uppercase tracking-widest2 text-taupe transition hover:text-amber"
          >
            ← Volver al catálogo
          </Link>

          <div className="mt-6">
            <ProductoGaleria
              imagenes={producto.imagenes}
              alt={`${producto.marca} ${producto.modelo}`}
            />
          </div>

          <div className="mt-8 border border-line/40 bg-panel p-5">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
              {producto.categoria} · {producto.genero}
            </span>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest2 text-taupe">
              {producto.marca}
            </p>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
              {producto.modelo}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-taupe">{producto.descripcion}</p>

            <div className="mt-5 flex items-center justify-between border-t border-line/40 pt-4">
              <span className="font-mono text-xl text-amber">
                {producto.moneda === "PEN" ? "S/" : "$"}{" "}
                {producto.precio.toLocaleString("es-PE")}
              </span>
              <span className="text-[11px] text-taupe">
                {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
              </span>
            </div>

            <div className="mt-4">
              <BotonCompra producto={producto} />
            </div>
          </div>
        </div>
      </main>

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
