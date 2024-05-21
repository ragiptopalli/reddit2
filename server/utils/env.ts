import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DB_TYPE: z.enum(['postgres']),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  SERVER_PORT: z.coerce.number(),
  REDIS_CLIENT_SECRET: z.string(),
  DB_SYNCHRONIZE: z.string(),
  DB_LOGGING: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables:', result.error);
  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
