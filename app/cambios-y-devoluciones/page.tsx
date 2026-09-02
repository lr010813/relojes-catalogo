import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";
import { LEGAL } from "@/lib/config";

export default function CambiosYDevolucionesPage() {
  return (
    <LegalPageShell title="Cambios y devoluciones" eyebrow="Política comercial">
      <div className="border border-line/40 bg-panel p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">Identificación del negocio</p>
        <p className="mt-2 text-ink">
          <span className="font-medium">{LEGAL.razonSocial}</span>
          <span className="text-taupe"> · RUC {LEGAL.ruc}</span>
        </p>
        <p className="mt-1 text-taupe">
          Nombre comercial: <span className="text-ink">{LEGAL.nombreComercial}</span>
        </p>
      </div>

      <LegalSection title="1. Plazo para solicitar un cambio">
        <p>
          Puedes solicitar un cambio dentro de los siete (7) días calendario siguientes a la recepción
          del producto, siempre que se cumplan las condiciones indicadas abajo. Contáctanos por el
          correo o WhatsApp publicados en el sitio, indicando el número de pedido y el motivo.
        </p>
      </LegalSection>

      <LegalSection title="2. Condiciones del producto">
        <p>Para aceptar el cambio, el reloj debe:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>No haber sido usado ni presentar signos de uso (rayaduras, golpes, humedad).</li>
          <li>Conservar el embalaje original, protectores, etiquetas y accesorios incluidos.</li>
          <li>Estar acompañado de la constancia o comprobante de compra.</li>
        </ul>
        <p>
          No se aceptan cambios de productos personalizados, dañados por mal uso o fuera del plazo
          indicado, salvo obligación legal distinta.
        </p>
      </LegalSection>

      <LegalSection title="3. Producto con defecto de fábrica o daño en el envío">
        <p>
          Si el reloj llega con defecto de fabricación o daño atribuible al transporte, comunícalo a
          la brevedad con fotos claras del producto y del embalaje. Evaluaremos el caso y, según
          corresponda, ofreceremos reparación, reemplazo o devolución del importe, de conformidad con
          la normativa de protección al consumidor.
        </p>
      </LegalSection>

      <LegalSection title="4. Cómo se procesa el reembolso">
        <p>
          Cuando proceda un reembolso, se gestionará por el mismo medio de pago utilizado a través de
          Culqi, en la medida en que la pasarela y el banco emisor lo permitan. Los plazos de
          acreditación dependen de la entidad financiera del comprador. Te informaremos cuando el
          proceso haya sido iniciado.
        </p>
      </LegalSection>

      <LegalSection title="5. Costos de envío en cambios">
        <p>
          Si el cambio se debe a un error o defecto atribuible a {LEGAL.nombreComercial}, asumiremos
          los costos razonables de retiro y reenvío. Si el cambio responde a preferencia del
          comprador (por ejemplo, otro modelo), los costos de envío pueden correr por cuenta del
          consumidor, salvo acuerdo distinto.
        </p>
      </LegalSection>

      <LegalSection title="6. Libro de reclamaciones">
        <p>
          Sin perjuicio de esta política, puedes registrar un reclamo o una queja en nuestro{" "}
          <a href="/libro-de-reclamaciones" className="text-amber underline-offset-2 hover:underline">
            Libro de Reclamaciones
          </a>
          , conforme a la normativa peruana vigente.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
