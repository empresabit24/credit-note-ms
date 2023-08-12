import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { SaveCreditNoteUseCase } from '../../application-core/credit-note/usecases/save-credit-note.usecase';
import { ApiTags } from '@nestjs/swagger';
import { CreateCreditNoteDTO } from '../../application-core/credit-note/dto/create-credit-note.dto';

@Controller('credit-note')
@ApiTags('Credit Note')
export class CreditNoteController {

    constructor(private readonly saveCreditNoteUseCase: SaveCreditNoteUseCase) {}

    @Post('')
    async save(@Body() payload: CreateCreditNoteDTO): Promise<IResponse> {
        const response = await this.saveCreditNoteUseCase.execute(payload);
        if (!response.success) throw new HttpException(response, response.httpStatus);
		return response;
    }

}