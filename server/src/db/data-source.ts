import { config } from 'dotenv';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';

config();

const pgDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Post, User],
});

export default pgDataSource;
