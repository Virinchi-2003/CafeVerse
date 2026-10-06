import React, { useState, useEffect } from 'react';
import { Coffee, Calendar, Utensils, User as UserIcon, Shield, Plus, Minus, CheckCircle, ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'booking' | 'my-bookings' | 'admin'>('home');
  const [user, setUser] = useState<any | null>(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('cafeverse_mobile_token');
    if (token) {
      api.getMe().then(res => setUser(res.user)).catch(() => {});
    }
  }, []);

  // Shared state for Menu & Booking
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Booking Wizard State (Matching Image 2 Reference)
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState<string>('12:30');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [email, setEmail] = useState<string>(user?.email || 'hello@gmail.com');
  const [firstName, setFirstName] = useState<string>(user ? user.name.split(' ')[0] : 'Elena');
  const [lastName, setLastName] = useState<string>(user && user.name.split(' ').length > 1 ? user.name.split(' ')[1] : 'Rostova');
  const [phone, setPhone] = useState<string>('+1 555-0199');
  const [sendReminder, setSendReminder] = useState<boolean>(true);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Admin Mobile State
  const [adminReservations, setAdminReservations] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories || [])).catch(() => {});
    api.getMenuItems().then(res => setMenuItems(res.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'booking') {
      api.getAvailability(bookingDate).then(res => setAvailableSlots(res.slots || [])).catch(() => {});
    }
    if (activeTab === 'admin' && user?.role === 'admin') {
      api.getAdminReservations().then(res => setAdminReservations(res.reservations || [])).catch(() => {});
    }
  }, [activeTab, bookingDate, user]);

  // Handle Mobile Booking Submit (Matching Image 2)
  const handleConfirmMobileBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const res = await api.createReservation({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        date: bookingDate,
        time: bookingTime,
        adults,
        children: childrenCount,
        seatingPreference: 'Window Booth',
        sendReminder,
      });
      setConfirmedBooking(res.reservation);
      setBookingStep(4);
    } catch (err: any) {
      alert(err.message || 'Booking failed');
    }
  };

  const handleUpdateStatusMobile = async (id: string, status: string) => {
    try {
      await api.updateReservationStatus(id, status);
      const res = await api.getAdminReservations();
      setAdminReservations(res.reservations || []);
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  const formattedDateSummary = new Date(bookingDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 sm:p-4">
      
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-sm h-full sm:h-[844px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-8 border-gray-800">
        
        {/* Status Bar */}
        <div className="bg-espresso-950 text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <span>5G</span>
            <div className="w-4 h-2 bg-white rounded-xs" />
          </div>
        </div>

        {/* Header App Bar */}
        <div className="bg-espresso-950 text-white px-4 py-3 flex items-center justify-between border-b border-espresso-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-base tracking-tight">CaféVerse Mobile</span>
          </div>

          {user?.role === 'admin' ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-2.5 py-1 rounded-full bg-caramel-500 text-espresso-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.setItem('cafeverse_mobile_token', 'demo');
                api.login({ email: 'admin@cafeverse.com', password: 'admin123' })
                  .then(r => {
                    localStorage.setItem('cafeverse_mobile_token', r.token);
                    setUser(r.user);
                    alert('Signed in as Admin');
                  });
              }}
              className="text-[10px] text-caramel-400 underline"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* MAIN MOBILE SCREEN VIEWPORT */}
        <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
          
          {/* TAB 1: HOME SCREEN */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Hero Banner */}
              <div className="relative h-64 bg-espresso-950 text-white overflow-hidden p-6 flex flex-col justify-end">
                <img
                  src="https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop"
                  alt="Hero Coffee"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-caramel-400 tracking-widest">Specialty Roasts</span>
                  <h1 className="font-serif text-3xl font-bold leading-tight">Your Daily Dose of Coffee</h1>
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="mt-2 px-5 py-2 rounded-full bg-caramel text-white text-xs font-bold shadow-lg"
                  >
                    Reserve Table
                  </button>
                </div>
              </div>

              {/* Featured Drinks Horizontal Scroll */}
              <div className="px-4 space-y-2">
                <h3 className="font-serif font-bold text-sm text-gray-900">Featured Beverages</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {menuItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-36 flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 space-y-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                        }}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <h4 className="font-bold text-xs text-gray-800 truncate">{item.name}</h4>
                      <p className="text-[10px] text-caramel font-bold font-mono">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
                >
                  <Utensils className="w-6 h-6 text-caramel" />
                  <div className="text-left">
                    <p className="font-bold text-xs text-gray-900">Digital Menu</p>
                    <p className="text-[10px] text-gray-500">Browse roasts</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
                >
                  <Calendar className="w-6 h-6 text-[#006A4E]" />
                  <div className="text-left">
                    <p className="font-bold text-xs text-gray-900">Book Table</p>
                    <p className="text-[10px] text-gray-500">Instant seats</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL MENU */}
          {activeTab === 'menu' && (
            <div className="p-4 space-y-4">
              <h2 className="font-serif font-bold text-xl text-gray-900">Digital Menu</h2>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    selectedCategory === 'all' ? 'bg-[#006A4E] text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                      selectedCategory === c.id ? 'bg-[#006A4E] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {menuItems
                  .filter((i) => selectedCategory === 'all' || i.categoryId === selectedCategory)
                  .map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3 border border-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                        }}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{item.shortDescription}</p>
                        <p className="text-xs font-bold text-[#006A4E] font-mono mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESERVATIONS (Matching Image 2 Reference Workflow) */}
          {activeTab === 'booking' && (
            <div className="bg-white min-h-full">
              {/* Image 2 Cover Header */}
              <div className="relative h-40 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
                  alt="Blackstarz Coffee Header"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h2 className="font-serif font-bold text-xl">Blackstarz / CaféVerse</h2>
                </div>
              </div>

              {/* Image 2 Top Step Summary Bar */}
              {bookingStep < 4 && (
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-around text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#006A4E]" />
                    <span>{formattedDateSummary}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#006A4E]" />
                    <span>{bookingTime}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-[#006A4E]" />
                    <span>{adults + childrenCount}</span>
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="p-4 space-y-4">
                
                {/* STEP 1: Date & Time */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-center text-base text-gray-900">Book a table</h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setBookingTime(slot.time)}
                            className={`py-2 rounded-xl text-xs font-bold ${
                              bookingTime === slot.time
                                ? 'bg-[#006A4E] text-white shadow'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* STEP 2: Guest Counters (Image 2 Screen 2) */}
                {bookingStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setBookingStep(1)} className="p-1">
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <h3 className="font-bold text-base text-gray-900">Book a table</h3>
                    </div>

                    {/* Adults Counter (Image 2) */}
                    <div className="text-center space-y-2 py-2">
                      <span className="text-xs text-gray-600 font-semibold">Adults</span>
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#006A4E] text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 w-8">{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#006A4E] text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children Counter (Image 2) */}
                    <div className="text-center space-y-2 py-2">
                      <span className="text-xs text-gray-600 font-semibold">Children</span>
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#006A4E] text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900 w-8">{childrenCount}</span>
                        <button
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#006A4E] text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingStep(3)}
                      className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* STEP 3: Your Information (Image 2 Screen 3) */}
                {bookingStep === 3 && (
                  <form onSubmit={handleConfirmMobileBooking} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setBookingStep(2)} className="p-1">
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <h3 className="font-bold text-base text-gray-900">Your information</h3>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Phone number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="m-remind"
                        checked={sendReminder}
                        onChange={(e) => setSendReminder(e.target.checked)}
                      />
                      <label htmlFor="m-remind" className="text-xs text-gray-700">Send me reminder</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-bold text-xs uppercase tracking-wider mt-2"
                    >
                      Confirm your booking
                    </button>
                  </form>
                )}

                {/* STEP 4: Mobile Booking Confirmed */}
                {bookingStep === 4 && confirmedBooking && (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle className="w-12 h-12 text-[#006A4E] mx-auto" />
                    <h3 className="font-serif font-bold text-xl text-gray-900">Booking Confirmed!</h3>
                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
                      <span className="font-mono font-bold text-[#006A4E] text-sm">REF: {confirmedBooking.referenceCode}</span>
                    </div>
                    <button
                      onClick={() => setBookingStep(1)}
                      className="w-full py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                    >
                      Done
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 4: ADMIN MOBILE VIEW */}
          {activeTab === 'admin' && (
            <div className="p-4 space-y-4">
              <h2 className="font-serif font-bold text-lg text-gray-900">Admin Approval Panel</h2>
              <div className="space-y-3">
                {adminReservations.map((res) => (
                  <div key={res.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-[#006A4E]">{res.referenceCode}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">{res.status}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{res.customerName}</p>
                    <p className="text-[10px] text-gray-500">{res.date} at {res.time} • {res.partySize} Guests</p>
                    
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateStatusMobile(res.id, 'confirmed')}
                        className="flex-1 py-1 rounded bg-green-600 text-white text-[10px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatusMobile(res.id, 'rejected')}
                        className="flex-1 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#006A4E]' : 'text-gray-400'}`}
          >
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'menu' ? 'text-[#006A4E]' : 'text-gray-400'}`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('booking');
              setBookingStep(1);
            }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'booking' ? 'text-[#006A4E]' : 'text-gray-400'}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#006A4E] text-white flex items-center justify-center -mt-4 shadow-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-[#006A4E]">Book</span>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-[#006A4E]' : 'text-gray-400'}`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Admin</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
