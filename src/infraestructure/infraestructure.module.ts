import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CreditNote } from "./persistence/models/credit-note.model";
import { CreditNoteService } from './persistence/services/credit-note.service';
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[SequelizeModule.forFeature([CreditNote]),
      JwtModule.register({
          global: true,
          signOptions: {expiresIn: '60s'}
      })
    ],
    providers: [CreditNoteService],
    exports: [CreditNoteService],
})
export class InfraestructureModule {}
