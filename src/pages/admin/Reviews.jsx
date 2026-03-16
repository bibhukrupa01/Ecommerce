import { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';

export default function Reviews() {
  const { products } = useProduct();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Sync with legacy localStorage structure
    const storedReviews = JSON.parse(localStorage.getItem('dripyard_reviews') || '[]');
    setReviews(storedReviews);
  }, []);

  const pending = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');
  const rejected = reviews.filter(r => r.status === 'rejected');

  const updateReviewStatus = (id, status) => {
    const updated = reviews.map(r => {
      if (r.id === id) return { ...r, status };
      return r;
    });
    setReviews(updated);
    localStorage.setItem('dripyard_reviews', JSON.stringify(updated));
    // Toast simulation
    alert(`Review marked as ${status}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ReviewCard = ({ review, showActions }) => {
    const product = products.find(p => p.id === review.productId);
    
    return (
      <div className="glass-card p-5 mb-4 rounded-lg bg-black/10 border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-primary/15 flex items-center justify-center font-bold text-red-primary text-sm shrink-0">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <strong className="text-sm text-white block">{review.userName}</strong>
            <p className="text-xs text-text-muted mt-0.5">
              {formatDate(review.date)} &middot; {product ? product.name : 'Unknown Product'}
            </p>
          </div>
          <div className="text-gold text-lg tracking-widest flex">
            {'★'.repeat(review.rating)}
            <span className="opacity-30">{'★'.repeat(5 - review.rating)}</span>
          </div>
        </div>
        
        <p className={`text-sm text-text-secondary ${showActions ? 'mb-4' : 'mb-0'}`}>
          {review.text}
        </p>
        
        {showActions && (
          <div className="flex gap-2">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded transition-colors"
              onClick={() => updateReviewStatus(review.id, 'approved')}
            >
              Approve
            </button>
            <button 
              className="bg-red-primary hover:bg-red-dark text-white text-xs px-3 py-1.5 rounded transition-colors"
              onClick={() => updateReviewStatus(review.id, 'rejected')}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-reviews">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-lg border-l-2 border-gold/50">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Pending</h4>
          <div className="text-3xl text-gold font-heading">{pending.length}</div>
        </div>
        <div className="glass-card p-5 rounded-lg border-l-2 border-green-500/50">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Approved</h4>
          <div className="text-3xl text-green-500 font-heading">{approved.length}</div>
        </div>
        <div className="glass-card p-5 rounded-lg border-l-2 border-red-primary/50">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Rejected</h4>
          <div className="text-3xl text-red-primary font-heading">{rejected.length}</div>
        </div>
        <div className="glass-card p-5 rounded-lg border-l-2 border-white/20">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Total</h4>
          <div className="text-3xl text-white font-heading">{reviews.length}</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="glass p-6 rounded-lg mb-6">
          <h4 className="mb-5 text-lg font-accent text-gold flex items-center gap-2">
            <span>⏳</span> Pending Reviews ({pending.length})
          </h4>
          <div className="flex flex-col">
            {pending.map(r => (
              <ReviewCard key={r.id} review={r} showActions={true} />
            ))}
          </div>
        </div>
      )}

      <div className="glass p-6 rounded-lg">
        <h4 className="mb-5 text-lg font-accent text-white flex items-center gap-2">
          <span className="text-green-500">✅</span> Approved Reviews ({approved.length})
        </h4>
        
        {approved.length > 0 ? (
          <div className="flex flex-col">
            {approved.map(r => (
              <ReviewCard key={r.id} review={r} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm py-4 border-t border-white/10">
            No approved reviews to show.
          </p>
        )}
      </div>
    </div>
  );
}
