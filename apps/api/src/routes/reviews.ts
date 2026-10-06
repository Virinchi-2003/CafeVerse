import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Get Published Reviews
router.get('/', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT id, customer_name as customerName, rating, title, comment, created_at as createdAt
      FROM reviews
      WHERE status = 'published'
      ORDER BY created_at DESC
    `).all();

    return res.json({ reviews });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Customer: Submit Review
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const { customerName, rating, title, comment } = req.body;
    if (!customerName || !rating || !title || !comment) {
      return res.status(400).json({ error: 'All review fields are required' });
    }

    const reviewId = `rev_${Date.now().toString(36)}`;
    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO reviews (id, user_id, customer_name, rating, title, comment, status)
      VALUES (?, ?, ?, ?, ?, ?, 'published')
    `).run(reviewId, userId, customerName, Math.min(5, Math.max(1, Number(rating))), title, comment);

    return res.status(201).json({ message: 'Review submitted successfully', id: reviewId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
