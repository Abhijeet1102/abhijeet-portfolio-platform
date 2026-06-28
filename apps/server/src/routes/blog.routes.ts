import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.dto';
import { UserRole } from '../models/User';

const router = Router();
const blogController = new BlogController();

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 */
router.get('/', blogController.getAll.bind(blogController));

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get blog by slug
 *     tags: [Blogs]
 */
router.get('/:slug', blogController.getBySlug.bind(blogController));

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), validate(createBlogSchema), blogController.create.bind(blogController));

/**
 * @swagger
 * /blogs/{id}:
 *   patch:
 *     summary: Update blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), validate(updateBlogSchema), blogController.update.bind(blogController));

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), blogController.delete.bind(blogController));

export default router;
