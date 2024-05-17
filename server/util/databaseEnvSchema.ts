import { config } from 'dotenv';

import { z } from 'zod';

config();

const envSchema = z.object({
  DB_TYPE: z.enum(['postgres']),
  DB_HOST: z.string(),
  DB_PORT: z.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables: ', env.error.format());
  process.exit(1);
}

export const dbEnv = env.data;
