import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    reviewsCount: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get stats from localStorage to match the legacy logic
    const orders = JSON.parse(localStorage.getItem('dripyard_orders') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('dripyard_wishlist') || '[]');
    const reviews = JSON.parse(localStorage.getItem('dripyard_reviews') || '[]');

    const userOrders = orders.filter(o => o.userId === user.id);
    const userReviews = reviews.filter(r => r.userId === user.id);
    const spent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    setStats({
      ordersCount: userOrders.length,
      wishlistCount: wishlist.length,
      reviewsCount: userReviews.length,
      totalSpent: spent
    });
  }, [user, navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return null; // Will redirect in useEffect

  return (
    <div className="container pt-8 pb-16 max-w-[900px] mx-auto min-h-[70vh]">
      <div className="glass p-8 rounded-2xl flex flex-col items-center mb-8 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-primary/20 to-transparent"></div>
        
        <div className="w-24 h-24 rounded-full bg-red-primary/20 border-2 border-red-primary text-red-primary flex items-center justify-center text-4xl font-bold mb-4 z-10">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        
        <h2 className="text-3xl font-accent text-white mb-1 z-10">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-text-secondary mb-2 z-10">{user.email}</p>
        
        {user.role === 'admin' && (
          <span className="badge badge-red px-3 py-1 bg-red-primary/20 text-red-primary border border-red-primary/30 rounded-full text-xs font-bold mb-2 z-10">
            ADMIN
          </span>
        )}
        
        <p className="text-sm text-text-muted mt-2 z-10">
          Member since {formatDate(user.joined)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Total Orders</h4>
          <div className="text-3xl text-white font-heading">{stats.ordersCount}</div>
        </div>
        <div className="glass-card p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Wishlist Items</h4>
          <div className="text-3xl text-white font-heading">{stats.wishlistCount}</div>
        </div>
        <div className="glass-card p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Reviews Given</h4>
          <div className="text-3xl text-white font-heading">{stats.reviewsCount}</div>
        </div>
        <div className="glass-card p-5 rounded-lg text-center hover:-translate-y-1 transition-transform border-b-2 border-gold/50">
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Total Spent</h4>
          <div className="text-3xl text-gold font-heading">${stats.totalSpent.toFixed(0)}</div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {user.role === 'admin' && (
          <Link to="/admin" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-red-primary/5 transition-colors group border border-red-primary/20">
            <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div>
              <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Admin Dashboard</h4>
              <p className="text-xs text-text-muted">Manage the store</p>
            </div>
          </Link>
        )}
        
        {/* These links currently route to placeholders or not-yet-migrated pages. 
            Update the 'to' paths as those pages get migrated. */}
        <Link to="/profile/orders" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            📦
          </div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">My Orders</h4>
            <p className="text-xs text-text-muted">Track and manage orders</p>
          </div>
        </Link>
        
        <Link to="/wishlist" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            ❤️
          </div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Wishlist</h4>
            <p className="text-xs text-text-muted">Your saved items</p>
          </div>
        </Link>
        
        <Link to="/profile/reviews" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            ⭐
          </div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Write a Review</h4>
            <p className="text-xs text-text-muted">Share your feedback</p>
          </div>
        </Link>
        
        <a href="#" onClick={handleLogout} className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-red-primary/10 transition-colors group border border-transparent hover:border-red-primary/30">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            🚪
          </div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Logout</h4>
            <p className="text-xs text-text-muted">Sign out securely</p>
          </div>
        </a>
      </div>
    </div>
  );
}
