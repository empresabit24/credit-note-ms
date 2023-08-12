import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { CreditNoteController } from './controllers/credit-note.controller';

@Module({
    imports: [ApplicationCoreModule],
	controllers: [CreditNoteController],
	providers: [],
})
export class UserInterfaceModule {}
