import { z } from 'zod';

const envSchema = z.object({
  DB_TYPE: z.enum(['postgres']),
  DB_HOST: z.string(),
  DB_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  SERVER_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()),
  REDIS_CLIENT_SECRET: z.string(),
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
