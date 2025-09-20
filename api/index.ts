import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../backend/src/routes/auth';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : true
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Meditrack API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  try {
    res.json({
      totalPatients: 128,
      criticalPatients: 3,
      inventoryItems: 2847,
      lowStockItems: 12,
      systemHealth: {
        database: 98,
        uptime: 100,
        memory: 67
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};