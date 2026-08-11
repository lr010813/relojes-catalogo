# Catálogo de Relojes

Proyecto Next.js 14 + TypeScript + Tailwind con catálogo de relojes,
enlaces a redes sociales, pasarela de pago (Culqi) y panel de admin.

## 1. Instalar y correr en tu computadora

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000

## 2. Personalizar

- **Datos del negocio y redes sociales**: edita `lib/config.ts`
  (WhatsApp, Instagram, Facebook, TikTok, nombre de la tienda).
- **Productos iniciales**: edita `data/productos.json`, o usa el panel
  de administración en `/admin` una vez desplegado.
- **Colores y tipografía**: `tailwind.config.ts`.

## 3. Configurar Culqi (pasarela de pago)

1. Crea una cuenta en https://culqi.com
2. Ve a "Llaves API" y copia tu llave pública (`pk_...`) y privada (`sk_...`)
3. En desarrollo, ponlas en `.env.local`. En Vercel, en
   Project Settings → Environment Variables:
   - `NEXT_PUBLIC_CULQI_PUBLIC_KEY`
   - `CULQI_SECRET_KEY`
4. Mientras estés en modo prueba, usa las tarjetas de prueba que Culqi
   documenta en su web — no se te cobra nada real.
5. Cuando Culqi apruebe tu cuenta para producción, cambia las llaves
   `pk_test_/sk_test_` por las de producción `pk_live_/sk_live_`.

## 4. Panel de administración

Ve a `/admin`, ingresa la clave que pusiste en `ADMIN_PASSWORD`, y ahí
puedes agregar, editar o eliminar relojes sin tocar código.

**Importante sobre el panel en producción**: el panel guarda los
cambios escribiendo en `data/productos.json`. Esto funciona perfecto
en tu computadora, pero en Vercel el sistema de archivos es de solo
lectura una vez desplegado — los cambios que hagas ahí en producción
NO se guardarán permanentemente. Para que el panel funcione en
producción, lo más simple es conectar una base de datos gratuita
(Vercel Postgres o Supabase son buenas opciones) y cambiar las
funciones `leerProductos`/`guardarProductos` en `lib/productos.ts`
para leer/escribir ahí en vez del archivo JSON. Si quieres, puedo
ayudarte con ese paso cuando estés listo para producción.

## 5. Desplegar en Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repositorio de GitHub directamente desde vercel.com/new.
No olvides agregar las variables de entorno en el dashboard de Vercel
antes del primer deploy en producción.

## 6. Estructura del proyecto

```
app/
  page.tsx           → página principal (hero + catálogo)
  admin/page.tsx      → panel de administración
  api/pagar/route.ts  → procesa el cobro con Culqi (llave privada)
  api/productos/route.ts → guarda/lee productos del admin
components/
  Header.tsx          → navegación + redes sociales
  CatalogoGrid.tsx     → filtro por marca
  ProductoCard.tsx     → tarjeta de producto + botón de compra
lib/
  config.ts            → nombre del negocio y links de redes sociales
  productos.ts          → lectura/escritura del catálogo
data/
  productos.json        → tus relojes
```
