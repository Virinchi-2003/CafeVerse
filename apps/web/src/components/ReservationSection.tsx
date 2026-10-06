import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Floating25DBackground } from './Background25D';

export const ReservationSection: React.FC = () => {
  const { user } = useAuth();
  
  // Wizard State (1: Date & Time, 2: Guests, 3: Contact Info, 4: Confirmed)
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('12:30');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [seatingPref, setSeatingPref] = useState<string>('Standard Table');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  
  // Contact Info
  const [firstName, setFirstName] = useState<string>(user ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState<string>(user && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '');
  const [email, setEmail] = useState<string>(user ? user.email : '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [sendReminder, setSendReminder] = useState<boolean>(true);

  // Backend Availability State
  const [availableSlots, setAvailableSlots] = useState<{ time: string; remainingCapacity: number; isAvailable: boolean }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingSlots(true);
    setErrorMessage(null);

    api.getAvailability(selectedDate)
      .then((res) => {
        if (!isMounted) return;
        setAvailableSlots(res.slots || []);
        if (res.slots && res.slots.length > 0) {
          const firstAvail = res.slots.find((s) => s.isAvailable);
          if (firstAvail && !res.slots.some(s => s.time === selectedTime && s.isAvailable)) {
            setSelectedTime(firstAvail.time);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Failed to check availability');
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Handle Submit Booking
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !email || !phone) {
      setErrorMessage('Please fill out all contact fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.createReservation({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        date: selectedDate,
        time: selectedTime,
        adults,
        children: childrenCount,
        seatingPreference: seatingPref,
        specialRequests,
        sendReminder,
      });

      setConfirmedBooking(res.reservation);
      setStep(4); // Confirmed screen
    } catch (err: any) {
      setErrorMessage(err.message || 'Reservation booking failed. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDateSummary = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <section className="py-16 px-4 bg-espresso-950 text-ivory relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* 2.5D Background Layer */}
      <Floating25DBackground enableMouseParallax={true} />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-caramel-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-xl w-full mx-auto relative z-10">
        
        {/* Card Frame Inspired by Image 2 */}
        <div className="glass-card rounded-3xl border border-caramel-500/30 overflow-hidden shadow-25d">
          
          {/* Header Image Inspired by Image 2 */}
          <div className="relative h-44 sm:h-52 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop"
              alt="Café Atmosphere"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">Table Reservations</span>
              <h2 className="font-serif text-3xl font-bold text-ivory">CaféVerse</h2>
            </div>
          </div>

          {/* Top Step Summary Pill Bar (Inspired by Image 2) */}
          {step < 4 && (
            <div className="bg-espresso-900/90 border-b border-caramel-500/20 px-4 py-3 flex items-center justify-around text-xs font-medium text-ivory/90">
              <div className="flex items-center gap-1.5 text-caramel-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{formattedDateSummary}</span>
              </div>
              <div className="h-4 w-px bg-caramel-500/20" />
              <div className="flex items-center gap-1.5 text-caramel-400">
                <Clock className="w-4 h-4" />
                <span>{selectedTime}</span>
              </div>
              <div className="h-4 w-px bg-caramel-500/20" />
              <div className="flex items-center gap-1.5 text-caramel-400">
                <Users className="w-4 h-4" />
                <span>{adults + childrenCount} Guests</span>
              </div>
            </div>
          )}

          {/* Form Wizard Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: Date & Time Picker */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="font-serif text-2xl font-bold text-ivory">Book a table</h3>
                    <p className="text-xs text-ivory/60">Select your preferred date and available time slot</p>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-caramel-400 tracking-wider">Select Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                    />
                  </div>

                  {/* Available Time Slots Grid */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-caramel-400 tracking-wider">Available Times</label>
                    
                    {isLoadingSlots ? (
                      <div className="py-8 text-center text-xs text-ivory/60">Checking live slot availability...</div>
                    ) : availableSlots.length === 0 ? (
                      <div className="py-6 text-center text-xs text-caramel-400">No available slots for this date.</div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                              selectedTime === slot.time
                                ? 'bg-caramel-500 text-espresso-950 shadow-md font-bold'
                                : slot.isAvailable
                                ? 'bg-espresso-900 text-ivory/90 hover:bg-espresso-800 border border-caramel-500/20'
                                : 'bg-espresso-900/40 text-ivory/30 line-through cursor-not-allowed border border-transparent'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-lg"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Guest Counter (Inspired by Image 2) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="p-1.5 rounded-lg text-ivory/70 hover:bg-espresso-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-serif text-2xl font-bold text-ivory">Book a table</h3>
                  </div>

                  {/* Adults Counter */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-espresso-900/80 border border-caramel-500/20">
                    <div>
                      <p className="font-semibold text-ivory text-sm">Adults</p>
                      <p className="text-xs text-ivory/50">Ages 13 and above</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-9 h-9 rounded-full bg-caramel-500/10 border border-caramel-500/30 flex items-center justify-center text-caramel-400 hover:bg-caramel-500/20"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-xl font-bold text-ivory w-6 text-center">{adults}</span>
                      <button
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-9 h-9 rounded-full bg-caramel-500/10 border border-caramel-500/30 flex items-center justify-center text-caramel-400 hover:bg-caramel-500/20"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-espresso-900/80 border border-caramel-500/20">
                    <div>
                      <p className="font-semibold text-ivory text-sm">Children</p>
                      <p className="text-xs text-ivory/50">Ages 0 to 12</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-9 h-9 rounded-full bg-caramel-500/10 border border-caramel-500/30 flex items-center justify-center text-caramel-400 hover:bg-caramel-500/20"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-xl font-bold text-ivory w-6 text-center">{childrenCount}</span>
                      <button
                        onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                        className="w-9 h-9 rounded-full bg-caramel-500/10 border border-caramel-500/30 flex items-center justify-center text-caramel-400 hover:bg-caramel-500/20"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Seating Preference */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-caramel-400 tracking-wider">Seating Area</label>
                    <select
                      value={seatingPref}
                      onChange={(e) => setSeatingPref(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                    >
                      <option value="Standard Table">Standard Dining Table</option>
                      <option value="Window Booth">Window Booth</option>
                      <option value="Garden Terrace">Garden Terrace</option>
                      <option value="Quiet Corner">Quiet Corner</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-lg"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Contact Form (Inspired by Image 2) */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="p-1.5 rounded-lg text-ivory/70 hover:bg-espresso-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-serif text-2xl font-bold text-ivory">Your information</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-ivory/60 mb-1">Email address</label>
                      <input
                        type="email"
                        required
                        placeholder="hello@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-ivory/60 mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Elena"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-ivory/60 mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Rostova"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-ivory/60 mb-1">Phone number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="reminder"
                        checked={sendReminder}
                        onChange={(e) => setSendReminder(e.target.checked)}
                        className="w-4 h-4 rounded text-caramel-500 focus:ring-0 bg-espresso-900 border-caramel-500/40"
                      />
                      <label htmlFor="reminder" className="text-xs text-ivory/80 cursor-pointer">
                        Send me SMS / Email reminder
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? (
                      <span>Confirming...</span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirm your booking
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 4: Confirmed Success Screen */}
              {step === 4 && confirmedBooking && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-caramel-500/20 text-caramel-400 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-3xl font-bold text-ivory">Booking Confirmed!</h3>
                    <p className="text-xs text-ivory/60">Your table is reserved at CaféVerse</p>
                  </div>

                  {/* Reference Code Badge */}
                  <div className="inline-block px-5 py-2.5 rounded-2xl bg-caramel-500/20 border border-caramel-500/40 text-caramel-400 font-mono text-lg font-bold">
                    REF: {confirmedBooking.referenceCode}
                  </div>

                  <div className="p-4 rounded-2xl bg-espresso-900 border border-caramel-500/20 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-ivory/60">Guest Name:</span>
                      <span className="font-semibold text-ivory">{confirmedBooking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory/60">Date & Time:</span>
                      <span className="font-semibold text-caramel-400">{confirmedBooking.date} at {confirmedBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory/60">Party Size:</span>
                      <span className="font-semibold text-ivory">{confirmedBooking.partySize} Guests ({confirmedBooking.adults} Adults, {confirmedBooking.children} Children)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory/60">Seating:</span>
                      <span className="font-semibold text-ivory">{confirmedBooking.seatingPreference}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 rounded-xl border border-caramel-500/40 text-caramel-400 font-bold text-sm hover:bg-espresso-800 transition-colors"
                  >
                    Make Another Reservation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
};
