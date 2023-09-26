import { Body, Controller, Post, HttpException, Get } from '@nestjs/common';
import {
  SaveCreditNoteUseCase,
  GetAllCreditNoteUseCase,
} from '../../application-core/credit-note';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreateCreditNoteDTO } from '../../application-core/credit-note/dto/create-credit-note.dto';

@ApiHeader({
  name: 'Authorization',
  description: 'JWT token, with prefix="Bearer"',
})
@Controller('credit-note')
@ApiTags('Credit Note')
export class CreditNoteController {
  constructor(
    private readonly saveCreditNoteUseCase: SaveCreditNoteUseCase,
    private readonly getAllCreditNoteUseCase: GetAllCreditNoteUseCase,
  ) {}

  @Post('')
  async save(@Body() payload: CreateCreditNoteDTO): Promise<IResponse> {
    const response = await this.saveCreditNoteUseCase.execute(payload);
    if (!response.success)
      throw new HttpException(response, response.httpStatus);
    return response;
  }

  @Get('')
  async getAll(): Promise<IResponse> {
    const response = await this.getAllCreditNoteUseCase.execute();
    if (!response.success)
      throw new HttpException(response, response.httpStatus);
    return response;
  }
}
