import { Router } from 'express';
import { GithubController } from '../controllers/GithubController';
import { requireAuth } from '../middlewares/auth';

const router = Router();
const githubController = new GithubController();

/**
 * @swagger
 * /github/settings:
 *   get:
 *     summary: Get GitHub settings
 *     tags: [Github]
 *     security:
 *       - bearerAuth: []
 */
router.get('/settings', requireAuth, githubController.getSettings.bind(githubController));

/**
 * @swagger
 * /github/settings:
 *   patch:
 *     summary: Update GitHub settings (autoSync, syncInterval)
 *     tags: [Github]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/settings', requireAuth, githubController.updateSettings.bind(githubController));

/**
 * @swagger
 * /github/auth:
 *   get:
 *     summary: Redirects to GitHub OAuth
 *     tags: [Github]
 */
router.get('/auth', githubController.authRedirect.bind(githubController));

/**
 * @swagger
 * /github/callback:
 *   get:
 *     summary: GitHub OAuth Callback
 *     tags: [Github]
 */
router.get('/callback', githubController.authCallback.bind(githubController));

/**
 * @swagger
 * /github/disconnect:
 *   delete:
 *     summary: Disconnect GitHub account
 *     tags: [Github]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/disconnect', requireAuth, githubController.disconnect.bind(githubController));

/**
 * @swagger
 * /github/sync:
 *   post:
 *     summary: Sync GitHub repositories
 *     tags: [Github]
 *     security:
 *       - bearerAuth: []
 */
router.post('/sync', requireAuth, githubController.syncRepositories.bind(githubController));

/**
 * @swagger
 * /github/webhook:
 *   post:
 *     summary: GitHub Webhook receiver
 *     tags: [Github]
 */
router.post('/webhook', githubController.webhook.bind(githubController));

/**
 * @swagger
 * /github/repositories:
 *   get:
 *     summary: Get synced GitHub repositories
 *     tags: [Github]
 *     security:
 *       - bearerAuth: []
 */
router.get('/repositories', requireAuth, githubController.getRepositories.bind(githubController));

export default router;
