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
      // obtiene el token desde el servicio feProviderNubefactLocalService
      const providerNubefactLocalResponse =
        await this.feProviderNubefactLocalService.findByLocal(data.idlocal);

      const date = moment().format('DD-MM-YYYY');
      const items: IItemInNubefact[] = data.items.map((item) => {
        return {
          unidad_de_medida: item.unit,
          codigo: item.code,
          cantidad: item.quantity,
          descripcion: item.description,
          tipo_de_igv: 1, // Gravado - Operación Onerosa
          valor_unitario: item.unitCost,
          precio_unitario: item.unitPrice,
          igv: item.igv,
          subtotal: item.subtotal,
          total: item.total,
        };
      });

      const creditNoteInNubefactPayload = new CreditNoteInNubefact(
        data.series,
        Number(data.correlative),
        Number(data.documentTypeClient),
        data.documentNumberClient,
        data.denominationClient,
        '',
        date,
        '',
        Number(data.creditNoteType),
        data.documentTypeToChange,
        data.documentCorrelativeToChange,
        data.documentSeriesToChange,
        items,
      );

      // crear nota de crédito en nubefact
      const nubefactClientResponse =
        await this.nubefactClient.generateCreditNote(
          providerNubefactLocalResponse.uri,
          providerNubefactLocalResponse.token,
          creditNoteInNubefactPayload,
        );

      console.log(nubefactClientResponse);

      //
      const createCreditNoteResponse = await this.creditNoteService.create(
        data,
      );

      return {
        success: true,
        message: 'Save a new credit note successfully!',
        response: createCreditNoteResponse,
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
}
