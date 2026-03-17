import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, Users, ShoppingBag, LayoutDashboard, Ticket, MessageSquare, LogOut, Menu } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} /> },
    { name: 'Customers', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={18} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Ticket size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Reusing the global Navbar but in standard mode without the shop links for admin if preferred. 
          For now, just using standard layout but letting the global navbar sit on top and pushing content down */}
      <div className="admin-layout flex min-h-screen pt-12 md:pt-[72px]">
        
        <aside className={`admin-sidebar fixed top-[72px] left-0 h-[calc(100vh-72px)] w-[260px] bg-bg-secondary border-r border-white/5 py-6 overflow-y-auto z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'max-md:-translate-x-full'}`}>
          <div className="admin-sidebar-header px-5 pb-5 border-b border-white/5 mb-4">
            <h4 className="text-red-primary text-xs uppercase tracking-[2px] font-accent">Admin Panel</h4>
          </div>
          <nav className="flex flex-col">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`sidebar-link flex items-center gap-3 px-5 py-3 text-sm font-accent transition-colors relative ${isActive ? 'active text-red-primary bg-red-primary/10' : 'text-text-secondary hover:text-white hover:bg-red-primary/5'}`}
                >
                  {isActive && <div className="absolute left-0 top-0 w-[3px] h-full bg-red-primary"></div>}
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
            
            <button 
              onClick={handleLogout}
              className="mt-4 sidebar-link flex w-full text-left items-center gap-3 px-5 py-3 text-sm font-accent transition-colors relative text-text-secondary hover:text-red-primary hover:bg-red-primary/5"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[90] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="admin-main flex-1 p-4 md:p-8 md:ml-[260px] transition-all w-full">
          <div className="admin-header flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                className="btn btn-icon btn-secondary md:hidden flex items-center justify-center p-2 rounded-md border border-white/20" 
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-heading tracking-widest text-white">Dashboard</h1>
                <p className="text-text-muted text-sm mt-1">Welcome back, {user?.firstName || 'Admin'}. Here's what's happening.</p>
              </div>
            </div>
          </div>
          
          <Outlet />
        </main>
      </div>
    </>
  );
}
