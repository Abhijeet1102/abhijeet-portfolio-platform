"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, Save, Unplug } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function GithubSettings() {
  const queryClient = useQueryClient();
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(24);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['github', 'settings'],
    queryFn: async () => {
      const res = await api.get('/github/settings');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setAutoSync(settings.autoSync ?? true);
      setSyncInterval(settings.syncInterval ?? 24);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: { autoSync: boolean, syncInterval: number }) => {
      const res = await api.patch('/github/settings', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['github', 'settings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/github/disconnect');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Disconnected from GitHub');
      queryClient.invalidateQueries({ queryKey: ['github'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to disconnect');
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ autoSync, syncInterval });
  };

  if (isLoading) {
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
          Connect your GitHub account to configure settings.
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

  return (
    <div className="max-w-2xl space-y-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 pb-4 border-b">
          <h3 className="font-semibold text-lg">Synchronization Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure how and when your repositories are synced.
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium text-sm">Automatic Sync</h4>
              <p className="text-sm text-muted-foreground">
                Automatically sync repositories and create projects.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sync Interval (Hours)</h4>
            <p className="text-sm text-muted-foreground">
              How often the scheduler should check for updates.
            </p>
            <input 
              type="number" 
              value={syncInterval}
              onChange={(e) => setSyncInterval(Number(e.target.value))}
              min={1}
              max={168}
              className="flex h-10 w-full md:w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm" 
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Settings
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Disconnecting will stop all automated syncing and revoke OAuth access. Your imported projects will remain safe.
          </p>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to disconnect your GitHub account?')) {
                disconnectMutation.mutate();
              }
            }}
            disabled={disconnectMutation.isPending}
            className="inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90"
          >
            {disconnectMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Unplug className="w-4 h-4 mr-2" />}
            Disconnect Account
          </button>
        </div>
      </div>
    </div>
  );
}
