import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from './entities/Post';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'reddit2',
  synchronize: true,
  logging: true,
  entities: [Post],
});
