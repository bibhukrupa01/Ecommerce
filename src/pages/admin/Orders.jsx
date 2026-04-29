import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch orders from backend (admin)
    fetch('/api/orders', { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Expect data to be array of orders
        const sorted = data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setOrders(sorted);
      })
      .catch(err => console.error('Failed to load orders:', err));
    // Fetch users for order display
    fetch('/api/users', { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(usersData => setUsers(usersData))
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('dripyard_orders', JSON.stringify(updatedOrders));
    
    // Minimal toast mimicking the old 'showToast'
    // Ideally use a real toast library here in the future
    alert(`Order #${orderId} status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'cancelled': return 'text-red-primary';
      default: return 'text-white';
    }
  };

  return (
    <div className="admin-orders">
      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-accent text-white">All Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Order ID</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Customer</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Items</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Total</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Payment</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Status</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Date</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const user = users.find(u => u.id === order.userId);
                const itemCount = order.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
                
                return (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-gold">#{order.id}</td>
                    <td className="py-4 px-4 text-sm text-white">
                      {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{itemCount}</td>
                    <td className="py-4 px-4 text-sm text-white">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm capitalize text-text-secondary">{order.payment}</td>
                    <td className="py-4 px-4 text-sm">
                      <select 
                        className={`bg-black/30 border border-white/10 rounded px-2 py-1 outline-none focus:border-red-primary text-xs ${getStatusColor(order.status)}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="processing" className="text-white">Processing</option>
                        <option value="shipped" className="text-white">Shipped</option>
                        <option value="delivered" className="text-white">Delivered</option>
                        <option value="cancelled" className="text-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-sm">
                      {/* The route for order-details isn't fully migrated yet, placeholder link */}
                      <Link to={`/admin/orders/${order.id}`} className="text-red-primary hover:underline">View</Link>
                    </td>
                  </tr>
                );
              })}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-text-muted border-b border-white/5">
                    <p className="text-3xl mb-2">📦</p>
                    <p>No orders have been placed yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-xs text-text-muted">
          {orders.length} orders total
        </div>
      </div>
    </div>
  );
}
