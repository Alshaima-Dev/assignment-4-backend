import { z } from "zod";

export const bookIdSchema = z.string()
  .regex(/^\d+$/, "Expected a positive integer ID")
  .transform(Number)
  .pipe(z.int().positive());

export const createBookSchema = z.strictObject({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  genre: z.string().trim().min(1),
  available: z.boolean(),
});

export const updateBookSchema = createBookSchema.partial().refine(
  (book) => Object.keys(book).length > 0,
  { message: "Provide at least one field to update" },
);

export type Book = z.infer<typeof createBookSchema> & { id: number };
export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;
