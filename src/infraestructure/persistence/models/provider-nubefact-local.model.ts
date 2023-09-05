import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'fe_provider_nubefact_locales',
  schema: 'sch_main',
  timestamps: false,
})
export class FeProviderNubefactLocal extends Model<FeProviderNubefactLocal> {
  @AutoIncrement
  @PrimaryKey
  @Column
  idprovidernubefactlocal?: string;

  @Column
  idlocal: string;

  @Column
  token: string;

  @Column
  uri: string;

  @Column
  creditNoteSeries: string;
}
