"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import { ForcePasswordChangeModal } from './ForcePasswordChangeModal';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAuthenticated && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, pathname, router, isMounted]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If on login page and not authenticated, render login page
  if (pathname === '/admin/login' && !isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated (and not on login), render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ForcePasswordChangeModal />
      {children}
    </>
  );
}
