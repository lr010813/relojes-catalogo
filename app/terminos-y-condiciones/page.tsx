import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";
import { LEGAL } from "@/lib/config";

export default function TerminosYCondicionesPage() {
  return (
    <LegalPageShell title="Términos y condiciones" eyebrow="Información legal">
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

      <LegalSection title="1. Ámbito de aplicación">
        <p>
          Estos términos regulan el uso de la tienda en línea {LEGAL.nombreComercial} y la compra de
          productos ofrecidos a través de este sitio web. Al realizar un pedido, el consumidor acepta
          estas condiciones.
        </p>
      </LegalSection>

      <LegalSection title="2. Condiciones de compra">
        <p>
          Los productos se ofrecen según disponibilidad de stock publicada en el catálogo. El pedido
          se formaliza al completar el pago a través de la pasarela habilitada. {LEGAL.nombreComercial}{" "}
          se reserva el derecho de cancelar pedidos por error manifiesto en precios, falta de stock o
          sospecha de fraude, en cuyo caso se informará al comprador y se gestionará la devolución del
          importe cobrado, si corresponde.
        </p>
      </LegalSection>

      <LegalSection title="3. Medios de pago">
        <p>
          Los pagos se procesan exclusivamente a través de Culqi. Medios aceptados: tarjetas de crédito
          y débito, y Yape, según la disponibilidad que Culqi habilite para el comercio. {LEGAL.nombreComercial}{" "}
          no almacena datos completos de tarjetas en sus servidores.
        </p>
      </LegalSection>

      <LegalSection title="4. Precios">
        <p>
          Los precios se muestran en la moneda indicada en cada producto (soles peruanos — PEN — salvo
          indicación distinta) e incluyen IGV cuando corresponda según la normativa tributaria vigente.
          {LEGAL.nombreComercial} puede actualizar precios sin aviso previo; el precio aplicable es el
          vigente al momento de confirmar el pago.
        </p>
      </LegalSection>

      <LegalSection title="5. Despacho y entrega">
        <p>
          Los tiempos de despacho y entrega se coordinan con el comprador tras la confirmación del
          pago, según la zona de envío y la disponibilidad del producto. Los plazos estimados se
          comunicarán por los canales de contacto publicados en el sitio. El comprador es responsable
          de proporcionar datos de contacto correctos para la coordinación.
        </p>
      </LegalSection>

      <LegalSection title="6. Propiedad intelectual">
        <p>
          Las fotografías, textos, marcas y demás contenidos de este sitio son propiedad de{" "}
          {LEGAL.razonSocial} o se utilizan con autorización. Queda prohibida su reproducción,
          distribución o uso comercial sin autorización previa por escrito.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilidad">
        <p>
          {LEGAL.nombreComercial} pondrá diligencia razonable en la operación de la tienda. No será
          responsable por interrupciones ajenas a su control (fallas de red, de la pasarela de pago o
          de terceros). Las reclamaciones sobre productos se atienden conforme a la política de
          cambios y devoluciones y a la normativa de protección al consumidor aplicable.
        </p>
      </LegalSection>

      <LegalSection title="8. Jurisdicción">
        <p>
          Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se
          someterá a los jueces y tribunales competentes del Perú, sin perjuicio de los derechos
          irrenunciables del consumidor.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
