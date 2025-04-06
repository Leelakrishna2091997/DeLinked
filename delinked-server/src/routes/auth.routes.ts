import { Router } from 'express';
import { getNonce, authenticate, getCurrentUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// GET /api/auth/nonce/:address
router.get('/nonce/:address', getNonce);

// POST /api/auth/authenticate
router.post('/authenticate', authenticate);

// GET /api/auth/me
router.get('/me', authMiddleware, getCurrentUser);

export default router;