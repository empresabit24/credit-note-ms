import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'parametros',
  schema: 'sch_main',
  timestamps: false,
})
export class Parameter extends Model<Parameter> {
  @AutoIncrement
  @PrimaryKey
  @Column
  idparametro?: string;

  @Column
  nombre: string;

  @Column
  valor: string;
}
