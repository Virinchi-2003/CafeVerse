import { db, initDatabase } from './index';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

initDatabase();

export function seed() {
  console.log('Seeding CaféVerse database...');

  // Clear existing
  db.exec(`
    DELETE FROM audit_logs;
    DELETE FROM reviews;
    DELETE FROM reservations;
    DELETE FROM menu_items;
    DELETE FROM categories;
    DELETE FROM users;
    DELETE FROM cafe_settings;
    DELETE FROM cafe_tables;
  `);

  // 1. Users
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const customerPassword = bcrypt.hashSync('customer123', 10);

  const adminId = 'usr_admin_001';
  const customerId = 'usr_cust_001';

  db.prepare(`
    INSERT INTO users (id, email, password, name, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin@cafeverse.com', adminPassword, 'Master Barista Admin', '+1 555-0100', 'admin');

  db.prepare(`
    INSERT INTO users (id, email, password, name, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(customerId, 'customer@cafeverse.com', customerPassword, 'Elena Rostova', '+1 555-0199', 'customer');

  // 2. Categories
  const categories = [
    { id: 'cat_espresso', name: 'Espresso Bar', slug: 'espresso-bar', description: 'Classic & modern espresso creations crafted from single-origin beans.', display_order: 1, icon: 'Coffee' },
    { id: 'cat_cold', name: 'Cold Brew & Ice', slug: 'cold-brew-ice', description: 'Slow-steeped cold brews and chilled signature beverages.', display_order: 2, icon: 'GlassWater' },
    { id: 'cat_specialty', name: 'Specialty Lattes', slug: 'specialty-lattes', description: 'Artisanal lattes infused with house-made syrups and delicate botanicals.', display_order: 3, icon: 'Sparkles' },
    { id: 'cat_bakery', name: 'Artisan Bakery', slug: 'artisan-bakery', description: 'Freshly baked flaky croissants, tarts, and sourdough pastries.', display_order: 4, icon: 'Croissant' },
    { id: 'cat_brunch', name: 'Brunch & Savory', slug: 'brunch-savory', description: 'Gourmet avocado toasts, eggs Benedict, and warm brioche sandwiches.', display_order: 5, icon: 'Utensils' },
    { id: 'cat_desserts', name: 'Signature Desserts', slug: 'signature-desserts', description: 'Decadent cheesecakes, dark chocolate tarts, and affogatos.', display_order: 6, icon: 'Cake' },
  ];

  const stmtCat = db.prepare(`
    INSERT INTO categories (id, name, slug, description, display_order, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const c of categories) {
    stmtCat.run(c.id, c.name, c.slug, c.description, c.display_order, c.icon);
  }

  // 3. Menu Items (Inspired by Image 1 & specialty coffee offerings)
  const menuItems = [
    {
      id: 'item_latte',
      category_id: 'cat_espresso',
      name: 'Artisan Latte',
      short_description: 'Smooth and creamy espresso with velvety steamed milk and fine art foam.',
      full_description: 'Our signature espresso blend combined with steamed whole milk or oat milk, finished with rosette latte art.',
      price: 199,
      image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian', 'Oat Milk Available']),
      allergens: JSON.stringify(['Dairy']),
      is_available: 1,
      is_featured: 1,
      display_order: 1
    },
    {
      id: 'item_cappuccino',
      category_id: 'cat_espresso',
      name: 'Velvet Cappuccino',
      short_description: 'Rich espresso topped with dense, airy micro-foam and cocoa dusting.',
      full_description: 'Double shot of dark roasted espresso blended with aerated milk foam for a classic Italian sensory experience.',
      price: 169,
      image_url: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Dairy']),
      is_available: 1,
      is_featured: 1,
      display_order: 2
    },
    {
      id: 'item_mocha',
      category_id: 'cat_espresso',
      name: 'Dark Chocolate Mocha',
      short_description: 'Single-origin espresso, dark Valrhona chocolate, and steamed silk milk.',
      full_description: 'Rich 70% dark Belgian chocolate melted into double espresso, crowned with whipped cream and chocolate curls.',
      price: 219,
      image_url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Dairy', 'Soy']),
      is_available: 1,
      is_featured: 1,
      display_order: 3
    },
    {
      id: 'item_espresso',
      category_id: 'cat_espresso',
      name: 'Single Origin Espresso',
      short_description: 'Intense, aromatic double shot featuring vibrant fruity notes and golden crema.',
      full_description: 'Extracted from high-altitude Ethiopian Yirgacheffe beans with notes of bergamot, jasmine, and citrus acidity.',
      price: 129,
      image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegan', 'Gluten-Free']),
      allergens: JSON.stringify([]),
      is_available: 1,
      is_featured: 1,
      display_order: 4
    },
    {
      id: 'item_coldbrew',
      category_id: 'cat_cold',
      name: 'Nitro Cold Brew',
      short_description: '24-hour steep cold brew infused with pure nitrogen for a velvety head.',
      full_description: 'Slow cold water extraction over 24 hours yields a naturally sweet, low-acidity coffee served cascading on nitrogen tap.',
      price: 179,
      image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegan', 'Zero Sugar']),
      allergens: JSON.stringify([]),
      is_available: 1,
      is_featured: 1,
      display_order: 5
    },
    {
      id: 'item_matcha',
      category_id: 'cat_specialty',
      name: 'Ceremonial Uji Matcha Latte',
      short_description: 'First-harvest Kyoto Uji matcha whisked with warm vanilla oat milk.',
      full_description: 'Shade-grown ceremonial grade Japanese matcha ground fresh daily, offering deep umami and gentle natural sweetness.',
      price: 229,
      image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegan', 'Antioxidant Rich']),
      allergens: JSON.stringify([]),
      is_available: 1,
      is_featured: 0,
      display_order: 6
    },
    {
      id: 'item_croissant',
      category_id: 'cat_bakery',
      name: 'Butter Almond Croissant',
      short_description: 'Flaky French croissant filled with frangipane cream and sliced toasted almonds.',
      full_description: 'Hand-laminated butter dough aged 48 hours, baked golden crisp and generously dusted with powdered sugar.',
      price: 149,
      image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Gluten', 'Dairy', 'Tree Nuts', 'Eggs']),
      is_available: 1,
      is_featured: 1,
      display_order: 7
    },
    {
      id: 'item_avotoast',
      category_id: 'cat_brunch',
      name: 'Truffle Avocado Sourdough',
      short_description: 'Hass avocado mash, poached farm egg, microgreens & white truffle oil on sourdough.',
      full_description: 'Artisanal sourdough crust toast layered with chunky seasoned avocado, heirloom radish, feta, and slow-poached egg.',
      price: 289,
      image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian', 'Organic']),
      allergens: JSON.stringify(['Gluten', 'Eggs', 'Dairy']),
      is_available: 1,
      is_featured: 1,
      display_order: 8
    },
    {
      id: 'item_cheesecake',
      category_id: 'cat_desserts',
      name: 'San Sebastián Basque Cheesecake',
      short_description: 'Caramelized burnt top cheesecake with a creamy, molten vanilla bean center.',
      full_description: 'Baked at high temperatures for a dark charred exterior revealing a custard-soft cream cheese interior infused with Tahitian vanilla.',
      price: 249,
      image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian', 'Gluten-Free']),
      allergens: JSON.stringify(['Dairy', 'Eggs']),
      is_available: 1,
      is_featured: 0,
      display_order: 9
    },
    {
      id: 'item_spanish_latte',
      category_id: 'cat_cold',
      name: 'Iced Spanish Latte',
      short_description: 'Double espresso shaken over crushed ice with sweetened condensed milk.',
      full_description: 'A rich and creamy indulgence balancing bold roasted espresso with subtle caramel condensed milk sweetness.',
      price: 209,
      image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Dairy']),
      is_available: 1,
      is_featured: 0,
      display_order: 10
    },
    {
      id: 'item_pain_chocolat',
      category_id: 'cat_bakery',
      name: 'Artisan Pain au Chocolat',
      short_description: 'Flaky butter pastry wrapped around double batons of dark Belgian chocolate.',
      full_description: 'French butter pastry dough layered with two bars of 64% Valrhona dark chocolate, baked to crispy perfection.',
      price: 159,
      image_url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Gluten', 'Dairy', 'Soy', 'Eggs']),
      is_available: 1,
      is_featured: 0,
      display_order: 11
    },
    {
      id: 'item_french_toast',
      category_id: 'cat_brunch',
      name: 'Berry Brioche French Toast',
      short_description: 'Golden brioche toast topped with fresh organic berries and maple drizzle.',
      full_description: 'Thick cut house-baked brioche soaked in vanilla bean egg batter, seared golden and served with whipped mascarpone.',
      price: 269,
      image_url: 'https://images.unsplash.com/photo-1484723091479-00321ed05544?q=80&w=800&auto=format&fit=crop',
      dietary_labels: JSON.stringify(['Vegetarian']),
      allergens: JSON.stringify(['Gluten', 'Dairy', 'Eggs']),
      is_available: 1,
      is_featured: 0,
      display_order: 12
    }
  ];

  const stmtItem = db.prepare(`
    INSERT INTO menu_items (id, category_id, name, short_description, full_description, price, image_url, dietary_labels, allergens, is_available, is_featured, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of menuItems) {
    stmtItem.run(
      item.id,
      item.category_id,
      item.name,
      item.short_description,
      item.full_description,
      item.price,
      item.image_url,
      item.dietary_labels,
      item.allergens,
      item.is_available,
      item.is_featured,
      item.display_order
    );
  }

  // 4. Cafe Settings
  const defaultOpeningHours = JSON.stringify({
    Monday: { open: '07:00', close: '22:00', isOpen: true },
    Tuesday: { open: '07:00', close: '22:00', isOpen: true },
    Wednesday: { open: '07:00', close: '22:00', isOpen: true },
    Thursday: { open: '07:00', close: '22:00', isOpen: true },
    Friday: { open: '07:00', close: '23:00', isOpen: true },
    Saturday: { open: '08:00', close: '23:00', isOpen: true },
    Sunday: { open: '08:00', close: '21:00', isOpen: true },
  });

  db.prepare(`
    INSERT INTO cafe_settings (id, cafe_name, tagline, primary_color, secondary_color, address, phone, email, opening_hours, slot_interval_minutes, slot_capacity, max_party_size, cancellation_policy, social_links)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'default',
    'CaféVerse',
    'Your Daily Dose of Coffee & Comfort.',
    '#38251D',
    '#C58B59',
    '42 Artisan Lane, Coffee Quarter, NY 10001',
    '+1 (555) 234-5678',
    'hello@cafeverse.com',
    defaultOpeningHours,
    30,
    30,
    10,
    'Free cancellation up to 2 hours before your reserved slot. Late arrivals over 15 minutes may lose table guarantee during peak hours.',
    JSON.stringify({ instagram: 'https://instagram.com/cafeverse', facebook: 'https://facebook.com/cafeverse', twitter: 'https://x.com/cafeverse' })
  );

  // 5. Sample Reservations for dashboard
  const today = new Date().toISOString().split('T')[0];

  const sampleReservations = [
    {
      id: 'res_001',
      reference_code: 'CV-8F92A',
      user_id: customerId,
      customer_name: 'Elena Rostova',
      customer_email: 'customer@cafeverse.com',
      customer_phone: '+1 555-0199',
      date: today,
      time: '12:30',
      party_size: 2,
      adults: 2,
      children: 0,
      seating_preference: 'Window Booth',
      special_requests: 'Corner table preferred for business lunch',
      status: 'confirmed',
      internal_notes: 'VIP customer - free espresso voucher',
      send_reminder: 1
    },
    {
      id: 'res_002',
      reference_code: 'CV-9K31B',
      user_id: null,
      customer_name: 'Marcus Sterling',
      customer_email: 'marcus.s@example.com',
      customer_phone: '+1 555-4812',
      date: today,
      time: '14:00',
      party_size: 4,
      adults: 2,
      children: 2,
      seating_preference: 'Garden Terrace',
      special_requests: 'High chair needed for 1 toddler',
      status: 'pending',
      internal_notes: '',
      send_reminder: 1
    },
    {
      id: 'res_003',
      reference_code: 'CV-1M74C',
      user_id: null,
      customer_name: 'Sophie & Liam',
      customer_email: 'sophie.l@example.com',
      customer_phone: '+1 555-9230',
      date: today,
      time: '17:30',
      party_size: 2,
      adults: 2,
      children: 0,
      seating_preference: 'Quiet Corner',
      special_requests: 'Anniversary celebration',
      status: 'confirmed',
      internal_notes: 'Complimentary dessert slice',
      send_reminder: 1
    }
  ];

  const stmtRes = db.prepare(`
    INSERT INTO reservations (id, reference_code, user_id, customer_name, customer_email, customer_phone, date, time, party_size, adults, children, seating_preference, special_requests, status, internal_notes, send_reminder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of sampleReservations) {
    stmtRes.run(
      r.id,
      r.reference_code,
      r.user_id,
      r.customer_name,
      r.customer_email,
      r.customer_phone,
      r.date,
      r.time,
      r.party_size,
      r.adults,
      r.children,
      r.seating_preference,
      r.special_requests,
      r.status,
      r.internal_notes,
      r.send_reminder
    );
  }

  // 6. Reviews
  const sampleReviews = [
    {
      id: 'rev_001',
      customer_name: 'Clara Vance',
      rating: 5,
      title: 'Best Artisan Latte in the City',
      comment: 'The 2.5D atmosphere and rich dark roasted mocha are unmatched. Staff is super warm and welcoming!',
      status: 'published'
    },
    {
      id: 'rev_002',
      customer_name: 'Julian Thorne',
      rating: 5,
      title: 'Flawless Table Booking Experience',
      comment: 'Reserved a window table via the app in under 1 minute. The almond croissant was freshly baked and melt-in-mouth.',
      status: 'published'
    },
    {
      id: 'rev_003',
      customer_name: 'Amara Chen',
      rating: 5,
      title: 'A True Specialty Coffee Haven',
      comment: 'From Nitro Cold Brew on tap to Basque cheesecake, CaféVerse defines premium coffee standards.',
      status: 'published'
    }
  ];

  const stmtRev = db.prepare(`
    INSERT INTO reviews (id, customer_name, rating, title, comment, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const r of sampleReviews) {
    stmtRev.run(r.id, r.customer_name, r.rating, r.title, r.comment, r.status);
  }

  // 7. Cafe Tables (Seating management)
  const sampleTables = [
    { id: 'tbl_01', table_number: 'T-01', capacity: 2, section: 'Window Booth', status: 'available', notes: 'Prime window view for couples' },
    { id: 'tbl_02', table_number: 'T-02', capacity: 2, section: 'Window Booth', status: 'reserved', notes: 'Reserved for 12:30 PM slot' },
    { id: 'tbl_03', table_number: 'T-03', capacity: 4, section: 'Indoor Main Hall', status: 'available', notes: 'Near espresso bar' },
    { id: 'tbl_04', table_number: 'T-04', capacity: 4, section: 'Indoor Main Hall', status: 'occupied', notes: 'Walk-in guest occupied' },
    { id: 'tbl_05', table_number: 'T-05', capacity: 6, section: 'Garden Terrace', status: 'available', notes: 'Outdoor patio seating' },
    { id: 'tbl_06', table_number: 'T-06', capacity: 8, section: 'Quiet Corner', status: 'available', notes: 'Large family booth' },
  ];

  const stmtTbl = db.prepare(`
    INSERT INTO cafe_tables (id, table_number, capacity, section, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const t of sampleTables) {
    stmtTbl.run(t.id, t.table_number, t.capacity, t.section, t.status, t.notes);
  }

  console.log('CaféVerse database seeded successfully!');
}

if (require.main === module) {
  seed();
}
