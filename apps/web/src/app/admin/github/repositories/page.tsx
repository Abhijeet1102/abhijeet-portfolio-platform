"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, ExternalLink, Star, GitFork } from 'lucide-react';
import Link from 'next/link';

export default function GithubRepositories() {
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
        <p className="text-muted-foreground mt-2">
          Connect your GitHub account to view and manage your repositories.
        </p>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">No Repositories Found</h3>
        <p className="text-muted-foreground mt-2">
          Try forcing a sync from the overview tab to fetch your repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo: any) => (
          <div key={repo.githubId} className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-1" title={repo.name}>
                {repo.name}
              </h3>
              <a 
                href={repo.htmlUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-grow">
              {repo.description || "No description provided."}
            </p>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              {repo.language && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {repo.language}
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5" />
                {repo.stargazersCount}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GitFork className="w-3.5 h-3.5" />
                {repo.forksCount}
              </div>
            </div>
            
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {repo.topics.slice(0, 3).map((topic: string) => (
                  <span key={topic} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground text-[10px] font-medium">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
