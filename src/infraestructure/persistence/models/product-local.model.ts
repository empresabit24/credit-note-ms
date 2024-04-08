import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'productoslocal',
  schema: 'sch_main',
  timestamps: false,
})
export class ProductLocal extends Model<ProductLocal> {
  @AutoIncrement
  @PrimaryKey
  @Column
  idproductolocal?: number;

  @Column
  idproducto: number;

  @Column
  idlocal: number;
}
