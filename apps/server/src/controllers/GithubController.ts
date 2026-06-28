import { Request, Response } from 'express';
import { GithubSettings } from '../models/GithubSettings';
import { GithubSyncService } from '../services/GithubSyncService';
import { Repository } from '../models/Repository';
import axios from 'axios';
import crypto from 'crypto';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/admin';

export class GithubController {
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await GithubSettings.findOne();
      if (!settings) {
        return res.status(200).json({ status: 'success', data: { connected: false } });
      }

      // Hide access tokens in the response
      const safeSettings = {
        connected: settings.connected,
        username: settings.username,
        avatarUrl: settings.avatarUrl,
        autoSync: settings.autoSync,
        syncInterval: settings.syncInterval,
        lastSyncedAt: (settings as any).lastSyncedAt // From timestamps
      };

      res.status(200).json({ status: 'success', data: safeSettings });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async authRedirect(req: Request, res: Response) {
    if (!GITHUB_CLIENT_ID) {
      return res.status(500).json({ status: 'error', message: 'GitHub Client ID is not configured' });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/github/callback`;
    const scope = 'repo,user';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    res.redirect(githubAuthUrl);
  }

  async authCallback(req: Request, res: Response) {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/github/settings?error=missing_code`);
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        return res.redirect(`${FRONTEND_URL}/github/settings?error=auth_failed`);
      }

      // Fetch user profile from github
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { login, avatar_url } = userResponse.data;

      // Upsert settings
      let settings = await GithubSettings.findOne();
      if (!settings) {
        settings = new GithubSettings();
      }

      settings.connected = true;
      settings.accessToken = access_token;
      settings.username = login;
      settings.avatarUrl = avatar_url;

      await settings.save();

      res.redirect(`${FRONTEND_URL}/github/settings?success=true`);
    } catch (error) {
      console.error('GitHub Auth Callback Error:', error);
      res.redirect(`${FRONTEND_URL}/github/settings?error=server_error`);
    }
  }

  async disconnect(req: Request, res: Response) {
    try {
      let settings = await GithubSettings.findOne();
      if (settings) {
        settings.connected = false;
        settings.accessToken = undefined;
        settings.username = undefined;
        settings.avatarUrl = undefined;
        await settings.save();
      }

      res.status(200).json({ status: 'success', message: 'GitHub account disconnected' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const { autoSync, syncInterval } = req.body;
      let settings = await GithubSettings.findOne();
      
      if (!settings) {
        settings = new GithubSettings();
      }

      if (autoSync !== undefined) settings.autoSync = autoSync;
      if (syncInterval !== undefined) settings.syncInterval = syncInterval;

      await settings.save();

      res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async syncRepositories(req: Request, res: Response) {
    try {
      const syncService = new GithubSyncService();
      const results = await syncService.syncAllRepositories();
      res.status(200).json({ status: 'success', data: results, message: 'Sync completed successfully' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async webhook(req: Request, res: Response) {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('Webhook received but GITHUB_WEBHOOK_SECRET is not configured.');
      return res.status(500).send('Webhook secret not configured');
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    const digest = 'sha256=' + hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      console.warn('Webhook signature mismatch', { signature, digest });
      return res.status(401).send('Invalid signature');
    }

    try {
      const syncService = new GithubSyncService();
      await syncService.processWebhook(event, req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async getRepositories(req: Request, res: Response) {
    try {
      const repositories = await Repository.find().sort({ pushedAt: -1 });
      res.status(200).json({ status: 'success', data: repositories });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
