import { Injectable } from '@nestjs/common';
import { CreditNoteInNubefact } from './interfaces/credit-note-in-nubefact';
import axios from 'axios';

@Injectable()
export class NubefactClient {
  constructor() {}

  async generateCreditNote(
    urlNubefact: string,
    token: string,
    dataToCreditNote: CreditNoteInNubefact,
  ): Promise<any> {
    const headers = {
      Authorization: token,
      'Content-Type': 'Application/JSON',
    };
    const response = await axios.post(urlNubefact, dataToCreditNote, {
      headers,
    });

    return response;
  }
}
