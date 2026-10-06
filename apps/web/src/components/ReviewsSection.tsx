import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, Quote } from 'lucide-react';
import { api } from '../services/api';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = () => {
    api.getReviews()
      .then(res => setReviews(res.reviews || []))
      .catch(err => console.error('Failed to load reviews:', err));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitReview({ customerName: name, rating, title, comment });
      setShowModal(false);
      setName('');
      setTitle('');
      setComment('');
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-espresso-950 text-ivory relative border-t border-caramel-500/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">Testimonials</span>
            <h2 className="font-serif text-4xl font-bold text-ivory">Loved by Coffee Enthusiasts.</h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-full bg-caramel-500/20 border border-caramel-500/40 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" /> Leave a Review
          </button>
        </div>

        {/* Reviews Carousel/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-4 relative"
            >
              <Quote className="w-8 h-8 text-caramel-500/30 absolute top-4 right-4" />
              <div className="flex gap-1 text-caramel-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-caramel-400" />
                ))}
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory">{rev.title}</h3>
              <p className="text-xs text-ivory/70 leading-relaxed italic">"{rev.comment}"</p>
              <div className="pt-2 border-t border-caramel-500/20 flex justify-between items-center text-xs">
                <span className="font-semibold text-caramel-400">{rev.customerName}</span>
                <span className="text-ivory/40">Verified Guest</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl max-w-md w-full border border-caramel-500/40 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-ivory">Leave Your Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm"
                >
                  <option value={5}>5 Stars - Extraordinary</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Artisan Latte"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-ivory/60 mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-caramel-500/30 text-ivory text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-caramel-500 text-espresso-950 font-bold text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
