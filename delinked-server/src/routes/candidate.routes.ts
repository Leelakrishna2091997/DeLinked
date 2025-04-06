import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/candidate.controller';
import { authMiddleware, isCandidate } from '../middleware/auth.middleware';

const router = Router();

// Apply middleware to all routes
router.use(authMiddleware, isCandidate);

// GET /api/candidates/profile
router.get('/profile', getProfile);

// PUT /api/candidates/profile
router.put('/profile', updateProfile);

export default router;