import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    title: z.string().optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    profileImage: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
    socialLinks: z.object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    }).optional(),
    achievements: z.array(z.string()).optional(),
    availabilityStatus: z.enum(['AVAILABLE', 'OPEN_TO_OFFERS', 'NOT_AVAILABLE']).optional(),
    techStack: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
  })
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>['body'];
