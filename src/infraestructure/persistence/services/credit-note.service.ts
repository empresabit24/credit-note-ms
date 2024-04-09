import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreditNote } from '../models/credit-note.model';
import { CreateCreditNoteDTO } from 'src/application-core/credit-note/dto/create-credit-note.dto';
import { Op } from 'sequelize';

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
    tipo_cambio: number;
    linkPdf?: string;
  }): Promise<CreditNote> {
    return this.creditNoteModel.create(creditNote);
  }

  async updateLinkPdfById(linkPdf: string, id: string): Promise<any> {
    return this.creditNoteModel.update({ linkPdf }, { where: { id } });
  }

  async getLast(isFactura: boolean): Promise<CreditNote[]> {
    let series = isFactura ? 'F' : 'B';
    return this.creditNoteModel.findAll({
      limit: 1,
      order: [['correlative', 'DESC']],
      where: {
        series: {
          [Op.like]: `%${series}%`
        }
      }
    });
  }

  async getAll(): Promise<CreditNote[]> {
    return this.creditNoteModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }
}
