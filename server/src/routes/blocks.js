// server/src/routes/blocks.js
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// Get all visible blocks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blocks ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Fetch blocks error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new block (Admin)
router.post('/save', async (req, res) => {
  const { name, category, default_preview_img, is_visible } = req.body;
  if (!name || !category) {
    return res.status(400).json({ success: false, message: 'Name and category are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO blocks (name, category, default_preview_img, is_visible) VALUES (?, ?, ?, ?)',
      [name, category, default_preview_img || `/previews/${category}1.png`, is_visible ?? 1]
    );
    res.json({ success: true, message: 'Block saved successfully', blockId: result.insertId });
  } catch (err) {
    console.error('Save block error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle block visibility (Admin)
router.post('/visibility', async (req, res) => {
  const { blockId, isVisible } = req.body;
  try {
    await pool.query('UPDATE blocks SET is_visible = ? WHERE id = ?', [isVisible ? 1 : 0, blockId]);
    res.json({ success: true, message: 'Visibility updated' });
  } catch (err) {
    console.error('Visibility update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
