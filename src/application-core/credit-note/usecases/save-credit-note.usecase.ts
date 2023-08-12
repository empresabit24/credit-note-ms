import { HttpStatus, Injectable } from "@nestjs/common";
import { CreditNoteService } from "../../../infraestructure/persistence/services/credit-note.service";
import { CreateCreditNoteDTO } from "../dto/create-credit-note.dto";

@Injectable()
export class SaveCreditNoteUseCase {
    constructor(private readonly creditNoteService: CreditNoteService) {}
    async execute(data: CreateCreditNoteDTO) {
        try {
            const responseCreateCreditNote = await this.creditNoteService.create(data);

            return {
                success: true,
                message: 'Save a new credit note successfully!',
                response: responseCreateCreditNote,
                httpStatus: HttpStatus.OK,
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error to create a new credit note!',
                code: error.code,
                response: error,
                httpStatus: error.status,
            }
        }
    }
}