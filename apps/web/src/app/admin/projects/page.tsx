"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await api.get('/projects?limit=100');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/projects/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const projects = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio projects.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground h-24">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => (
                  <tr key={project._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{project.title}</td>
                    <td className="p-4 align-middle">{project.category}</td>
                    <td className="p-4 align-middle">
                      <select 
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none"
                        value={project.status}
                        onChange={(e) => toggleStatusMutation.mutate({ id: project._id, status: e.target.value })}
                        disabled={toggleStatusMutation.isPending}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                      <Link 
                        href={`/admin/projects/${project._id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this project?')) {
                            deleteMutation.mutate(project._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}