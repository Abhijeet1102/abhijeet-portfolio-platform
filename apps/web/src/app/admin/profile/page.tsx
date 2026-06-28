"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  headline: z.string().min(2, "Headline is required"),
  bio: z.string().min(10, "Bio is required"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Invalid email"),
  availabilityStatus: z.enum(['AVAILABLE', 'OPEN_TO_OFFERS', 'NOT_AVAILABLE']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data.data;
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        title: data.title,
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        email: data.email,
        availabilityStatus: data.availabilityStatus || 'AVAILABLE',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const res = await api.patch('/profile', formData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public profile details.</p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input 
                {...register('name')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email"
                {...register('email')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Title</label>
              <input 
                {...register('title')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Headline</label>
              <input 
                {...register('headline')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Brief summary shown on hero section"
              />
              {errors.headline && <p className="text-sm text-destructive">{errors.headline.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea 
                {...register('bio')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input 
                {...register('location')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Availability Status</label>
              <select 
                {...register('availabilityStatus')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="AVAILABLE">Available</option>
                <option value="OPEN_TO_OFFERS">Open to Offers</option>
                <option value="NOT_AVAILABLE">Not Available</option>
              </select>
              {errors.availabilityStatus && <p className="text-sm text-destructive">{errors.availabilityStatus.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}