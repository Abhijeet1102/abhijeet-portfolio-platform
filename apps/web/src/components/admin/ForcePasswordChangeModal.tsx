"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export function ForcePasswordChangeModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setAuth, accessToken } = useAuthStore();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema)
  });

  if (!user?.forcePasswordChange) return null;

  const onSubmit = async (data: ChangePasswordData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/change-password', data);
      
      // Update the user store to reflect the change
      if (accessToken) {
        setAuth({ ...user, forcePasswordChange: false }, accessToken);
      }
      toast.success('Password changed successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border shadow-lg relative z-50">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">Security Action Required</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You are using a default or expired password. Please change your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input 
              type="password" 
              {...register('oldPassword')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
            />
            {errors.oldPassword && <p className="text-sm text-destructive">{errors.oldPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input 
              type="password" 
              {...register('newPassword')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
            />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <input 
              type="password" 
              {...register('confirmPassword')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
