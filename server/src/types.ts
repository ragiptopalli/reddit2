import type { EntityManager } from 'typeorm';
import type { Request, Response } from 'express';
import type { Session } from 'express-session';
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
