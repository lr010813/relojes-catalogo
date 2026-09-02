// Edita aquí los datos de tu negocio y tus redes sociales.
// Todo el sitio lee de este archivo, así que no necesitas tocar
// componentes para cambiar un link o el nombre de la tienda.

export const NEGOCIO = {
  nombre: "MERIDIANO",
  eslogan: "Relojes de marca, tiempo con carácter",
  whatsapp: "51999999999", // <-- tu número con código de país, sin '+'
  email: "contacto@tudominio.com",
};

/** Datos legales del establecimiento (libro de reclamaciones y páginas Culqi). */
export const LEGAL = {
  razonSocial: "PAY GESTION SAC",
  ruc: "20614922282",
  nombreComercial: "MERIDIANO",
  // Confirmar antes de publicar / aprobar Culqi.
  direccion: "Calle Bolognesi 180, Oficina 502, Miraflores, Lima, Perú",
};

export const REDES = {
  instagram: "https://instagram.com/tuusuario",
  facebook: "https://facebook.com/tuusuario",
  tiktok: "https://tiktok.com/@tuusuario",
  whatsapp: `https://wa.me/${NEGOCIO.whatsapp}`,
};

// Llave PÚBLICA de Culqi (empieza con pk_). NUNCA pongas aquí la llave
// privada (sk_) — esa va solo en la variable de entorno del servidor.
export const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || "";
