import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'credit_notes', schema: 'sch_main' })
export class CreditNote extends Model<CreditNote> {
  @AutoIncrement
  @PrimaryKey
  @Column({ allowNull: true, unique: true })
  id?: string;

  @Column({ allowNull: false })
  idLocal: string;

  @Column({ allowNull: false })
  series: string;

  @Column({ allowNull: false })
  correlative: string;

  @Column({ allowNull: false })
  currentDocument: string;

  @Column({ allowNull: false })
  type: string;

  @Column({ allowNull: true })
  linkPdf: string;

  @Column({ allowNull: false })
  tipo_cambio: number;
}
