import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Coffee, Calendar, Settings, ShieldCheck, Users, Plus, Edit, Trash2,
  CheckCircle, XCircle, Clock, Eye, EyeOff, Search, Save, AlertCircle, RefreshCw,
  Armchair, MapPin, User, FileText, Filter, Sparkles, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'tables' | 'menu' | 'settings' | 'audit'>('overview');

  // Metrics & Logs Data
  const [metrics, setMetrics] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Menu State
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Menu Form
  const [itemName, setItemName] = useState('');
  const [itemCat, setItemCat] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(199);
  const [itemShortDesc, setItemShortDesc] = useState('');
  const [itemFullDesc, setItemFullDesc] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemFeatured, setItemFeatured] = useState(false);

  // Reservation State
  const [reservations, setReservations] = useState<any[]>([]);
  const [resStatusFilter, setResStatusFilter] = useState('all');
  const [resSearch, setResSearch] = useState('');
  const [resDateFilter, setResDateFilter] = useState('');
  const [activeResModal, setActiveResModal] = useState<any | null>(null);
  const [resInternalNote, setResInternalNote] = useState('');

  // Tables State
  const [tables, setTables] = useState<any[]>([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState<any | null>(null);
  const [tblNumber, setTblNumber] = useState('');
  const [tblCapacity, setTblCapacity] = useState<number>(4);
  const [tblSection, setTblSection] = useState('Indoor Main Hall');
  const [tblStatus, setTblStatus] = useState<'available' | 'reserved' | 'occupied' | 'maintenance'>('available');
  const [tblNotes, setTblNotes] = useState('');

  // Cafe Settings State
  const [cafeSettings, setCafeSettings] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // Sync tab query if present in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'reservations', 'tables', 'menu', 'settings', 'audit'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, menuRes, catRes, resRes, tblRes, setRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getMenuItems({ includeUnavailable: true }),
        api.getCategories(),
        api.getAdminReservations(),
        api.getAdminTables(),
        api.getSettings()
      ]);

      setMetrics(dashRes.metrics);
      setRecentLogs(dashRes.recentLogs || []);
      setMenuItems(menuRes.items || []);
      setCategories(catRes.categories || []);
      setReservations(resRes.reservations || []);
      setTables(tblRes.tables || []);
      setCafeSettings(setRes.settings);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Add/Edit Item Modal
  const openItemModal = (item?: any) => {
    const defaultCat = categories.length > 0 ? categories[0].id : 'cat_espresso';
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemCat(item.categoryId || defaultCat);
      setItemPrice(item.price);
      setItemShortDesc(item.shortDescription);
      setItemFullDesc(item.fullDescription || '');
      setItemImage(item.imageUrl);
      setItemAvailable(item.isAvailable);
      setItemFeatured(item.isFeatured);
    } else {
      setEditingItem(null);
      setItemName('');
      setItemCat(defaultCat);
      setItemPrice(199);
      setItemShortDesc('');
      setItemFullDesc('');
      setItemImage('https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop');
      setItemAvailable(true);
      setItemFeatured(false);
    }
    setShowItemModal(true);
  };

  // Save Menu Item (Dishes & Drinks)
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCatId = itemCat || (categories.length > 0 ? categories[0].id : 'cat_espresso');
      const selectedImageUrl = itemImage.trim() || 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
      
      const payload = {
        name: itemName,
        categoryId: selectedCatId,
        price: Number(itemPrice) > 0 ? Number(itemPrice) : 199,
        shortDescription: itemShortDesc || `${itemName} prepared fresh by our barista master.`,
        fullDescription: itemFullDesc || '',
        imageUrl: selectedImageUrl,
        isAvailable: itemAvailable,
        isFeatured: itemFeatured,
        dietaryLabels: ['Vegetarian'],
        allergens: []
      };

      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
      } else {
        await api.createMenuItem(payload);
      }

      setShowItemModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save menu item');
    }
  };

  // Delete Menu Item
  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteMenuItem(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  // Open Add/Edit Table Modal
  const openTableModal = (tbl?: any) => {
    if (tbl) {
      setEditingTable(tbl);
      setTblNumber(tbl.tableNumber);
      setTblCapacity(tbl.capacity);
      setTblSection(tbl.section);
      setTblStatus(tbl.status);
      setTblNotes(tbl.notes || '');
    } else {
      setEditingTable(null);
      setTblNumber(`T-0${tables.length + 1}`);
      setTblCapacity(4);
      setTblSection('Indoor Main Hall');
      setTblStatus('available');
      setTblNotes('');
    }
    setShowTableModal(true);
  };

  // Save Table
  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        tableNumber: tblNumber,
        capacity: Number(tblCapacity),
        section: tblSection,
        status: tblStatus,
        notes: tblNotes
      };

      if (editingTable) {
        await api.updateTable(editingTable.id, payload);
      } else {
        await api.createTable(payload);
      }

      setShowTableModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save table');
    }
  };

  // Quick Toggle Table Status
  const handleToggleTableStatus = async (tableId: string, currentStatus: string) => {
    const statuses: ('available' | 'reserved' | 'occupied' | 'maintenance')[] = ['available', 'reserved', 'occupied', 'maintenance'];
    const nextIdx = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    try {
      await api.updateTable(tableId, { status: nextStatus });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update table status');
    }
  };

  // Delete Table
  const handleDeleteTable = async (id: string, num: string) => {
    if (!window.confirm(`Are you sure you want to delete table ${num}?`)) return;
    try {
      await api.deleteTable(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete table');
    }
  };

  // Update Reservation Status
  const handleUpdateResStatus = async (id: string, status: string, notes?: string) => {
    try {
      await api.updateReservationStatus(id, status, notes);
      if (activeResModal && activeResModal.id === id) {
        setActiveResModal({ ...activeResModal, status, internalNotes: notes ?? activeResModal.internalNotes });
      }
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update reservation status');
    }
  };

  // Save Cafe Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(cafeSettings);
      alert('Settings updated successfully');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = resStatusFilter === 'all' || r.status === resStatusFilter;
    const matchesDate = !resDateFilter || r.date === resDateFilter;
    const matchesSearch =
      r.referenceCode.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.customerName.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.customerPhone.toLowerCase().includes(resSearch.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((i) => {
    const matchesCat = menuCatFilter === 'all' || i.categoryId === menuCatFilter;
    const matchesSearch =
      i.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      i.shortDescription.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="pt-28 pb-24 text-center text-ivory/60 bg-espresso-950 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl border border-caramel-500/30">
          <RefreshCw className="w-5 h-5 text-caramel-400 animate-spin" />
          <span className="text-sm font-medium text-ivory">Loading CaféVerse Admin Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-espresso-950 text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-caramel-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 text-caramel-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Executive Admin Control Center
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ivory">CaféVerse Admin Portal</h1>
          </div>

          <button
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-caramel-400 hover:bg-espresso-800 text-xs font-semibold flex items-center gap-2 transition-all shadow"
          >
            <RefreshCw className="w-4 h-4" /> Refresh System Data
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex gap-2 overflow-x-auto border-b border-caramel-500/20 pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-caramel-500 text-espresso-950 shadow-md' : 'bg-espresso-900/60 text-ivory/70 hover:bg-espresso-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reservations' ? 'bg-caramel-500 text-espresso-950 shadow-md' : 'bg-espresso-900/60 text-ivory/70 hover:bg-espresso-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Customer Reservations ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tables' ? 'bg-caramel-500 text-espresso-950 shadow-md' : 'bg-espresso-900/60 text-ivory/70 hover:bg-espresso-900'
            }`}
          >
            <Armchair className="w-4 h-4" /> Table & Seating Management ({tables.length})
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'menu' ? 'bg-caramel-500 text-espresso-950 shadow-md' : 'bg-espresso-900/60 text-ivory/70 hover:bg-espresso-900'
            }`}
          >
            <Coffee className="w-4 h-4" /> Food & Dishes Menu ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-caramel-500 text-espresso-950 shadow-md' : 'bg-espresso-900/60 text-ivory/70 hover:bg-espresso-900'
            }`}
          >
            <Settings className="w-4 h-4" /> Café Settings
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-1">
                <span className="text-xs text-ivory/60">Today's Bookings</span>
                <p className="font-serif text-3xl font-bold text-caramel-400">{metrics?.todayReservations || 0}</p>
              </div>
              <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-1">
                <span className="text-xs text-ivory/60">Confirmed Guests Today</span>
                <p className="font-serif text-3xl font-bold text-emerald-400">{metrics?.todayGuests || 0}</p>
              </div>
              <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-1">
                <span className="text-xs text-ivory/60">Pending Approvals</span>
                <p className="font-serif text-3xl font-bold text-amber-400">{metrics?.pendingApprovals || 0}</p>
              </div>
              <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-1">
                <span className="text-xs text-ivory/60">Café Tables Available</span>
                <p className="font-serif text-3xl font-bold text-ivory">{metrics?.availableTables || 0} / {metrics?.totalTables || 0}</p>
              </div>
            </div>

            {/* Recent Customer Reservations Quick Overview */}
            <div className="glass-card p-6 rounded-3xl border border-caramel-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-ivory">Recent Customer Bookings</h3>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className="text-xs text-caramel-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View All Reservations ({reservations.length}) →
                </button>
              </div>

              {reservations.slice(0, 4).length === 0 ? (
                <p className="text-xs text-ivory/50">No recent reservations recorded.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reservations.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setActiveResModal(r);
                        setResInternalNote(r.internalNotes || '');
                      }}
                      className="p-4 rounded-2xl bg-espresso-900 border border-caramel-500/20 hover:border-caramel-500/50 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-xs font-bold text-caramel-400">REF: {r.referenceCode}</span>
                          <h4 className="font-serif font-bold text-ivory text-base">{r.customerName}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          r.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          r.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="text-xs text-ivory/70 flex justify-between">
                        <span>📅 {r.date} at {r.time}</span>
                        <span>👥 {r.partySize} Guests</span>
                      </div>
                      <p className="text-[11px] text-caramel-400/80 font-medium">Click to view full guest details & update status →</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit Log Timeline */}
            <div className="glass-card p-6 rounded-3xl border border-caramel-500/30 space-y-4">
              <h3 className="font-serif text-xl font-bold text-ivory">Recent Security & Activity Trail</h3>
              <div className="space-y-3">
                {recentLogs.map((log: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs p-3 rounded-xl bg-espresso-900 border border-caramel-500/10">
                    <div>
                      <span className="font-bold text-caramel-400">{log.action}: </span>
                      <span className="text-ivory/80">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-ivory/40">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER RESERVATIONS SECTION */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory">Customer Reservation Operations</h3>
                <p className="text-xs text-ivory/60">Manage table bookings, review guest details, and update booking statuses.</p>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="glass-card p-4 rounded-2xl border border-caramel-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
                <input
                  type="text"
                  placeholder="Search Ref, Name, Email, Phone..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-xs focus:outline-none focus:border-caramel-400"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={resDateFilter}
                  onChange={(e) => setResDateFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-xs focus:outline-none focus:border-caramel-400"
                />
              </div>

              <div>
                <select
                  value={resStatusFilter}
                  onChange={(e) => setResStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-xs focus:outline-none focus:border-caramel-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Reservations Table / Cards */}
            {filteredReservations.length === 0 ? (
              <div className="py-12 text-center text-ivory/50 text-xs">No customer reservations found.</div>
            ) : (
              <div className="space-y-4">
                {filteredReservations.map((res) => (
                  <div
                    key={res.id}
                    className="glass-card p-4 sm:p-5 rounded-3xl border border-caramel-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-caramel-500/60 transition-colors w-full overflow-hidden"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-caramel-400 text-sm">REF: {res.referenceCode}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          res.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          res.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <p className="font-serif font-bold text-lg text-ivory truncate">{res.customerName}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ivory/80">
                        <span>📅 {res.date} at {res.time}</span>
                        <span>👥 {res.partySize} Guests ({res.adults} A, {res.children} C)</span>
                        <span>🪑 {res.seatingPreference}</span>
                      </div>

                      <p className="text-[11px] text-ivory/60 break-all flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>Email: <strong className="text-ivory/90">{res.customerEmail}</strong></span>
                        <span className="hidden sm:inline">•</span>
                        <span>Phone: <strong className="text-ivory/90">{res.customerPhone}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setActiveResModal(res);
                          setResInternalNote(res.internalNotes || '');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-caramel-300 hover:bg-caramel-500 hover:text-espresso-950 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Details
                      </button>

                      {/* Precise Status Action Buttons */}
                      {res.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'confirmed')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-espresso-950 font-semibold text-xs border border-emerald-500/30 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'rejected')}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-semibold text-xs border border-rose-500/30 transition-all shadow-sm flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}

                      {res.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'completed')}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-white font-semibold text-xs border border-sky-500/30 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Armchair className="w-3.5 h-3.5" /> Mark Seated
                          </button>
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'cancelled')}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-semibold text-xs border border-rose-500/30 transition-all shadow-sm flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </>
                      )}

                      {res.status === 'completed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/25 font-medium text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Guest Seated & Done
                        </span>
                      )}

                      {(res.status === 'rejected' || res.status === 'cancelled') && (
                        <button
                          onClick={() => handleUpdateResStatus(res.id, 'confirmed')}
                          className="px-3.5 py-1.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 font-medium text-xs transition-all"
                        >
                          Re-open / Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TABLE & SEATING MANAGEMENT SECTION */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory">Table & Seating Capacity Management</h3>
                <p className="text-xs text-ivory/60">Manually add, edit, and manage table availability and occupancy statuses in the café.</p>
              </div>

              <button
                onClick={() => openTableModal()}
                className="px-5 py-2.5 rounded-xl bg-caramel-500 text-espresso-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow hover:bg-caramel-400 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Table
              </button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((tbl) => (
                <div key={tbl.id} className="glass-card p-5 rounded-3xl border border-caramel-500/20 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Armchair className="w-5 h-5 text-caramel-400" />
                        <span className="font-serif font-bold text-xl text-ivory">{tbl.tableNumber}</span>
                      </div>
                      
                      {/* Status Badge */}
                      <button
                        onClick={() => handleToggleTableStatus(tbl.id, tbl.status)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          tbl.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          tbl.status === 'reserved' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          tbl.status === 'occupied' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                        title="Click to toggle table status"
                      >
                        {tbl.status}
                      </button>
                    </div>

                    <p className="text-xs text-caramel-400/90 font-semibold">
                      Capacity: {tbl.capacity} Chairs / Seats
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-ivory/70">
                      <MapPin className="w-3.5 h-3.5 text-caramel-400" />
                      <span>{tbl.section}</span>
                    </div>

                    {tbl.notes && (
                      <p className="text-[11px] text-ivory/50 italic pt-1">"{tbl.notes}"</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-caramel-500/20 flex items-center justify-between">
                    <span className="text-[10px] text-ivory/40">Tap status to cycle state</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openTableModal(tbl)}
                        className="p-2 rounded-lg bg-espresso-900 border border-caramel-500/30 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 transition-colors"
                        title="Edit Table"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTable(tbl.id, tbl.tableNumber)}
                        className="p-2 rounded-lg bg-espresso-900 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Table"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MENU MANAGEMENT (DISHES & FOOD ITEMS) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory">Food & Dishes Menu Management</h3>
                <p className="text-xs text-ivory/60">Add, edit, publish dishes, coffee drinks, and artisanal baked items to the live menu.</p>
              </div>

              <button
                onClick={() => openItemModal()}
                className="px-5 py-2.5 rounded-xl bg-caramel-500 text-espresso-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow hover:bg-caramel-400 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Dish / Drink
              </button>
            </div>

            {/* Menu Filters */}
            <div className="glass-card p-4 rounded-2xl border border-caramel-500/20 flex flex-col sm:flex-row justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
                <input
                  type="text"
                  placeholder="Search dishes by name..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-xs focus:outline-none focus:border-caramel-400"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setMenuCatFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    menuCatFilter === 'all' ? 'bg-caramel-500 text-espresso-950' : 'bg-espresso-900 text-ivory/70 border border-caramel-500/20'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setMenuCatFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                      menuCatFilter === c.id ? 'bg-caramel-500 text-espresso-950' : 'bg-espresso-900 text-ivory/70 border border-caramel-500/20'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="glass-card p-5 rounded-3xl border border-caramel-500/20 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-44 rounded-2xl overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-caramel-500 text-espresso-950 font-bold text-xs font-mono shadow">
                        ₹{item.price}
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-caramel-400 font-semibold">{item.categoryName}</span>
                    <h4 className="font-serif font-bold text-lg text-ivory">{item.name}</h4>
                    <p className="text-xs text-ivory/70 line-clamp-2">{item.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-caramel-500/20 flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      item.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.isAvailable ? 'Published / Active' : 'Sold Out'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openItemModal(item)}
                        className="p-2 rounded-lg bg-espresso-900 border border-caramel-500/30 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="p-2 rounded-lg bg-espresso-900 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CAFÉ SETTINGS */}
        {activeTab === 'settings' && cafeSettings && (
          <form onSubmit={handleSaveSettings} className="glass-card p-8 rounded-3xl border border-caramel-500/30 space-y-6 max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-ivory">Café Configuration</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Café Name</label>
                <input
                  type="text"
                  value={cafeSettings.cafeName}
                  onChange={(e) => setCafeSettings({ ...cafeSettings, cafeName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Tagline</label>
                <input
                  type="text"
                  value={cafeSettings.tagline}
                  onChange={(e) => setCafeSettings({ ...cafeSettings, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Address</label>
                <input
                  type="text"
                  value={cafeSettings.address}
                  onChange={(e) => setCafeSettings({ ...cafeSettings, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Slot Capacity (Guests)</label>
                  <input
                    type="number"
                    value={cafeSettings.slotCapacity}
                    onChange={(e) => setCafeSettings({ ...cafeSettings, slotCapacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Max Party Size</label>
                  <input
                    type="number"
                    value={cafeSettings.maxPartySize}
                    onChange={(e) => setCafeSettings({ ...cafeSettings, maxPartySize: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-caramel-500 text-espresso-950 font-bold text-sm hover:bg-caramel-400 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Cafe Settings
            </button>
          </form>
        )}

      </div>

      {/* MODAL 1: ADD / EDIT DISH ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-caramel-500/40 space-y-4 text-ivory">
            <h3 className="font-serif text-2xl font-bold text-ivory">
              {editingItem ? 'Edit Dish / Food Item' : 'Add New Dish / Food Item'}
            </h3>
            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Dish Name</label>
                <input type="text" required placeholder="e.g. Avocado Toast" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Category</label>
                  <select
                    value={itemCat || (categories.length > 0 ? categories[0].id : '')}
                    onChange={(e) => setItemCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Price (₹)</label>
                  <input type="number" step="1" required value={itemPrice} onChange={(e) => setItemPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Short Description</label>
                <input type="text" required placeholder="Brief menu summary..." value={itemShortDesc} onChange={(e) => setItemShortDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Full Description</label>
                <textarea rows={2} placeholder="Detailed ingredients..." value={itemFullDesc} onChange={(e) => setItemFullDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Image URL</label>
                <input type="url" required value={itemImage} onChange={(e) => setItemImage(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={itemAvailable} onChange={(e) => setItemAvailable(e.target.checked)} />
                  Published / Active
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={itemFeatured} onChange={(e) => setItemFeatured(e.target.checked)} />
                  Featured Item
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowItemModal(false)} className="flex-1 py-2 rounded-xl border border-caramel-500/30 text-ivory">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-caramel-500 text-espresso-950 font-bold">Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT TABLE MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-caramel-500/40 space-y-4 text-ivory">
            <h3 className="font-serif text-2xl font-bold text-ivory">
              {editingTable ? 'Edit Table Details' : 'Add New Café Table'}
            </h3>
            <form onSubmit={handleSaveTable} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Table Code / No.</label>
                  <input type="text" required placeholder="e.g. T-07" value={tblNumber} onChange={(e) => setTblNumber(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
                </div>
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Chairs / Capacity</label>
                  <input type="number" min="1" required value={tblCapacity} onChange={(e) => setTblCapacity(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Seating Section</label>
                <select value={tblSection} onChange={(e) => setTblSection(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory">
                  <option value="Indoor Main Hall">Indoor Main Hall</option>
                  <option value="Window Booth">Window Booth</option>
                  <option value="Garden Terrace">Garden Terrace</option>
                  <option value="Quiet Corner">Quiet Corner</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Initial Status</label>
                <select value={tblStatus} onChange={(e) => setTblStatus(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory">
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Notes / Description</label>
                <input type="text" placeholder="e.g. Near window view" value={tblNotes} onChange={(e) => setTblNotes(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTableModal(false)} className="flex-1 py-2 rounded-xl border border-caramel-500/30 text-ivory">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-caramel-500 text-espresso-950 font-bold">Save Table</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL RESERVATION DETAILS MODAL */}
      {activeResModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-caramel-500/40 space-y-4 text-ivory shadow-25d">
            <div className="flex justify-between items-start border-b border-caramel-500/20 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-caramel-400">REF: {activeResModal.referenceCode}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeResModal.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    activeResModal.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    activeResModal.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {activeResModal.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-ivory mt-1">{activeResModal.customerName}</h3>
              </div>
              <button
                onClick={() => setActiveResModal(null)}
                className="w-8 h-8 rounded-full bg-espresso-900 border border-caramel-500/30 text-ivory/70 hover:text-ivory hover:bg-espresso-800 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-espresso-900/90 border border-caramel-500/20 text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-ivory/60">Email Address:</span>
                <span className="font-semibold text-ivory">{activeResModal.customerEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ivory/60">Phone Number:</span>
                <span className="font-semibold text-ivory">{activeResModal.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ivory/60">Date & Time Slot:</span>
                <span className="font-semibold text-caramel-400">📅 {activeResModal.date} at ⏰ {activeResModal.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ivory/60">Party Size:</span>
                <span className="font-semibold text-ivory">👥 {activeResModal.partySize} Guests ({activeResModal.adults} Adults, {activeResModal.children} Children)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ivory/60">Seating Area:</span>
                <span className="font-semibold text-ivory">🪑 {activeResModal.seatingPreference}</span>
              </div>
              {activeResModal.specialRequests && (
                <div className="pt-2 border-t border-caramel-500/20">
                  <span className="text-ivory/60 block mb-1">Special Requests:</span>
                  <p className="text-ivory italic bg-espresso-950/60 p-2.5 rounded-xl border border-caramel-500/10">"{activeResModal.specialRequests}"</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-ivory/70 font-medium">Internal Admin Notes (Staff Only)</label>
                <button
                  type="button"
                  onClick={() => handleUpdateResStatus(activeResModal.id, activeResModal.status, resInternalNote)}
                  className="text-[11px] text-caramel-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save Notes
                </button>
              </div>
              <textarea
                rows={2}
                value={resInternalNote}
                onChange={(e) => setResInternalNote(e.target.value)}
                placeholder="Add notes for café staff..."
                className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-xs focus:outline-none focus:border-caramel-400"
              />
            </div>

            <div className="pt-2 border-t border-caramel-500/20 space-y-2">
              <span className="text-[11px] text-ivory/50 block">Update Reservation Booking Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateResStatus(activeResModal.id, 'confirmed', resInternalNote)}
                  className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-espresso-950 border border-emerald-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm
                </button>
                <button
                  onClick={() => handleUpdateResStatus(activeResModal.id, 'completed', resInternalNote)}
                  className="py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Armchair className="w-3.5 h-3.5" /> Seated
                </button>
                <button
                  onClick={() => handleUpdateResStatus(activeResModal.id, 'rejected', resInternalNote)}
                  className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
