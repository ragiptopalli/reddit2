import { buildSchema } from 'type-graphql';
import { PostResolver, UserResolver } from './typeorm/resolvers';

export const createSchema = buildSchema({
  resolvers: [PostResolver, UserResolver],
  validate: false,
});
