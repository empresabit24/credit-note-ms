import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreditNote } from "../models/credit-note.model";
import { uuid } from "uuidv4";
import { CreateCreditNoteDTO } from "../../../application-core/credit-note/dto/create-credit-note.dto";

@Injectable()
export class CreditNoteService {
    constructor(
        @InjectModel(CreditNote)
        private creditNoteModel: typeof CreditNote
    ) {}

    async create(creditNote: CreateCreditNoteDTO): Promise<CreditNote> {
        return this.creditNoteModel.create(creditNote);
    }
}