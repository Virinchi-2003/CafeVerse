import React, { useEffect, useState } from 'react';
import { Search, Filter, Sparkles, Check, Info, Edit3, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Floating25DBackground } from '../components/Background25D';

export const MenuPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Selected item modal
  const [activeItem, setActiveItem] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getMenuItems({ includeUnavailable: isAdmin })
    ]).then(([catRes, itemRes]) => {
      setCategories(catRes.categories || []);
      setItems(itemRes.items || []);
    }).catch(err => console.error('Failed to load menu:', err))
    .finally(() => setIsLoading(false));
  }, [isAdmin]);

  // Toggle availability action for admin directly on menu
  const handleToggleAvailable = async (item: any) => {
    try {
      await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      setItems(items.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
    } catch (err: any) {
      alert(err.message || 'Failed to update item availability');
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary =
      selectedDietary === 'all' ||
      (item.dietaryLabels && item.dietaryLabels.includes(selectedDietary));

    return matchesCat && matchesSearch && matchesDietary;
  });

  return (
    <div className="py-12 px-4 bg-espresso-950 text-ivory min-h-screen relative overflow-hidden">
      <Floating25DBackground enableMouseParallax={true} />
      <div className="max-w-7xl mx-auto space-y-10 relative z-20">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Artisanal Selection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ivory">Our Digital Menu</h1>
          <p className="text-sm text-ivory/70 max-w-xl mx-auto">
            Explore our curated espresso creations, cold brews, and freshly baked pastries.
          </p>
        </div>

        {/* Filters & Search Controls */}
        <div className="space-y-6">
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-caramel-400/70" />
            <input
              type="text"
              placeholder="Search coffee, croissants, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-espresso-900 border border-caramel-500/30 text-ivory placeholder-ivory/40 text-sm focus:outline-none focus:border-caramel-400 shadow-inner"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-caramel-500 text-espresso-950 shadow-md'
                  : 'bg-espresso-900/60 text-ivory/80 border border-caramel-500/20 hover:border-caramel-500/50'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-caramel-500 text-espresso-950 shadow-md'
                    : 'bg-espresso-900/60 text-ivory/80 border border-caramel-500/20 hover:border-caramel-500/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-ivory/50 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Dietary:</span>
            {['all', 'Vegan', 'Gluten-Free', 'Vegetarian', 'Organic'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedDietary(tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  selectedDietary === tag
                    ? 'bg-caramel-500/20 border border-caramel-400 text-caramel-400'
                    : 'bg-espresso-900/40 text-ivory/60 hover:text-ivory'
                }`}
              >
                {tag === 'all' ? 'Any' : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-ivory/50 text-sm">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-caramel-400 text-sm">No menu items found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`glass-card rounded-3xl p-5 border border-caramel-500/20 card-25d flex flex-col justify-between group relative ${
                  !item.isAvailable ? 'opacity-65' : ''
                }`}
              >
                {/* Sold Out / Admin Overlay */}
                {!item.isAvailable && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-red-500/90 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                    Sold Out
                  </div>
                )}

                {/* Admin Quick Action Button */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-30 flex gap-2">
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`p-2 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow ${
                        item.isAvailable ? 'bg-amber-500/80 text-espresso-950' : 'bg-emerald-500/80 text-espresso-950'
                      }`}
                      title={item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin?tab=menu&editId=${item.id}`)}
                      className="p-2 rounded-full bg-caramel-500 text-espresso-950 shadow"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Image */}
                <div
                  onClick={() => setActiveItem(item)}
                  className="relative h-56 rounded-2xl overflow-hidden mb-4 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-caramel-500 text-espresso-950 text-sm font-bold font-mono shadow">
                    ₹{item.price}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 cursor-pointer" onClick={() => setActiveItem(item)}>
                  <span className="text-[11px] uppercase tracking-wider text-caramel-400 font-semibold">
                    {item.categoryName}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ivory group-hover:text-caramel-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-ivory/70 leading-relaxed line-clamp-2">
                    {item.shortDescription}
                  </p>

                  {/* Dietary tags */}
                  {item.dietaryLabels && item.dietaryLabels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.dietaryLabels.map((lbl: string) => (
                        <span key={lbl} className="px-2 py-0.5 rounded-md bg-caramel-500/10 text-caramel-400 text-[10px] font-medium border border-caramel-500/20">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveItem(item)}
                  className="mt-4 w-full py-2.5 rounded-xl border border-caramel-500/30 text-caramel-400 text-xs font-semibold hover:bg-caramel-500 hover:text-espresso-950 transition-all flex items-center justify-center gap-1.5"
                >
                  <Info className="w-4 h-4" /> View Ingredients & Details
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full overflow-hidden border border-caramel-500/40 relative text-ivory shadow-25d">
            <div className="relative h-64">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-ivory hover:bg-black"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase text-caramel-400 font-semibold">{activeItem.categoryName}</span>
                  <h3 className="font-serif text-2xl font-bold text-ivory">{activeItem.name}</h3>
                </div>
                <span className="text-2xl font-bold font-mono text-caramel-400">₹{activeItem.price}</span>
              </div>

              <p className="text-sm text-ivory/80 leading-relaxed font-light">
                {activeItem.fullDescription || activeItem.shortDescription}
              </p>

              {activeItem.allergens && activeItem.allergens.length > 0 && (
                <div className="pt-2 border-t border-caramel-500/20">
                  <span className="text-xs text-red-400 font-semibold">Contains Allergens: </span>
                  <span className="text-xs text-ivory/70">{activeItem.allergens.join(', ')}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setActiveItem(null);
                  navigate('/reservations');
                }}
                className="w-full py-3 rounded-xl bg-caramel-500 text-espresso-950 font-bold text-sm hover:bg-caramel-400 transition-colors"
              >
                Book Table & Enjoy This Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
