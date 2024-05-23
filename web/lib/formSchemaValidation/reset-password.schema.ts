import { z } from 'zod';

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
