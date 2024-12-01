import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Location } from './Location';
import { Affiliation } from './Affiliation';

@Table({
  tableName: 'People'
})
export class Person extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  weapon?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  vehicle?: string;

  @BelongsToMany(() => Location, {
    through: 'PersonLocations',
    foreignKey: 'personId',
    otherKey: 'locationId'
  })
  locations!: Location[];

  @BelongsToMany(() => Affiliation, {
    through: 'PersonAffiliations',
    foreignKey: 'personId',
    otherKey: 'affiliationId'
  })
  affiliations!: Affiliation[];
}
