"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(['WEB', 'AI', 'MOBILE', 'FULLSTACK', 'OPENSOURCE', 'EXPERIMENTAL']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  technologies: z.string().min(1, "Technologies required (comma separated)"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'DRAFT',
      category: 'WEB',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()),
      };
      await api.post('/projects', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project created successfully');
      router.push('/admin/projects');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <Link href="/admin/projects" className="text-sm text-muted-foreground hover:underline">
          Back to Projects
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input 
              {...register('title')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <textarea 
              {...register('shortDescription')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            />
            {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="WEB">Web</option>
                <option value="AI">AI</option>
                <option value="MOBILE">Mobile</option>
                <option value="FULLSTACK">Fullstack</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies (comma separated)</label>
            <input 
              {...register('technologies')}
              placeholder="React, Next.js, Tailwind"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            />
            {errors.technologies && <p className="text-sm text-destructive">{errors.technologies.message}</p>}
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}