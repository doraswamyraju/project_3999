// server/src/routes/tenant.js
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// Get tenant profile & catalog (Auto-hydration source)
router.get('/profile', async (req, res) => {
  const userId = Number(req.query.user_id) || 1;

  try {
    const [users] = await pool.query(
      'SELECT id, business_name, tagline, logo_url, brand_color, email, phone_number, whatsapp, address, owner_photo FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Business profile not found' });
    }

    const business = users[0];
    const [services] = await pool.query('SELECT * FROM user_services WHERE user_id = ?', [userId]);
    const [products] = await pool.query('SELECT * FROM user_products WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.business_name || 'My Business',
          tagline: business.tagline || 'Quality Products & Services',
          logoUrl: business.logo_url || 'http://localhost:5173/logo.png',
          brandColor: business.brand_color || '#4f46e5',
          email: business.email || 'contact@manacity.in',
          phone: business.phone_number || '+91 80085 30606',
          whatsapp: business.whatsapp || '+918008530606',
          address: business.address || 'Tirupati, AP',
          ownerPhoto: business.owner_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
        },
        services,
        products
      }
    });
  } catch (err) {
    console.error('Get tenant profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update tenant profile (Standalone Profile Settings Page)
router.post('/profile', async (req, res) => {
  const userId = req.body.userId || 1;
  const { business_name, tagline, brand_color, phone_number, whatsapp, email, address, logo_url, owner_photo } = req.body;

  try {
    await pool.query(
      `UPDATE users SET 
        business_name = COALESCE(?, business_name),
        tagline = COALESCE(?, tagline),
        brand_color = COALESCE(?, brand_color),
        phone_number = COALESCE(?, phone_number),
        whatsapp = COALESCE(?, whatsapp),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        logo_url = COALESCE(?, logo_url),
        owner_photo = COALESCE(?, owner_photo)
       WHERE id = ?`,
      [business_name, tagline, brand_color, phone_number, whatsapp, email, address, logo_url, owner_photo, userId]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add / Update catalog service
router.post('/service', async (req, res) => {
  const userId = req.body.userId || 1;
  const { title, description, price, icon, image_url, id } = req.body;

  try {
    if (id) {
      await pool.query(
        'UPDATE user_services SET title = ?, description = ?, price = ?, icon = ?, image_url = ? WHERE id = ? AND user_id = ?',
        [title, description, price, icon || 'Briefcase', image_url, id, userId]
      );
      return res.json({ success: true, message: 'Service updated' });
    } else {
      const [result] = await pool.query(
        'INSERT INTO user_services (user_id, title, description, price, icon, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, description, price || 0, icon || 'Briefcase', image_url]
      );
      return res.json({ success: true, message: 'Service added', id: result.insertId });
    }
  } catch (err) {
    console.error('Save service error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete service
router.delete('/service/:id', async (req, res) => {
  const serviceId = req.params.id;
  try {
    await pool.query('DELETE FROM user_services WHERE id = ?', [serviceId]);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
