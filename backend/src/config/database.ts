import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Person } from '../models/Person';
import { Location } from '../models/Location';
import { Affiliation } from '../models/Affiliation';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'csv_import_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
  models: [Person, Location, Affiliation],
});

export default sequelize;