import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Person } from './Person';

@Table({
  tableName: 'Affiliations'
})
export class Affiliation extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @BelongsToMany(() => Person, {
    through: 'PersonAffiliations',
    foreignKey: 'affiliationId',
    otherKey: 'personId'
  })
  people!: Person[];
}
