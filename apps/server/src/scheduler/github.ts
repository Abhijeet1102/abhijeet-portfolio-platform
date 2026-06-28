import cron from 'node-cron';
import { GithubSyncService } from '../services/GithubSyncService';
import { GithubSettings } from '../models/GithubSettings';

export const startGithubScheduler = () => {
  // Run every hour to check if we need to sync based on syncInterval
  cron.schedule('0 * * * *', async () => {
    try {
      const settings = await GithubSettings.findOne();
      
      if (!settings || !settings.connected || !settings.autoSync) {
        return; // Auto-sync disabled or not connected
      }

      const now = new Date();
      const lastSynced = (settings as any).lastSyncedAt || new Date(0);
      const hoursSinceLastSync = (now.getTime() - lastSynced.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSync >= settings.syncInterval) {
        console.log('Running scheduled GitHub sync...');
        const syncService = new GithubSyncService();
        await syncService.syncAllRepositories();
        
        // Update lastSyncedAt
        (settings as any).lastSyncedAt = new Date();
        await settings.save();
        
        console.log('Scheduled GitHub sync completed.');
      }
    } catch (error) {
      console.error('Scheduled GitHub sync failed:', error);
    }
  });
};
