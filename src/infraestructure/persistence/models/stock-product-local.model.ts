import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'stockproductostienda',
  schema: 'sch_main',
  timestamps: false,
})
export class StockProductLocal extends Model<StockProductLocal> {
  @AutoIncrement
  @PrimaryKey
  @Column
  idstockproductotienda?: number;

  @Column
  idproductolocal: number;

  @Column
  idtienda: number;

  @Column
  stock: number;

  @Column
  stock_unidades: number;

  @Column
  stock_presentacion: number;
}
