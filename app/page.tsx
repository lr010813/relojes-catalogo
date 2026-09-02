import Header from "@/components/Header";
import CatalogoGrid from "@/components/CatalogoGrid";
import { leerProductos, marcasUnicas } from "@/lib/productos";

// Revalida el catálogo del Sheet cada 60s en producción (ISR).
export const revalidate = 60;

export default async function Home() {
  const productos = await leerProductos();
  const marcas = marcasUnicas(productos);

  return (
    <>
      <Header />

      {/* Catálogo de frente — sin hero */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <CatalogoGrid productos={productos} marcas={marcas} />
        </div>
      </section>
    </>
  );
}
