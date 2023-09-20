import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreditNoteService } from '../../../infraestructure/persistence/services/credit-note.service';

@Injectable()
export class GetAllCreditNoteUseCase {
  private logger = new Logger(GetAllCreditNoteUseCase.name);

  constructor(private readonly creditNoteService: CreditNoteService) {}

  async execute() {
    try {
      this.logger.log('Obtiene todas las notas de crédito.');
      const getAllCreditNotesResponse = await this.creditNoteService.getAll();

      this.logger.log('Se obtuvo con éxito las notas de crédito.');
      return {
        success: true,
        message: 'Save a new credit note successfully!',
        response: getAllCreditNotesResponse,
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
}
