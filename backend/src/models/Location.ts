import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Person } from './Person';

@Table({
  tableName: 'Locations'
})
export class Location extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @BelongsToMany(() => Person, {
    through: 'PersonLocations',
    foreignKey: 'locationId',
    otherKey: 'personId'
  })
  people!: Person[];
}
