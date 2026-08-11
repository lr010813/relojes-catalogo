import { NextRequest, NextResponse } from "next/server";
import { leerProductos, guardarProductos, Producto } from "@/lib/productos";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cambia-esta-clave";

function autorizado(req: NextRequest) {
  const clave = req.headers.get("x-admin-password");
  return clave === ADMIN_PASSWORD;
}

export async function GET() {
  return NextResponse.json(await leerProductos());
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const productos: Producto[] = await req.json();
  guardarProductos(productos);
  return NextResponse.json({ ok: true });
}
