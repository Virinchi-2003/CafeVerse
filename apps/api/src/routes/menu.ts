import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { MenuItemSchema } from '@cafeverse/shared';

const router = Router();

// Helper to map DB row to MenuItem object
function mapMenuItem(row: any) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    price: row.price,
    priceFormatted: `₹${row.price}`,
    imageUrl: row.image_url,
    dietaryLabels: JSON.parse(row.dietary_labels || '[]'),
    allergens: JSON.parse(row.allergens || '[]'),
    isAvailable: Boolean(row.is_available),
    isFeatured: Boolean(row.is_featured),
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Public: Get Categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC, name ASC').all();
    return res.json({
      categories: categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        displayOrder: c.display_order,
        icon: c.icon
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Create Category
router.post('/categories', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, displayOrder, icon } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const catId = `cat_${Date.now().toString(36)}`;
    db.prepare(`
      INSERT INTO categories (id, name, slug, description, display_order, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(catId, name, slug, description || '', displayOrder || 0, icon || 'Coffee');

    return res.status(201).json({ message: 'Category created', id: catId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Public / Admin: Get Menu Items
router.get('/items', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const { categoryId, categorySlug, search, featuredOnly, includeUnavailable } = req.query;

    let query = `
      SELECT m.*, c.name as category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filter by availability unless admin requests all
    if (!isAdmin || includeUnavailable !== 'true') {
      query += ` AND m.is_available = 1`;
    }

    if (categoryId) {
      query += ` AND m.category_id = ?`;
      params.push(categoryId);
    }

    if (categorySlug) {
      query += ` AND c.slug = ?`;
      params.push(categorySlug);
    }

    if (featuredOnly === 'true') {
      query += ` AND m.is_featured = 1`;
    }

    if (search) {
      query += ` AND (m.name LIKE ? OR m.short_description LIKE ? OR m.full_description LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY m.display_order ASC, m.name ASC`;

    const rows = db.prepare(query).all(...params);
    const items = rows.map(mapMenuItem);

    return res.json({ items });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Public: Get Single Menu Item
router.get('/items/:id', (req, res) => {
  try {
    const row: any = db.prepare(`
      SELECT m.*, c.name as category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `).get(req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    return res.json({ item: mapMenuItem(row) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Create Menu Item
router.post('/items', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const parseResult = MenuItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const data = parseResult.data;
    const itemId = `item_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

    db.prepare(`
      INSERT INTO menu_items (id, category_id, name, short_description, full_description, price, image_url, dietary_labels, allergens, is_available, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      itemId,
      data.categoryId,
      data.name,
      data.shortDescription,
      data.fullDescription || null,
      data.price,
      data.imageUrl,
      JSON.stringify(data.dietaryLabels),
      JSON.stringify(data.allergens),
      data.isAvailable ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.displayOrder
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'CREATE_MENU_ITEM', 'menu_items', `Created item: ${data.name}`);

    return res.status(201).json({ message: 'Menu item created', id: itemId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Update Menu Item
router.patch('/items/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const existing: any = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(itemId);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const {
      categoryId,
      name,
      shortDescription,
      fullDescription,
      price,
      imageUrl,
      dietaryLabels,
      allergens,
      isAvailable,
      isFeatured,
      displayOrder
    } = req.body;

    const updatedCategory = categoryId ?? existing.category_id;
    const updatedName = name ?? existing.name;
    const updatedShortDesc = shortDescription ?? existing.short_description;
    const updatedFullDesc = fullDescription ?? existing.full_description;
    const updatedPrice = price ?? existing.price;
    const updatedImage = imageUrl ?? existing.image_url;
    const updatedDietary = dietaryLabels ? JSON.stringify(dietaryLabels) : existing.dietary_labels;
    const updatedAllergens = allergens ? JSON.stringify(allergens) : existing.allergens;
    const updatedAvailable = isAvailable !== undefined ? (isAvailable ? 1 : 0) : existing.is_available;
    const updatedFeatured = isFeatured !== undefined ? (isFeatured ? 1 : 0) : existing.is_featured;
    const updatedOrder = displayOrder ?? existing.display_order;

    db.prepare(`
      UPDATE menu_items
      SET category_id = ?, name = ?, short_description = ?, full_description = ?,
          price = ?, image_url = ?, dietary_labels = ?, allergens = ?,
          is_available = ?, is_featured = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      updatedCategory, updatedName, updatedShortDesc, updatedFullDesc,
      updatedPrice, updatedImage, updatedDietary, updatedAllergens,
      updatedAvailable, updatedFeatured, updatedOrder, itemId
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'UPDATE_MENU_ITEM', 'menu_items', `Updated item: ${updatedName}`);

    return res.json({ message: 'Menu item updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin: Delete Menu Item
router.delete('/items/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const existing: any = db.prepare('SELECT name FROM menu_items WHERE id = ?').get(itemId);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    db.prepare('DELETE FROM menu_items WHERE id = ?').run(itemId);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, entity, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}`, req.user!.id, req.user!.email, 'DELETE_MENU_ITEM', 'menu_items', `Deleted item: ${existing.name}`);

    return res.json({ message: 'Menu item deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
