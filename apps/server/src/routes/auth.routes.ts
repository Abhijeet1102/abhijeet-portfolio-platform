import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { requireAuth } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', authController.register.bind(authController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', authController.refresh.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', requireAuth, authController.me.bind(authController));
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', requireAuth, authController.changePassword.bind(authController));

export default router;
