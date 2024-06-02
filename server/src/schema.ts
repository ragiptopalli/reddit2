import { buildSchema } from 'type-graphql';
import {
  PostResolver,
  UserResolver,
  UpdootResolver,
} from './typeorm/resolvers';
import { DateTimeScalar } from './date';

export const createSchema = buildSchema({
  resolvers: [PostResolver, UserResolver, UpdootResolver],
  validate: false,
  scalarsMap: [{ type: Date, scalar: DateTimeScalar }],
});
