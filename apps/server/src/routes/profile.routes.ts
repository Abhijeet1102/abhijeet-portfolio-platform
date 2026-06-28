import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateProfileSchema } from '../validators/profile.dto';
import { UserRole } from '../models/User';
import { cache } from '../middlewares/cache';

const router = Router();
const profileController = new ProfileController();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the global profile
 *     tags: [Profile]
 */
router.get('/', cache(300), profileController.get.bind(profileController));

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), validate(updateProfileSchema), profileController.update.bind(profileController));

export default router;
