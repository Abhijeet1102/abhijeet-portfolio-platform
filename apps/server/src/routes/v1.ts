import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import blogRoutes from './blog.routes';
import profileRoutes from './profile.routes';
import githubRoutes from './github.routes';
import aiRoutes from './ai.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/profile', profileRoutes);
router.use('/github', githubRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);

// Placeholder for future routes
router.get('/status', (req, res) => {
  res.json({ status: 'v1 API is operational' });
});

export default router;
