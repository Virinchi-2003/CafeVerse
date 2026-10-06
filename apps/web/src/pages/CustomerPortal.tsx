import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadReservations = () => {
    setIsLoading(true);
    api.getMyReservations()
      .then(res => setReservations(res.reservations || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadReservations();
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.cancelReservation(id);
      loadReservations();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div className="py-12 px-4 bg-espresso-950 text-ivory min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">Customer Account</span>
          <h1 className="font-serif text-3xl font-bold text-ivory">My Bookings</h1>
          <p className="text-xs text-ivory/60">Welcome back, {user?.name}. Manage your café table reservations below.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-ivory/50 text-sm">Loading your bookings...</div>
        ) : reservations.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-4 border border-caramel-500/20">
            <Calendar className="w-12 h-12 text-caramel-500/40 mx-auto" />
            <p className="text-sm text-ivory/70">You don't have any table reservations yet.</p>
            <button
              onClick={() => navigate('/reservations')}
              className="px-6 py-2.5 rounded-full bg-caramel-500 text-espresso-950 font-bold text-xs uppercase tracking-wider"
            >
              Book a Table Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="glass-card p-6 rounded-3xl border border-caramel-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-caramel-400">REF: {res.referenceCode}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      res.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : res.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-ivory/80">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-caramel-400" />
                      <span>{res.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-caramel-400" />
                      <span>{res.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-caramel-400" />
                      <span>{res.partySize} Guests</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-ivory/50">Seating: {res.seatingPreference}</p>
                </div>

                {res.status !== 'cancelled' && res.status !== 'rejected' && (
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-medium text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
