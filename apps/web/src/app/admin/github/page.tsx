"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, RefreshCw, GitFork, Star, GitCommit } from 'lucide-react';
import { toast } from 'sonner';

export default function GithubOverview() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['github', 'settings'],
    queryFn: async () => {
      const res = await api.get('/github/settings');
      return res.data.data;
    }
  });

  const { data: repos, isLoading: isLoadingRepos } = useQuery({
    queryKey: ['github', 'repositories'],
    queryFn: async () => {
      const res = await api.get('/github/repositories');
      return res.data.data;
    },
    enabled: !!settings?.connected
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/github/sync');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Sync completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['github'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sync failed');
    }
  });

  if (isLoadingSettings || (settings?.connected && isLoadingRepos)) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings?.connected) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">GitHub Not Connected</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          Connect your GitHub account to enable automatic synchronization of repositories and projects.
        </p>
        <a 
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/github/auth`}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium"
        >
          Connect GitHub
        </a>
      </div>
    );
  }

  // Calculate analytics
  const totalRepos = repos?.length || 0;
  const totalStars = repos?.reduce((acc: number, repo: any) => acc + (repo.stargazersCount || 0), 0) || 0;
  const totalForks = repos?.reduce((acc: number, repo: any) => acc + (repo.forksCount || 0), 0) || 0;
  const totalIssues = repos?.reduce((acc: number, repo: any) => acc + (repo.openIssuesCount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {settings.avatarUrl && (
            <img src={settings.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <h3 className="text-lg font-medium">Connected as @{settings.username}</h3>
            <p className="text-sm text-muted-foreground">
              Last synced: {settings.lastSyncedAt ? new Date(settings.lastSyncedAt).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {syncMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Force Sync Now
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Repositories</h3>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalRepos}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Stars</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalStars}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Forks</h3>
            <GitFork className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalForks}</div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Open Issues</h3>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalIssues}</div>
        </div>
      </div>
    </div>
  );
}