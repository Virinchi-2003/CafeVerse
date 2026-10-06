import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Get Cafe Settings
router.get('/settings', (req, res) => {
  try {
    const settings: any = db.prepare('SELECT * FROM cafe_settings WHERE id = ?').get('default');
    if (!settings) {
      return res.status(404).json({ error: 'Settings not configured' });
    }

    return res.json({
      settings: {
        id: settings.id,
        cafeName: settings.cafe_name,
        tagline: settings.tagline,
        primaryColor: settings.primary_color,
        secondaryColor: settings.secondary_color,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        openingHours: JSON.parse(settings.opening_hours || '{}'),
        slotIntervalMinutes: settings.slot_interval_minutes,
        slotCapacity: settings.slot_capacity,
        maxPartySize: settings.max_party_size,
        cancellationPolicy: settings.cancellation_policy,
        socialLinks: JSON.parse(settings.social_links || '{}')
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Update Cafe Settings
router.patch('/settings', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const {
      cafeName,
      tagline,
      primaryColor,
      secondaryColor,
      address,
      phone,
      email,
      openingHours,
      slotIntervalMinutes,
      slotCapacity,
      maxPartySize,
      cancellationPolicy,
      socialLinks
    } = req.body;

    const current: any = db.prepare('SELECT * FROM cafe_settings WHERE id = ?').get('default');
    if (!current) {
      return res.status(404).json({ error: 'Settings record not found' });
    }

    const updatedName = cafeName ?? current.cafe_name;
    const updatedTagline = tagline ?? current.tagline;
    const updatedPrimary = primaryColor ?? current.primary_color;
    const updatedSecondary = secondaryColor ?? current.secondary_color;
    const updatedAddress = address ?? current.address;
    const updatedPhone = phone ?? current.phone;
    const updatedEmail = email ?? current.email;
    const updatedOpeningHours = openingHours ? JSON.stringify(openingHours) : current.opening_hours;
    const updatedSlotInterval = slotIntervalMinutes ?? current.slot_interval_minutes;
    const updatedCapacity = slotCapacity ?? current.slot_capacity;
    const updatedMaxParty = maxPartySize ?? current.max_party_size;
    const updatedPolicy = cancellationPolicy ?? current.cancellation_policy;
    const updatedSocial = socialLinks ? JSON.stringify(socialLinks) : current.social_links;

    db.prepare(`
      UPDATE cafe_settings
      SET cafe_name = ?, tagline = ?, primary_color = ?, secondary_color = ?,
          address = ?, phone = ?, email = ?, opening_hours = ?,
          slot_interval_minutes = ?, slot_capacity = ?, max_party_size = ?,
          cancellation_policy = ?, social_links = ?
      WHERE id = 'default'
    `).run(
      updatedName, updatedTagline, updatedPrimary, updatedSecondary,
      updatedAddress, updatedPhone, updatedEmail, updatedOpeningHours,
      updatedSlotInterval, updatedCapacity, updatedMaxParty,
      updatedPolicy, updatedSocial
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'UPDATE_SETTINGS', 'cafe_settings', 'Updated café configuration settings');

    return res.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
