import { HttpStatus, Injectable } from '@nestjs/common';
import { CreditNoteService } from '../../../infraestructure/persistence/services/credit-note.service';
import { CreateCreditNoteDTO } from '../dto/create-credit-note.dto';
import { FeProviderNubefactLocalService } from '../../../infraestructure/persistence/services/fe-provider-nubefact-local.service';
import { NubefactClient } from '../../../infraestructure/microservice-clients/http/nubefact.client';
import {
  CreditNoteInNubefact,
  IItemInNubefact,
} from 'src/infraestructure/microservice-clients/http/interfaces/credit-note-in-nubefact';
import * as moment from 'moment';

@Injectable()
export class SaveCreditNoteUseCase {
  constructor(
    private readonly creditNoteService: CreditNoteService,
    private readonly feProviderNubefactLocalService: FeProviderNubefactLocalService,
    private readonly nubefactClient: NubefactClient,
  ) {}
  async execute(data: CreateCreditNoteDTO) {
    try {
      const providerNubefactLocalResponse =
        await this.feProviderNubefactLocalService.findByLocal(data.idLocal);

      const correlative = await this.getCorrelative();

      const date = moment().format('DD-MM-YYYY');
      const { items, sumTotal, sumTotalBase, sumTotalIgv } =
        this.getMappedItemsAndTotals(data.items);

      const currentDocument = {
        items,
        document: {
          typeId: data.documentTypeToChange,
          series: data.documentSeriesToChange,
          correlative: data.documentCorrelativeToChange,
        },
        client: {
          documentType: data.documentTypeClient,
          documentNumber: data.documentNumberClient,
          denomination: data.denominationClient,
          address: data.addressClient,
        },
      };

      const type = {
        typeId: data.creditNoteType,
      };

      // save in bbdd
      await this.creditNoteService.create({
        idLocal: String(data.idLocal),
        series: providerNubefactLocalResponse.creditNoteSeries,
        correlative,
        currentDocument: JSON.stringify(currentDocument),
        type: JSON.stringify(type),
      });

      // create nubefact object
      const creditNoteInNubefactPayload = new CreditNoteInNubefact(
        providerNubefactLocalResponse.creditNoteSeries,
        Number(correlative),
        Number(data.documentTypeClient),
        data.documentNumberClient,
        data.denominationClient,
        data.addressClient,
        date,
        Number(data.creditNoteType),
        data.documentTypeToChange,
        data.documentCorrelativeToChange,
        data.documentSeriesToChange,
        sumTotal,
        sumTotalBase,
        sumTotalIgv,
        items,
      );

      // save in nubefact
      const nubefactClientResponse =
        await this.nubefactClient.generateCreditNote(
          providerNubefactLocalResponse.uri,
          providerNubefactLocalResponse.token,
          creditNoteInNubefactPayload,
        );

      return {
        success: true,
        message: 'Save a new credit note successfully!',
        response: nubefactClientResponse.data,
        httpStatus: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error to create a new credit note!',
        code: error.response?.data?.codigo || error.code,
        response: error.response?.data?.errors || error,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getCorrelative() {
    const creditNotesResponse = await this.creditNoteService.getLast();
    if (creditNotesResponse.length === 0) return String(1);
    return String(Number(creditNotesResponse[0].correlative) + 1);
  }

  getMappedItemsAndTotals(items: any[]) {
    let sumTotal = 0;
    let sumTotalBase = 0;
    let sumTotalIgv = 0;

    const currentItems = items.map((item) => {
      const unitValue = parseFloat((item.unitPrice / 1.18).toFixed(10));
      const igvTotal = parseFloat(
        ((item.unitPrice - unitValue) * item.quantity).toFixed(10),
      );
      const subTotal = parseFloat((unitValue * item.quantity).toFixed(10));
      const total = parseFloat((item.unitPrice * item.quantity).toFixed(10));

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
        precio_unitario: item.unitPrice,
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
