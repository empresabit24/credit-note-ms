import { Module } from '@nestjs/common';
import { SaveCreditNoteUseCase, GetAllCreditNoteUseCase } from './credit-note';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';

@Module({
  imports: [InfraestructureModule],
  providers: [SaveCreditNoteUseCase, GetAllCreditNoteUseCase],
  exports: [SaveCreditNoteUseCase, GetAllCreditNoteUseCase],
})
export class ApplicationCoreModule {}
