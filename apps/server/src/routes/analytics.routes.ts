import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public route to record a visit
router.post('/visit', analyticsController.recordVisit);

// Admin route to get analytics summary
router.get('/summary', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), analyticsController.getSummary);

export default router;
