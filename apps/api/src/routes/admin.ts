import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Admin: Dashboard Analytics Overview
router.get('/dashboard', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's total reservations count
    const todayCount: any = db.prepare('SELECT COUNT(*) as count FROM reservations WHERE date = ?').get(today);
    
    // Today's total guest count
    const todayGuests: any = db.prepare(`
      SELECT SUM(party_size) as total FROM reservations WHERE date = ? AND status NOT IN ('cancelled', 'rejected')
    `).get(today);

    // Pending reservations count
    const pendingCount: any = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'").get();

    // Published & Total Menu Items count
    const menuItemsCount: any = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as active FROM menu_items').get();

    // Sold out items count
    const soldOutCount: any = db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE is_available = 0').get();

    // Total Customers registered
    const customerCount: any = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get();

    // Table Stats
    const tableStats: any = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved
      FROM cafe_tables
    `).get();

    // Recent 5 Reservations
    const recentReservations = db.prepare(`
      SELECT reference_code, customer_name, customer_email, date, time, party_size, status
      FROM reservations
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    // Audit logs recent
    const recentLogs = db.prepare(`
      SELECT admin_email, action, entity, details, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    return res.json({
      metrics: {
        todayReservations: todayCount.count || 0,
        todayGuests: todayGuests.total || 0,
        pendingApprovals: pendingCount.count || 0,
        totalMenuItems: menuItemsCount.total || 0,
        activeMenuItems: menuItemsCount.active || 0,
        soldOutMenuItems: soldOutCount.count || 0,
        registeredCustomers: customerCount.count || 0,
        totalTables: tableStats.total || 0,
        availableTables: tableStats.available || 0,
        occupiedTables: tableStats.occupied || 0,
        reservedTables: tableStats.reserved || 0,
      },
      recentReservations,
      recentLogs
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error loading admin metrics' });
  }
});

// Admin: Tables CRUD
router.get('/tables', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM cafe_tables ORDER BY table_number ASC').all();
    const tables = rows.map((t: any) => ({
      id: t.id,
      tableNumber: t.table_number,
      capacity: t.capacity,
      section: t.section,
      status: t.status,
      notes: t.notes || '',
      createdAt: t.created_at
    }));
    return res.json({ tables });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error loading tables' });
  }
});

router.post('/tables', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { tableNumber, capacity, section, status, notes } = req.body;
    if (!tableNumber || !capacity) {
      return res.status(400).json({ error: 'Table number and capacity are required' });
    }

    const tableId = `tbl_${Date.now().toString(36)}`;
    db.prepare(`
      INSERT INTO cafe_tables (id, table_number, capacity, section, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(tableId, tableNumber, Number(capacity), section || 'Indoor Main Hall', status || 'available', notes || '');

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'ADD_TABLE', 'cafe_tables', `Added table ${tableNumber} (${capacity} seats)`);

    return res.status(201).json({ message: 'Table added successfully', id: tableId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error creating table' });
  }
});

router.patch('/tables/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const tableId = req.params.id;
    const existing: any = db.prepare('SELECT * FROM cafe_tables WHERE id = ?').get(tableId);
    if (!existing) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const { tableNumber, capacity, section, status, notes } = req.body;

    const newNumber = tableNumber ?? existing.table_number;
    const newCap = capacity ?? existing.capacity;
    const newSec = section ?? existing.section;
    const newStatus = status ?? existing.status;
    const newNotes = notes !== undefined ? notes : existing.notes;

    db.prepare(`
      UPDATE cafe_tables
      SET table_number = ?, capacity = ?, section = ?, status = ?, notes = ?
      WHERE id = ?
    `).run(newNumber, newCap, newSec, newStatus, newNotes, tableId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'UPDATE_TABLE', 'cafe_tables', `Updated table ${newNumber} to status ${newStatus}`);

    return res.json({ message: 'Table updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error updating table' });
  }
});

router.delete('/tables/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const tableId = req.params.id;
    const existing: any = db.prepare('SELECT table_number FROM cafe_tables WHERE id = ?').get(tableId);
    if (!existing) {
      return res.status(404).json({ error: 'Table not found' });
    }

    db.prepare('DELETE FROM cafe_tables WHERE id = ?').run(tableId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'DELETE_TABLE', 'cafe_tables', `Deleted table ${existing.table_number}`);

    return res.json({ message: 'Table deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error deleting table' });
  }
});

// Admin: Customers List
router.get('/customers', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const customers = db.prepare(`
      SELECT id, email, name, phone, role, created_at
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
    `).all();

    return res.json({ customers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Audit Logs
router.get('/audit-logs', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50
    `).all();

    return res.json({ logs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
