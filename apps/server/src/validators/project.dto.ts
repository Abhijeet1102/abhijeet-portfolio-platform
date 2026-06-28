import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    shortDescription: z.string().min(10, "Description must be at least 10 characters"),
    fullDescription: z.string().optional(),
    category: z.enum(['WEB', 'AI', 'MOBILE', 'FULLSTACK', 'OPENSOURCE', 'EXPERIMENTAL']).default('WEB'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    featured: z.boolean().default(false),
    technologies: z.array(z.string()).min(1, "At least one technology is required"),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
    githubRepository: z.string().url().optional(),
    liveDemo: z.string().url().optional(),
    caseStudy: z.string().optional(),
    problemStatement: z.string().optional(),
    solution: z.string().optional(),
    architecture: z.string().optional(),
    features: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    learnings: z.array(z.string()).optional(),
    metrics: z.array(z.string()).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
});

export const updateProjectSchema = z.object({
  body: createProjectSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, "ID is required")
  })
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>['body'];
