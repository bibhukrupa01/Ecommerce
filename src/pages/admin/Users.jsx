import { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Read from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('dripyard_orders') || '[]');
    
    setUsers(storedUsers);
    setOrders(storedOrders);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-users">
      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-accent text-white">Registered Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">User</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Email</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Role</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Joined</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Orders</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const userOrders = orders.filter(o => o.userId === u.id && o.status !== 'cancelled');
                const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
                const initial = u.firstName ? u.firstName.charAt(0).toUpperCase() : '?';

                return (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-primary/15 flex items-center justify-center font-bold text-red-primary text-xs shrink-0">
                          {initial}
                        </div>
                        <strong className="text-white whitespace-nowrap">{u.firstName} {u.lastName}</strong>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{u.email}</td>
                    <td className="py-4 px-4 text-sm">
                      {u.role === 'admin' ? (
                        <span className="badge badge-red text-xs px-2 py-1 rounded bg-red-primary/20 text-red-primary border border-red-primary/30">
                          Admin
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{formatDate(u.joined)}</td>
                    <td className="py-4 px-4 text-sm text-white">{userOrders.length}</td>
                    <td className="py-4 px-4 text-sm text-white text-right">${totalSpent.toFixed(2)}</td>
                  </tr>
                );
              })}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-text-muted border-b border-white/5">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-xs text-text-muted">
          {users.length} users total
        </div>
      </div>
    </div>
  );
}
