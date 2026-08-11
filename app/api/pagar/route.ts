import { NextRequest, NextResponse } from "next/server";

// La llave PRIVADA de Culqi vive solo aquí, en el servidor, nunca en el
// código del navegador. Se configura como variable de entorno.
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { token, monto, moneda, producto } = await req.json();

    if (!CULQI_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Falta configurar CULQI_SECRET_KEY en el servidor." },
        { status: 500 }
      );
    }

    const respuesta = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CULQI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: monto,
        currency_code: moneda,
        email: "cliente@ejemplo.com", // idealmente pide el email real en un form antes de pagar
        source_id: token,
        description: producto,
      }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      return NextResponse.json({ ok: false, error: data?.user_message || "Cobro rechazado" }, { status: 400 });
    }

    // Aquí es un buen lugar para: descontar stock, guardar la orden en tu
    // base de datos, y enviar notificación por WhatsApp/email.

    return NextResponse.json({ ok: true, cargo: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno al procesar el pago." }, { status: 500 });
  }
}
