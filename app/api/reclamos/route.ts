import { NextRequest, NextResponse } from "next/server";
import { LEGAL } from "@/lib/config";
import { enviarEmail } from "@/lib/email";
import { generarCodigoReclamo, type ReclamoPayload } from "@/lib/reclamos";

const RECLAMOS_TO = process.env.RECLAMOS_EMAIL || "meridianorelojes@gmail.com";
const RECLAMOS_FROM = "MERIDIANO <reclamos@meridiano.app>";

function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function validar(body: Record<string, unknown>): ReclamoPayload | string {
  const nombres = texto(body.nombres);
  const apellidoPaterno = texto(body.apellidoPaterno);
  const tipoDocumento = texto(body.tipoDocumento);
  const numeroDocumento = texto(body.numeroDocumento);
  const email = texto(body.email);
  const telefono = texto(body.telefono);
  const tipo = texto(body.tipo);
  const productoServicio = texto(body.productoServicio);
  const montoReclamado = texto(body.montoReclamado);
  const detalle = texto(body.detalle);
  const pedidoConsumidor = texto(body.pedidoConsumidor);

  if (!nombres || !apellidoPaterno) return "Indica tus nombres y apellido paterno.";
  if (tipoDocumento !== "DNI" && tipoDocumento !== "CE") return "Selecciona un tipo de documento válido.";
  if (!numeroDocumento) return "Indica el número de documento.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Indica un correo electrónico válido.";
  if (tipo !== "Reclamo" && tipo !== "Queja") return "Selecciona si es un reclamo o una queja.";
  if (!productoServicio) return "Describe el producto o servicio contratado.";
  if (!detalle) return "Detalla tu reclamo o queja.";
  if (!pedidoConsumidor) return "Indica qué solicitas como solución.";

  return {
    nombres,
    apellidoPaterno,
    tipoDocumento,
    numeroDocumento,
    email,
    telefono: telefono || undefined,
    tipo,
    productoServicio,
    montoReclamado: montoReclamado || undefined,
    detalle,
    pedidoConsumidor,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const validado = validar(body);
    if (typeof validado === "string") {
      return NextResponse.json({ ok: false, error: validado }, { status: 400 });
    }

    const codigo = await generarCodigoReclamo();
    const lineas = [
      `Código: ${codigo}`,
      `Tipo: ${validado.tipo}`,
      "",
      "— Establecimiento —",
      `Razón social: ${LEGAL.razonSocial}`,
      `RUC: ${LEGAL.ruc}`,
      `Nombre comercial: ${LEGAL.nombreComercial}`,
      `Dirección: ${LEGAL.direccion}`,
      "",
      "— Consumidor —",
      `Nombres: ${validado.nombres}`,
      `Apellido paterno: ${validado.apellidoPaterno}`,
      `Documento: ${validado.tipoDocumento} ${validado.numeroDocumento}`,
      `Correo: ${validado.email}`,
      `Teléfono: ${validado.telefono || "(no indicado)"}`,
      "",
      "— Detalle —",
      `Producto/servicio: ${validado.productoServicio}`,
      `Monto reclamado: ${validado.montoReclamado || "(no indicado)"}`,
      `Detalle: ${validado.detalle}`,
      `Pedido del consumidor: ${validado.pedidoConsumidor}`,
    ].join("\n");

    try {
      await enviarEmail({
        to: RECLAMOS_TO,
        from: RECLAMOS_FROM,
        replyTo: validado.email,
        subject: `[Libro de reclamaciones] ${codigo} — ${validado.tipo}`,
        text: lineas,
      });
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "No se pudo enviar el reclamo por correo.";
      const status = mensaje.includes("RESEND_API_KEY") ? 500 : 502;
      return NextResponse.json({ ok: false, error: mensaje }, { status });
    }

    return NextResponse.json({ ok: true, codigo });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno al registrar el reclamo." }, { status: 500 });
  }
}
