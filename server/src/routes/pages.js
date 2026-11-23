// server/src/routes/pages.js
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// Get all master pages
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pages ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Pages fetch error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
