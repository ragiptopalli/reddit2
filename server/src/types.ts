import type { EntityManager } from 'typeorm';
import type { Request, Response } from 'express';
import type { Session } from 'express-session';
import { Field, InputType } from 'type-graphql';
import { Redis } from 'ioredis';

interface CustomExpressSession extends Session {
  userId: string | undefined;
}

export type Context = {
  manager: EntityManager;
  req: Request & { session: CustomExpressSession };
  res: Response;
  redis: Redis;
};

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
  @Field()
  email!: string;
}
