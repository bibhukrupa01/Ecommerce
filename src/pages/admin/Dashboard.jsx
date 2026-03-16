import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { products } = useProduct();
  // Using localStorage directly for orders and all users since they aren't context yet
  const orders = JSON.parse(localStorage.getItem('dripyard_orders') || '[]');
  const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]').filter(u => u.role === 'user');
  
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length > 0 ? revenue / orders.length : 0;

  // Category stats
  const catCounts = {};
  orders.forEach(o => {
    (o.items || []).forEach(i => {
      const p = products.find(pp => pp.id === i.id);
      if (p) {
        catCounts[p.category] = (catCounts[p.category] || 0) + i.qty;
      }
    });
  });
  const totalItems = Object.values(catCounts).reduce((a, b) => a + b, 1);
  const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const formatCurrency = (amount) => {
    return '$' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const statusBadge = (s) => {
    switch (s) {
      case 'processing': return <span className="text-yellow-500 font-semibold">Processing</span>;
      case 'shipped': return <span className="text-blue-500 font-semibold">Shipped</span>;
      case 'delivered': return <span className="text-green-500 font-semibold">Delivered</span>;
      case 'cancelled': return <span className="text-red-primary font-semibold">Cancelled</span>;
      default: return <span>{s}</span>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-card p-6 relative overflow-hidden rounded-lg group">
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-red-primary/10 transition-transform group-hover:scale-150"></div>
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Revenue</h4>
          <div className="text-4xl text-white font-heading">{formatCurrency(revenue)}</div>
          <p className="text-xs text-green-500 mt-1">↑ From {orders.length} orders</p>
        </div>
        
        <div className="glass-card p-6 relative overflow-hidden rounded-lg group">
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-red-primary/10 transition-transform group-hover:scale-150"></div>
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Orders</h4>
          <div className="text-4xl text-white font-heading">{orders.length}</div>
          <p className="text-xs text-green-500 mt-1">{orders.filter(o => o.status === 'processing').length} processing</p>
        </div>

        <div className="glass-card p-6 relative overflow-hidden rounded-lg group">
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-red-primary/10 transition-transform group-hover:scale-150"></div>
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Customers</h4>
          <div className="text-4xl text-white font-heading">{users.length}</div>
          <p className="text-xs text-green-500 mt-1">Registered users</p>
        </div>

        <div className="glass-card p-6 relative overflow-hidden rounded-lg group">
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-red-primary/10 transition-transform group-hover:scale-150"></div>
          <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2 font-accent">Avg. Order Value</h4>
          <div className="text-4xl text-white font-heading">${avgOrder.toFixed(2)}</div>
          <p className="text-xs text-text-secondary mt-1">{products.length} products total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
        <div className="glass p-6 rounded-lg">
          <h4 className="mb-5 text-lg font-accent text-white">Revenue by Month</h4>
          <div className="flex gap-1 items-end h-[200px] pt-5">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
              const h = 20 + Math.random() * 80;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1 group">
                  <div 
                    className="w-full bg-gradient-to-t from-red-dark to-red-primary rounded-t-sm transition-opacity group-hover:opacity-80" 
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className="text-[10px] text-text-muted">{m}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h4 className="mb-5 text-lg font-accent text-white">Top Categories</h4>
          <div className="flex flex-col gap-4">
            {topCategories.map(([cat, count]) => {
              const pct = Math.round((count / totalItems) * 100);
              const colors = { hoodies: '#c41e3a', jackets: '#d4a853', tshirts: '#e63946', accessories: '#22c55e', pants: '#3b82f6', sets: '#a855f7' };
              const color = colors[cat] || '#c41e3a';
              
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize text-white">{cat}</span>
                    <span className="text-sm text-text-muted">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              );
            })}
            
            {topCategories.length === 0 && (
              <p className="text-sm text-text-muted">No sales data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-accent text-white">Recent Orders</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Order ID</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Customer</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Amount</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Status</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => {
                const u = users.find(u => u.id === o.userId);
                return (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-gold">#{o.id}</td>
                    <td className="py-3 px-4 text-sm text-white">{u ? `${u.firstName} ${u.lastName.charAt(0)}.` : 'Guest'}</td>
                    <td className="py-3 px-4 text-sm text-white">${o.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">{statusBadge(o.status)}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{new Date(o.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text-muted text-sm border-b border-white/5">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
