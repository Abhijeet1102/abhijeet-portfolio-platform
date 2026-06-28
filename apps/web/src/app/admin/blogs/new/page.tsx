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

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  categories: z.string().min(1, "Categories required (comma separated)"),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function NewBlogPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'DRAFT',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const payload = {
        ...data,
        categories: data.categories.split(',').map(c => c.trim()),
      };
      await api.post('/blogs', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog created successfully');
      router.push('/admin/blogs');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create blog');
    }
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Blog Article</h1>
        <Link href="/admin/blogs" className="text-sm text-muted-foreground hover:underline">
          Back to Blogs
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
            <label className="text-sm font-medium">Excerpt</label>
            <textarea 
              {...register('excerpt')}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            />
            {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content (Markdown)</label>
            <textarea 
              {...register('content')}
              className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono" 
              placeholder="# Markdown supported..."
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories (comma separated)</label>
              <input 
                {...register('categories')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Engineering, Personal"
              />
              {errors.categories && <p className="text-sm text-destructive">{errors.categories.message}</p>}
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

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
