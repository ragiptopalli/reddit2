import { z } from 'zod';

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.',
    })
    .max(25, {
      message: "Title can't not be longer than 25 characters.",
    }),
  text: z.string().min(5, {
    message: 'Text must be at least 5 characters.',
  }),
});

export type UpdatePostSchemaType = z.infer<typeof updatePostSchema>;
