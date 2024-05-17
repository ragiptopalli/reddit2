import { dbEnv } from '../../util/databaseEnvSchema';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from './entities/Post';

export const PostgresDataSource = new DataSource({
  type: dbEnv.DB_TYPE,
  host: dbEnv.DB_HOST,
  port: dbEnv.DB_PORT,
  username: dbEnv.DB_USERNAME,
  password: dbEnv.DB_PASSWORD,
  database: dbEnv.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Post],
});
