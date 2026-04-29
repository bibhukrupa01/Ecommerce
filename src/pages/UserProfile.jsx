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

  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEditForm({ firstName: user.firstName, lastName: user.lastName });

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('dripyard_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch user orders
        const ordersRes = await fetch('http://localhost:5000/api/orders/my-orders', { headers });
        let ordersData = [];
        if (ordersRes.ok) {
          ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        const spent = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats({
          ordersCount: ordersData.length,
          wishlistCount: 0, // Implement wishlist later
          reviewsCount: 0, // Implement reviews later
          totalSpent: spent
        });
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const token = localStorage.getItem('dripyard_token');
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      
      // Update local storage and context manually if possible or reload
      const currentUserStr = localStorage.getItem('dripyard_current_user');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUser.firstName = editForm.firstName;
        currentUser.lastName = editForm.lastName;
        localStorage.setItem('dripyard_current_user', JSON.stringify(currentUser));
      }
      setIsEditing(false);
      window.location.reload(); // Quick way to sync AuthContext
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="container pt-8 pb-16 max-w-[900px] mx-auto min-h-[70vh]">
      <div className="glass p-8 rounded-2xl flex flex-col items-center mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-primary/20 to-transparent"></div>
        
        <div className="w-24 h-24 rounded-full bg-red-primary/20 border-2 border-red-primary text-red-primary flex items-center justify-center text-4xl font-bold mb-4 z-10">
          {user.firstName?.charAt(0).toUpperCase()}
        </div>
        
        <h2 className="text-3xl font-accent text-white mb-1 z-10">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-text-secondary mb-2 z-10">{user.email}</p>
        
        <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm mt-2 z-10 relative">Edit Profile</button>
        
        {user.role === 'admin' && (
          <span className="badge badge-red px-3 py-1 bg-red-primary/20 text-red-primary border border-red-primary/30 rounded-full text-xs font-bold mt-4 z-10">
            ADMIN
          </span>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
          <div className="glass p-8 w-full max-w-[400px] rounded-lg">
            <h3 className="text-xl font-accent text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="First Name" 
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white" 
                value={editForm.firstName} 
                onChange={e => setEditForm({...editForm, firstName: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white" 
                value={editForm.lastName} 
                onChange={e => setEditForm({...editForm, lastName: e.target.value})} 
                required 
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1" disabled={updateLoading}>Save</button>
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      <div className="mb-8 glass p-6 rounded-lg">
        <h3 className="text-xl font-accent text-white mb-4">Order History</h3>
        {orders.length === 0 ? (
          <p className="text-text-muted">You haven't placed any orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-text-muted">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white text-sm">{order.id.slice(0,8)}...</td>
                    <td className="py-3 px-4 text-text-secondary text-sm">
                      {order.createdAt ? new Date(order.createdAt._seconds ? order.createdAt._seconds * 1000 : order.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white uppercase">{order.status}</span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">${order.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.role === 'admin' && (
          <Link to="/admin" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-red-primary/5 transition-colors group border border-red-primary/20">
            <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">⚡</div>
            <div>
              <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Admin Dashboard</h4>
              <p className="text-xs text-text-muted">Manage the store</p>
            </div>
          </Link>
        )}
        
        <Link to="/wishlist" className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">❤️</div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Wishlist</h4>
            <p className="text-xs text-text-muted">Your saved items</p>
          </div>
        </Link>
        
        <a href="#" onClick={handleLogout} className="glass-card p-6 rounded-lg flex items-center gap-4 hover:bg-red-primary/10 transition-colors group border border-transparent hover:border-red-primary/30">
          <div className="w-12 h-12 rounded-xl bg-red-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">🚪</div>
          <div>
            <h4 className="text-white font-medium mb-1 group-hover:text-red-primary transition-colors">Logout</h4>
            <p className="text-xs text-text-muted">Sign out securely</p>
          </div>
        </a>
      </div>
    </div>
  );
}
