import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { ReservationSchema } from '@cafeverse/shared';

const router = Router();

function generateRefCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'CV-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function mapReservationRow(r: any) {
  return {
    id: r.id,
    referenceCode: r.reference_code,
    userId: r.user_id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    date: r.date,
    time: r.time,
    partySize: r.party_size,
    adults: r.adults,
    children: r.children,
    seatingPreference: r.seating_preference,
    specialRequests: r.special_requests,
    status: r.status,
    internalNotes: r.internal_notes,
    sendReminder: Boolean(r.send_reminder),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

// Public: Get Slot Availability
router.get('/availability', (req, res) => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date parameter (YYYY-MM-DD) is required' });
    }

    const settings: any = db.prepare('SELECT opening_hours, slot_capacity, slot_interval_minutes, max_party_size FROM cafe_settings WHERE id = ?').get('default');
    if (!settings) {
      return res.status(500).json({ error: 'Cafe settings missing' });
    }

    const openingHours = JSON.parse(settings.opening_hours || '{}');
    const slotCapacity = settings.slot_capacity || 30;
    const slotInterval = settings.slot_interval_minutes || 30;

    // Get day name
    const reqDate = new Date(`${date}T00:00:00`);
    const dayName = reqDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayHours = openingHours[dayName];

    if (!dayHours || !dayHours.isOpen) {
      return res.json({ date, isClosed: true, slots: [] });
    }

    // Generate time slots
    const slots: { time: string; remainingCapacity: number; isAvailable: boolean }[] = [];
    const [startH, startM] = dayHours.open.split(':').map(Number);
    const [endH, endM] = dayHours.close.split(':').map(Number);

    let currMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM - slotInterval; // Stop before close time

    // Fetch existing guest counts for that date per time
    const reservedRows = db.prepare(`
      SELECT time, SUM(party_size) as total_guests
      FROM reservations
      WHERE date = ? AND status NOT IN ('cancelled', 'rejected')
      GROUP BY time
    `).all(date) as any[];

    const reservedMap = new Map<string, number>();
    for (const r of reservedRows) {
      reservedMap.set(r.time, r.total_guests || 0);
    }

    while (currMinutes <= endMinutes) {
      const h = Math.floor(currMinutes / 60).toString().padStart(2, '0');
      const m = (currMinutes % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;

      const bookedCount = reservedMap.get(timeStr) || 0;
      const remaining = Math.max(0, slotCapacity - bookedCount);

      slots.push({
        time: timeStr,
        remainingCapacity: remaining,
        isAvailable: remaining > 0
      });

      currMinutes += slotInterval;
    }

    return res.json({
      date,
      dayName,
      isClosed: false,
      maxPartySize: settings.max_party_size,
      slots
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error checking availability' });
  }
});

// Public / Customer: Create Reservation
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const parseResult = ReservationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const data = parseResult.data;
    const adults = data.adults;
    const children = data.children || 0;
    const partySize = adults + children;

    // Check date is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (data.date < todayStr) {
      return res.status(400).json({ error: 'Cannot book reservations in the past' });
    }

    const settings: any = db.prepare('SELECT slot_capacity, max_party_size FROM cafe_settings WHERE id = ?').get('default');
    if (partySize > settings.max_party_size) {
      return res.status(400).json({ error: `Maximum party size is ${settings.max_party_size} guests` });
    }

    // Capacity & concurrency validation inside transaction
    let newRef = '';
    const resId = `res_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

    const createTransaction = db.transaction(() => {
      // Check existing capacity for slot
      const existing: any = db.prepare(`
        SELECT SUM(party_size) as total_guests
        FROM reservations
        WHERE date = ? AND time = ? AND status NOT IN ('cancelled', 'rejected')
      `).get(data.date, data.time);

      const currentlyBooked = existing.total_guests || 0;
      if (currentlyBooked + partySize > settings.slot_capacity) {
        throw new Error(`Slot ${data.time} on ${data.date} does not have enough capacity for ${partySize} guests.`);
      }

      newRef = generateRefCode();
      const userId = req.user ? req.user.id : null;

      db.prepare(`
        INSERT INTO reservations (
          id, reference_code, user_id, customer_name, customer_email, customer_phone,
          date, time, party_size, adults, children, seating_preference, special_requests,
          status, send_reminder
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `).run(
        resId,
        newRef,
        userId,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.date,
        data.time,
        partySize,
        adults,
        children,
        data.seatingPreference || 'Standard Table',
        data.specialRequests || '',
        data.sendReminder ? 1 : 0
      );
    });

    createTransaction();

    const created: any = db.prepare('SELECT * FROM reservations WHERE id = ?').get(resId);

    return res.status(201).json({
      message: 'Reservation created successfully!',
      reservation: mapReservationRow(created)
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create reservation' });
  }
});

// Customer: Get My Reservations
router.get('/mine', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM reservations
      WHERE user_id = ? OR customer_email = ?
      ORDER BY date DESC, time DESC
    `).all(req.user!.id, req.user!.email);

    return res.json({ reservations: rows.map(mapReservationRow) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Customer: Cancel My Reservation
router.patch('/mine/:id/cancel', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resId = req.params.id;
    const existing: any = db.prepare('SELECT * FROM reservations WHERE id = ?').get(resId);
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (existing.user_id !== req.user!.id && existing.customer_email !== req.user!.email) {
      return res.status(403).json({ error: 'Unauthorized to cancel this reservation' });
    }

    db.prepare("UPDATE reservations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(resId);

    return res.json({ message: 'Reservation cancelled successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Get All Reservations
router.get('/admin/all', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { date, status, search } = req.query;
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (reference_code LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY date DESC, time ASC';

    const rows = db.prepare(query).all(...params);
    return res.json({ reservations: rows.map(mapReservationRow) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Update Status
router.patch('/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const resId = req.params.id;
    const { status, internalNotes } = req.body;

    const existing: any = db.prepare('SELECT * FROM reservations WHERE id = ?').get(resId);
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const newStatus = status || existing.status;
    const newNotes = internalNotes !== undefined ? internalNotes : existing.internal_notes;

    db.prepare(`
      UPDATE reservations
      SET status = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStatus, newNotes, resId);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'UPDATE_RESERVATION_STATUS', 'reservations', `Reservation ${existing.reference_code} set to ${newStatus}`);

    return res.json({ message: `Reservation status updated to ${newStatus}` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
