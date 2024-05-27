import { config } from 'dotenv';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post, Updoot, User } from './entities';
import { stringToBoolean } from '../../utils/stringToBoolean';
import path from 'path';
config();

const dataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: stringToBoolean(process.env.DB_SYNCHRONIZE),
  logging: stringToBoolean(process.env.DB_LOGGING),
  entities: [Post, User, Updoot],
  migrations: [path.join(__dirname, './migrations/*')],
});

export default dataSource;
