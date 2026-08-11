import type { Metadata } from "next";
import "./globals.css";
import { NEGOCIO } from "@/lib/config";

export const metadata: Metadata = {
  title: `${NEGOCIO.nombre} — ${NEGOCIO.eslogan}`,
  description: NEGOCIO.eslogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-body">{children}</body>
    </html>
  );
}
