import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A DateTime scalar type',
  parseValue(value: any) {
    return new Date(value);
  },
  serialize(value: any) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
