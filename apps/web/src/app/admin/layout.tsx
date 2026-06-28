"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, FileText, UserCircle, LogOut } from 'lucide-react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Profile', href: '/admin/profile', icon: UserCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Do not show sidebar on login page
  if (pathname === '/admin/login') {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card hidden md:block">
          <div className="p-6">
            <h2 className="text-lg font-bold tracking-tight">Portfolio CMS</h2>
            <p className="text-xs text-muted-foreground mt-1">Logged in as {user?.name}</p>
          </div>
          
          <nav className="space-y-1 px-3 mt-4">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-4 left-0 w-64 px-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
