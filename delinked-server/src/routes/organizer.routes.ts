import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/organizer.controller';
import { authMiddleware, isOrganizer } from '../middleware/auth.middleware';

const router = Router();

// Apply middleware to all routes
router.use(authMiddleware, isOrganizer);

// GET /api/organizers/profile
router.get('/profile', getProfile);

// PUT /api/organizers/profile
router.put('/profile', updateProfile);

export default router;