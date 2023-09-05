import { Module } from '@nestjs/common';
import { SaveCreditNoteUseCase } from './credit-note';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';

@Module({
  imports: [InfraestructureModule],
  providers: [SaveCreditNoteUseCase],
  exports: [SaveCreditNoteUseCase],
})
export class ApplicationCoreModule {}
