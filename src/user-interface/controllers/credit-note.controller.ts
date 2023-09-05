import { Body, Controller, Post, HttpException, UseGuards } from '@nestjs/common';
import { SaveCreditNoteUseCase } from '../../application-core/credit-note/usecases/save-credit-note.usecase';
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CreateCreditNoteDTO } from '../../application-core/credit-note/dto/create-credit-note.dto';

@ApiHeader({
    name: 'Authorization',
    description: 'JWT token, with prefix="Bearer"'
})
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