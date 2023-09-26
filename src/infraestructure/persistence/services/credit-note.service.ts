import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreditNote } from '../models/credit-note.model';
import { CreateCreditNoteDTO } from 'src/application-core/credit-note/dto/create-credit-note.dto';

@Injectable()
export class CreditNoteService {
  constructor(
    @InjectModel(CreditNote)
    private creditNoteModel: typeof CreditNote,
  ) {}

  async create(creditNote: {
    idLocal: string;
    series: string;
    correlative: string;
    currentDocument: string;
    type: string;
  }): Promise<CreditNote> {
    return this.creditNoteModel.create(creditNote);
  }

  async getLast(): Promise<CreditNote[]> {
    return this.creditNoteModel.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
  }

  async getAll(): Promise<CreditNote[]> {
    return this.creditNoteModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }
}
