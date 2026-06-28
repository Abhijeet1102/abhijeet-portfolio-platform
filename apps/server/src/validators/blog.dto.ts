import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
    content: z.string().min(50, "Content must be at least 50 characters"),
    coverImage: z.string().url().optional(),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    tags: z.array(z.string()).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
  })
});

export const updateBlogSchema = z.object({
  body: createBlogSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, "ID is required")
  })
});

export type CreateBlogDto = z.infer<typeof createBlogSchema>['body'];
export type UpdateBlogDto = z.infer<typeof updateBlogSchema>['body'];
