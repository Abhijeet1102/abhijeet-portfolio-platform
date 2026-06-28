import { Router } from 'express';
import multer from 'multer';
import { aiController } from '../controllers/AiController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Configure multer for PDF uploads (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Public chat route
router.post('/chat', aiController.chat);

// Admin only: parse resume
router.post('/parse-resume', requireAuth, requireRole([UserRole.ADMIN]), upload.single('resume'), aiController.parseResume);

export default router;
