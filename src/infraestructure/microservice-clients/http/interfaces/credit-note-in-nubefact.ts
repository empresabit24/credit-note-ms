interface ISaleOnCreditInNubefact {
  cuota: number;
  fecha_de_pago: string;
  importe: number;
}

interface IGuideInNubeFact {
  guia_tipo: number;
  guia_serie_numero: string;
}

export interface IItemInNubefact {
  unidad_de_medida: string;
  codigo: string;
  codigo_producto_sunat?: string;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  precio_unitario: number;
  descuento?: number;
  subtotal: number;
  tipo_de_igv: number;
  igv: number;
  total: number;
  anticipo_regularizacion?: boolean;
  anticipo_documento_serie?: string;
  anticipo_documento_numero?: number;
}

export class CreditNoteInNubefact {
  private operacion: string;
  private tipo_de_comprobante: number;
  private serie: string;
  private numero: number;
  private cliente_tipo_de_documento: number;
  private cliente_numero_de_documento: string;
  private cliente_denominacion: string;
  private cliente_direccion: string;
  private cliente_email?: string;
  private cliente_email_1?: string;
  private cliente_email_2?: string;
  private fecha_de_emision: string;
  private fecha_de_vencimiento?: string;
  private moneda: string;
  private tipo_de_cambio: string;
  private porcentaje_de_igv: number;
  private descuento_global: number;
  private total_descuento: number;
  private total_anticipo: number;
  private total_gravada: number;
  private total_inafecta: number;
  private total_exonerada: number;
  private total_igv: number;
  private total_gratuita: number;
  private total_otros_cargos: number;
  private total: number;
  private percepcion_tipo: number;
  private percepcion_base_imponible: number;
  private total_percepcion: number;
  private total_incluido_percepcion: number;
  private retencion_tipo: number;
  private retencion_base_imponible: number;
  private total_retencion: number;
  private total_impuestos_bolsas: number;
  private detraccion: boolean;
  private observaciones: string;
  private documento_que_se_modifica_tipo: number;
  private documento_que_se_modifica_serie: string;
  private documento_que_se_modifica_numero: number;
  private tipo_de_nota_de_credito: number;
  private enviar_automaticamente_a_la_sunat: boolean;
  private enviar_automaticamente_al_cliente: boolean;
  private condiciones_de_pago: string;
  private medio_de_pago: string;
  private placa_vehiculo: string;
  private orden_compra_servicio: string;
  private formato_de_pdf: string;
  private generado_por_contingencia: boolean;
  private bienes_region_selva: boolean;
  private servicios_region_selva: boolean;
  private items: IItemInNubefact[];
  private guias: IGuideInNubeFact[];
  private venta_al_credito: ISaleOnCreditInNubefact[];

  constructor(
    series: string,
    correlative: number,
    documentTypeClient: number,
    documentNumberClient: string,
    denominationClient: string,
    addressClient: string,
    date: string,
    exchangeRate: string,
    creditNoteType: number,
    documentTypeToChange: number,
    documentCorrelativeToChange: number,
    documentSeriesToChange: string,
    items: IItemInNubefact[],
  ) {
    this.operacion = 'generar_comprobante';
    this.tipo_de_comprobante = 3; // 3 | Is the number for credit note
    this.serie = series;
    this.numero = correlative;
    this.cliente_tipo_de_documento = documentTypeClient;
    this.cliente_numero_de_documento = documentNumberClient;
    this.cliente_denominacion = denominationClient;
    this.cliente_direccion = addressClient;
    this.fecha_de_emision = date;
    this.moneda = '1'; // '1' | S/. PEN -- '2' | $ USD
    this.tipo_de_cambio = exchangeRate;
    this.tipo_de_nota_de_credito = creditNoteType;
    this.documento_que_se_modifica_numero = documentCorrelativeToChange;
    this.documento_que_se_modifica_serie = documentSeriesToChange;
    this.documento_que_se_modifica_tipo = documentTypeToChange;
    this.items = items;
  }
}
