import { buildSchema } from 'type-graphql';
import {
  PostResolver,
  UserResolver,
  UpdootResolver,
} from './typeorm/resolvers';

export const createSchema = buildSchema({
  resolvers: [PostResolver, UserResolver, UpdootResolver],
  validate: false,
});
