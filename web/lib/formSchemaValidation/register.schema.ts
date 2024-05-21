import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 2 characters.',
    })
    .max(12, {
      message: "Username can't not be longer than 12 characters.",
    }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
