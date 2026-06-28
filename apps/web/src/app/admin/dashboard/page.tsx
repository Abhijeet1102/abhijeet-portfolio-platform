"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FolderKanban, FileText, Activity, UserCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await api.get('/projects?limit=100');
      return res.data.data;
    }
  });

  const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs?limit=100');
      return res.data.data;
    }
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data.data;
    }
  });

  const isLoading = isLoadingProjects || isLoadingBlogs || isLoadingProfile;

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4">Loading dashboard data...</div>;
  }

  const projects = projectsData?.data || [];
  const publishedProjects = projects.filter((p: any) => p.status === 'PUBLISHED').length;

  const blogs = blogsData?.data || [];
  const publishedBlogs = blogs.filter((b: any) => b.status === 'PUBLISHED').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back to your portfolio CMS.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Projects Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">{publishedProjects} published</p>
          </div>
        </div>

        {/* Blogs Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Blogs</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{blogs.length}</div>
            <p className="text-xs text-muted-foreground">{publishedBlogs} published</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Profile Status</h3>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">{profileData?.availabilityStatus || 'Unknown'}</p>
          </div>
        </div>

        {/* Activity Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">System Status</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-500">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
         {/* Recent Projects */}
         <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Projects</h3>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project: any) => (
                <div key={project._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">{project.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{project.status}</p>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects found.</p>}
            </div>
          </div>
        </div>

         {/* Recent Blogs */}
         <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Blogs</h3>
            <div className="space-y-4">
              {blogs.slice(0, 3).map((blog: any) => (
                <div key={blog._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">{blog.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{blog.status}</p>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && <p className="text-sm text-muted-foreground">No blogs found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
