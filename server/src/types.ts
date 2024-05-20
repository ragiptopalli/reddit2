import type { EntityManager } from 'typeorm';
import type { Request, Response } from 'express';
import type { Session } from 'express-session';

interface CustomExpressSession extends Session {
  userId: string | null;
}

export type MyContext = {
  manager: EntityManager;
  req: Request & { session: CustomExpressSession };
  res: Response;
};
