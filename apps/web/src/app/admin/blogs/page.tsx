"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs?limit=100');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete blog');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/blogs/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const blogs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground mt-2">Manage your blog articles.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Write Article
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categories</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground h-24">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{blog.title}</td>
                    <td className="p-4 align-middle">{blog.categories?.join(', ')}</td>
                    <td className="p-4 align-middle">
                      <select 
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none"
                        value={blog.status}
                        onChange={(e) => toggleStatusMutation.mutate({ id: blog._id, status: e.target.value })}
                        disabled={toggleStatusMutation.isPending}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                      <Link 
                        href={`/admin/blogs/${blog._id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this blog?')) {
                            deleteMutation.mutate(blog._id);
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