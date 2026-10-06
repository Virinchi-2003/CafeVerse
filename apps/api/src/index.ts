import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cafeRoutes from './routes/cafe';
import menuRoutes from './routes/menu';
import reservationRoutes from './routes/reservations';
import adminRoutes from './routes/admin';
import reviewRoutes from './routes/reviews';
import { seed } from './db/seed';
import { db } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend & mobile dev servers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Seed DB if empty
try {
  const userCount: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (!userCount || userCount.count === 0) {
    console.log('Database empty on startup. Running initial seed...');
    seed();
  }
} catch (err) {
  console.error('Seed error check:', err);
}

// Routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'CaféVerse API', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cafe', cafeRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`☕ CaféVerse Backend API listening on http://localhost:${PORT}`);
});
