import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { NEGOCIO } from "@/lib/config";
import SiteShell from "@/components/SiteShell";

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
      <body className="font-body">
        <Script src="https://checkout.culqi.com/js/v4" strategy="afterInteractive" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
