import { NextRequest, NextResponse } from "next/server";
import { calcularPedido, PedidoError, type LineaPedidoInput } from "@/lib/pedido";

// La llave PRIVADA de Culqi vive solo aquí, en el servidor, nunca en el
// código del navegador. Se configura como variable de entorno.
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body?.token;
    // El cliente solo envía token + líneas. El monto se recalcula en el servidor.
    const items = body?.items as LineaPedidoInput[] | undefined;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ ok: false, error: "Falta el token de Culqi." }, { status: 400 });
    }

    if (!CULQI_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Falta configurar CULQI_SECRET_KEY en el servidor." },
        { status: 500 }
      );
    }

    let pedido;
    try {
      pedido = await calcularPedido(items || []);
    } catch (err) {
      const mensaje = err instanceof PedidoError ? err.message : "No se pudo validar el pedido.";
      return NextResponse.json({ ok: false, error: mensaje }, { status: 400 });
    }

    const respuesta = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CULQI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: pedido.montoCentimos,
        currency_code: pedido.moneda,
        email: "cliente@ejemplo.com",
        source_id: token,
        description: pedido.descripcion,
      }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      return NextResponse.json(
        { ok: false, error: data?.user_message || "Cobro rechazado" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      cargoId: data?.id || null,
      pedido: {
        lineas: pedido.lineas,
        total: pedido.total,
        moneda: pedido.moneda,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno al procesar el pago." }, { status: 500 });
  }
}
