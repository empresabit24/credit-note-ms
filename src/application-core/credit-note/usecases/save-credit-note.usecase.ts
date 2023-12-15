import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreditNoteService } from '../../../infraestructure/persistence/services/credit-note.service';
import { CreateCreditNoteDTO } from '../dto/create-credit-note.dto';
import { FeProviderNubefactLocalService } from '../../../infraestructure/persistence/services/fe-provider-nubefact-local.service';
import { NubefactClient } from '../../../infraestructure/microservice-clients/http/nubefact.client';
import { CreditNoteInNubefact } from 'src/infraestructure/microservice-clients/http/interfaces/credit-note-in-nubefact';
import * as moment from 'moment';

@Injectable()
export class SaveCreditNoteUseCase {
  private logger = new Logger(SaveCreditNoteUseCase.name);

  constructor(
    private readonly creditNoteService: CreditNoteService,
    private readonly feProviderNubefactLocalService: FeProviderNubefactLocalService,
    private readonly nubefactClient: NubefactClient,
  ) {}
  async execute(data: CreateCreditNoteDTO) {
    this.logger.log(data);
    try {
      this.logger.log(
        'Busca el proveedor para nubefact por idlocal: ' + data.idLocal,
      );
      const providerNubefactLocalResponse =
        await this.feProviderNubefactLocalService.findByLocal(data.idLocal);

      this.logger.log('Obtiene el correlativo para la nota de crédito');
      const correlative = await this.getCorrelative();

      const tipo_cambio = data.documentToChange.tipo_cambio;
      this.logger.log('Obtiene el tipo de cambio ' + tipo_cambio);

      const moneda = data.documentToChange.moneda;
      this.logger.log('Obtiene la moneda' + moneda);

      this.logger.log('Obtiene los items mapeados');
      const { items, sumTotal, sumTotalBase, sumTotalIgv, sumTotalExonerada, sumTotalInafecta } =
        this.getMappedItemsAndTotals(data.items, tipo_cambio);

      const date = moment().utcOffset(-5).format('DD-MM-YYYY');

      const currentDocument = {
        items,
        documentToChange: data.documentToChange,
        client: data.client,
      };

      const type = {
        typeId: data.creditNoteType,
      };

      const currentSeries = currentDocument.documentToChange.series.includes(
        'F',
      )
        ? providerNubefactLocalResponse.creditNoteSeriesToFactura
        : providerNubefactLocalResponse.creditNoteSeriesToBoleta;

      this.logger.log('Guarda en bbdd la nota de crédito');
      const createCreditNote = await this.creditNoteService.create({
        idLocal: String(data.idLocal),
        series: currentSeries,
        correlative,
        currentDocument: JSON.stringify(currentDocument),
        type: JSON.stringify(type),
        tipo_cambio,
      });

      this.logger.log(
        'Construye el payload para nubefact de la nota de crédito',
      );
      const creditNoteInNubefactPayload = new CreditNoteInNubefact(
        currentSeries,
        Number(correlative),
        Number(data.client.documentType),
        data.client.documentNumber,
        data.client.denomination,
        data.client.address,
        date,
        Number(data.creditNoteType),
        data.documentToChange.typeId,
        data.documentToChange.correlative,
        data.documentToChange.series,
        moneda,
        tipo_cambio,
        sumTotal,
        sumTotalBase,
        sumTotalIgv,
        sumTotalExonerada,
        sumTotalInafecta,
        items,
      );
      this.logger.log(JSON.stringify(creditNoteInNubefactPayload, null, 2));

      this.logger.log('Guarda en nubefact la nota de crédito');
      const nubefactClientResponse =
        await this.nubefactClient.generateCreditNote(
          providerNubefactLocalResponse.uri,
          providerNubefactLocalResponse.token,
          creditNoteInNubefactPayload,
        );

      console.log(createCreditNote, nubefactClientResponse);

      await this.creditNoteService.updateLinkPdfById(
        nubefactClientResponse.data.enlace_del_pdf,
        createCreditNote?.dataValues?.id,
      );

      this.logger.log('Creó con éxito la nota de crédito');
      return {
        success: true,
        message: 'Save a new credit note successfully!',
        response: nubefactClientResponse.data,
        httpStatus: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Sucedió un error');
      return {
        success: false,
        message: 'Error to create a new credit note!',
        code: error.response?.data?.codigo || error.code,
        response: error.response?.data?.errors || error,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getCorrelative(): Promise<string> {
    const creditNotesResponse = await this.creditNoteService.getLast();
    if (creditNotesResponse.length === 0) return String(1);
    return String(Number(creditNotesResponse[0].correlative) + 1);
  }

  getMappedItemsAndTotals(
    items: any[],
    exchangeRate: number,
  ): {
    items: any[];
    sumTotal: number;
    sumTotalBase: number;
    sumTotalIgv: number;
    sumTotalExonerada: number;
    sumTotalInafecta: number;
  } {
    let sumTotal = 0;
    let sumTotalBase = 0;
    let sumTotalIgv = 0;
    let sumTotalExonerada = 0;
    let sumTotalInafecta = 0;

    const currentItems = items.map((item) => {
      // TOTAL 100
      const unitValue = parseFloat(
        (item.unitPrice / 1.18 / exchangeRate).toFixed(10),
      );

      // Check if item is affected by IGV
      if (item.afectacion_igv === 1) {
        const igvTotal = parseFloat( // IGV 15,25
            ((item.unitPrice / exchangeRate - unitValue) * item.quantity).toFixed(
                10,
            ),
        );
        const subTotal = parseFloat( // UNIT 84,71
            (unitValue * item.quantity).toFixed(10)
        );

        sumTotalBase += subTotal;
        sumTotalIgv += igvTotal;
      }

      const total = parseFloat(
        ((item.unitPrice / exchangeRate) * item.quantity).toFixed(10),
      );

      sumTotal += total;

      // Check if item is EXONERADA
      if (item.afectacion_igv === 2) {
        sumTotalExonerada += total;
      }

      // Check if item is INAFECTA
      if (item.afectacion_igv === 3) {
        sumTotalInafecta += total;
      }

      return {
        unidad_de_medida: item.unit,
        codigo: item.code,
        cantidad: item.quantity,
        descripcion: item.description,
        tipo_de_igv: item.afectacion_igv === 1 ? 1 : (item.afectacion_igv === 2 ? 8 : 9) , // 1 = Gravado - Operación Onerosa | 8 = Exonerado - Operación Onerosa | 9 = Inafecto - Operación Onerosa
        valor_unitario: item.afectacion_igv === 1 ? unitValue : item.unitPrice / exchangeRate,
        precio_unitario: item.unitPrice / exchangeRate,
        igv: item.afectacion_igv === 1 ? sumTotalIgv : 0,
        subtotal: item.afectacion_igv === 1 ? sumTotalBase : item.unitPrice / exchangeRate,
        total,
      };
    });

    return {
      items: currentItems,
      sumTotal,
      sumTotalBase,
      sumTotalIgv,
      sumTotalExonerada,
      sumTotalInafecta,
    };
  }
}
