import { Module } from '@nestjs/common';
import {
  SaveCreditNoteUseCase,
  GetAllCreditNoteUseCase,
  ResetStockItemsCreditNoteUseCase,
} from './credit-note';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';

@Module({
  imports: [InfraestructureModule],
  providers: [
    SaveCreditNoteUseCase,
    GetAllCreditNoteUseCase,
    ResetStockItemsCreditNoteUseCase,
  ],
  exports: [
    SaveCreditNoteUseCase,
    GetAllCreditNoteUseCase,
    ResetStockItemsCreditNoteUseCase,
  ],
})
export class ApplicationCoreModule {}
