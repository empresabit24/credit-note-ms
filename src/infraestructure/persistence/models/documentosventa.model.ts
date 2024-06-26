import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'documentosventa', schema: 'sch_main', timestamps: false })
export class DocumentosVentaModel extends Model<DocumentosVentaModel> {
  @AutoIncrement
  @PrimaryKey
  @Column({ allowNull: true, unique: true })
  iddocumentoventa: number;

  @Column({ allowNull: false })
  serie: string;

  @Column({ allowNull: false })
  numerodocumento: string;

  @Column({ allowNull: false })
  idestado: number;
}
