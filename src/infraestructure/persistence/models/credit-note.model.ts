import { Model, Table, Column, PrimaryKey, IsUUID, AutoIncrement } from "sequelize-typescript";

@Table({ tableName: 'credit_notes', schema: 'sch_main' })
export class CreditNote extends Model <CreditNote> {
    @AutoIncrement
    @PrimaryKey
    @Column({ allowNull: true, unique: true })
    id?: string;

    @Column({ allowNull: false })
    series: string;

    @Column({ allowNull: false, unique: true })
    correlative: string;

    @Column({ allowNull: false })
    reason: string;

    @Column({ allowNull: true })
    observations: string;
}