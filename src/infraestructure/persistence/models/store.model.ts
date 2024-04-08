import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'tiendas',
  schema: 'sch_main',
  timestamps: false,
})
export class Store extends Model<Store> {
  @AutoIncrement
  @PrimaryKey
  @Column
  idtienda?: number;

  @Column
  prioridad: number;

  @Column
  idempresamatriz: number;

  @Column
  idlocal: number;
}
