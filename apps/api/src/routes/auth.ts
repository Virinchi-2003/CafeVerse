import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateToken, AuthRequest, generateToken } from '../middleware/auth';
import { RegisterSchema, LoginSchema } from '@cafeverse/shared';

const router = Router();

// Register Customer
router.post('/register', (req: AuthRequest, res: Response) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password, name, phone } = parseResult.data;

    // Check existing email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

    db.prepare(`
      INSERT INTO users (id, email, password, name, phone, role)
      VALUES (?, ?, ?, ?, ?, 'customer')
    `).run(userId, email, hashedPassword, name, phone || null);

    const token = generateToken({ id: userId, email, role: 'customer' });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: userId, email, name, phone, role: 'customer' }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error during registration' });
  }
});

// Login User / Admin
router.post('/login', (req: AuthRequest, res: Response) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error during login' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const user: any = db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
