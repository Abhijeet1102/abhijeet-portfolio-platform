import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createProjectSchema, updateProjectSchema } from '../validators/project.dto';
import { UserRole } from '../models/User';

const router = Router();
const projectController = new ProjectController();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 */
router.get('/', projectController.getAll.bind(projectController));

/**
 * @swagger
 * /projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     tags: [Projects]
 */
router.get('/:slug', projectController.getBySlug.bind(projectController));

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), validate(createProjectSchema), projectController.create.bind(projectController));

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), validate(updateProjectSchema), projectController.update.bind(projectController));

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', requireAuth, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), projectController.delete.bind(projectController));

export default router;
