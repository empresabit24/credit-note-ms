/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreditNoteService } from '../../../infraestructure/persistence/services/credit-note.service';
import { CreateCreditNoteDTO } from '../dto/create-credit-note.dto';
import { FeProviderNubefactLocalService } from '../../../infraestructure/persistence/services/fe-provider-nubefact-local.service';
import { NubefactClient } from '../../../infraestructure/microservice-clients/http/nubefact.client';
import { CreditNoteInNubefact } from '../../../infraestructure/microservice-clients/http/interfaces/credit-note-in-nubefact';
import * as moment from 'moment';
import { ParameterService } from '../../../infraestructure/persistence/services/parameter.service';
require('dotenv').config({ path: '.env.local' });

@Injectable()
export class SaveCreditNoteUseCase {
  private logger = new Logger(SaveCreditNoteUseCase.name);

  constructor(
    private readonly creditNoteService: CreditNoteService,
    private readonly feProviderNubefactLocalService: FeProviderNubefactLocalService,
    private readonly parameterService: ParameterService,
    private readonly nubefactClient: NubefactClient,
  ) {}
  async execute(data: CreateCreditNoteDTO) {
    try {
      const limitDays = await this.parameterService.findByName(
        process.env.VARIABLE_NAME_CREDIT_NOTE_LIMIT,
      );
      const start = moment(data.documentToChange.dateOfIssue, 'YYYY-MM-DD');
      const end = moment().format('YYYY-MM-DD');

      const days = moment.duration(start.diff(end)).asDays() * -1;

      if (Number(days) > Number(limitDays.valor))
        throw new Error(
          'Ha excedido los días límite permitidos para crear la Nota de Crédito.',
        );

      this.logger.log(
        'Busca el proveedor para nubefact por idlocal: ' + data.idLocal,
      );
      const providerNubefactLocalResponse =
        await this.feProviderNubefactLocalService.findByLocal(data.idLocal);

      this.logger.log('Obtiene el correlativo para la nota de crédito');
      const correlative = await this.getCorrelative();

      const exchangeRate = data.documentToChange.exchangeRate;
      this.logger.log('Obtiene el tipo de cambio ' + exchangeRate);

      const currency = data.documentToChange.currency;
      this.logger.log('Obtiene la moneda' + currency);

      this.logger.log('Obtiene los items mapeados');
      const { items, sumTotal, sumTotalBase, sumTotalIgv } =
        this.getMappedItemsAndTotals(data.items, exchangeRate);

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
        tipo_cambio: exchangeRate,
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
        currency,
        exchangeRate,
        sumTotal,
        sumTotalBase,
        sumTotalIgv,
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
        message: error?.message || 'Error to create a new credit note!',
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
  } {
    let sumTotal = 0;
    let sumTotalBase = 0;
    let sumTotalIgv = 0;

    const currentItems = items.map((item) => {
      // TOTAL 4700
      const unitValue = parseFloat(
        (item.unitPrice / 1.18 / exchangeRate).toFixed(10),
      ); // UNIT 3983.05
      const igvTotal = parseFloat(
        ((item.unitPrice / exchangeRate - unitValue) * item.quantity).toFixed(
          10,
        ), // IGV 716,95
      );
      const subTotal = parseFloat((unitValue * item.quantity).toFixed(10));
      const total = parseFloat(
        ((item.unitPrice / exchangeRate) * item.quantity).toFixed(10),
      );

      sumTotal += total;
      sumTotalBase += subTotal;
      sumTotalIgv += igvTotal;

      return {
        unidad_de_medida: item.unit,
        codigo: item.code,
        cantidad: item.quantity,
        descripcion: item.description,
        tipo_de_igv: 1, // Gravado - Operación Onerosa
        valor_unitario: unitValue,
        precio_unitario: item.unitPrice / exchangeRate,
        igv: igvTotal,
        subtotal: subTotal,
        total,
      };
    });

    return {
      items: currentItems,
      sumTotal,
      sumTotalBase,
      sumTotalIgv,
    };
  }
}
