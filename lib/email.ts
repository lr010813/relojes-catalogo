import { Resend } from "resend";

export type EnviarEmailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  /** Remitente. Por defecto RESEND_FROM_EMAIL o reclamos@meridiano.app */
  from?: string;
  replyTo?: string | string[];
};

const FROM_DEFAULT = "MERIDIANO <reclamos@meridiano.app>";

/**
 * Envío genérico con Resend (RESEND_API_KEY).
 * Reutilizable para reclamos, confirmaciones de pedido, etc.
 */
export async function enviarEmail(options: EnviarEmailOptions): Promise<{ id: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Falta configurar RESEND_API_KEY en el servidor.");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: options.from || process.env.RESEND_FROM_EMAIL || FROM_DEFAULT,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) {
    throw new Error(error.message || "No se pudo enviar el correo.");
  }

  return { id: data?.id ?? null };
}
