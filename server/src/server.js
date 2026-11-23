// server/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blockRoutes from './routes/blocks.js';
import tenantRoutes from './routes/tenant.js';
import pageRoutes from './routes/pages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Project 3999 Node.js REST API', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/pages', pageRoutes);

app.listen(PORT, () => {
  console.log(`[Project 3999 API] Running on http://localhost:${PORT}`);
});
