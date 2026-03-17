import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, Heart } from 'lucide-react';

export default function Navbar({ minimal }) {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const [mobileActive, setMobileActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileActive(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileActive(!mobileActive);
    document.body.style.overflow = !mobileActive ? 'hidden' : '';
  };

  const initial = user ? user.firstName.charAt(0) : 'U';

  return (
    <header className="fixed w-full z-50">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">DRIP <span>YARD</span></Link>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/category">Shop</Link>
            <Link to="/category?cat=new" className="text-gold">Drips</Link>
            {isLoggedIn && (
              <>
                <Link to="/my-orders">Orders</Link>
                <Link to="/customer-reviews">Reviews</Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            <div className="nav-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            
            {isLoggedIn && (
              <Link to="/wishlist" className="btn-icon text-text-secondary hover:text-red-primary transition-colors" title="Wishlist">
                <Heart size={20} />
              </Link>
            )}
            
            {isLoggedIn ? (
              <Link to="/profile" className="nav-user-btn" title="Profile">{initial}</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm text-text-secondary">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}

            <button className={`burger-menu md:hidden flex ${mobileActive ? 'active' : ''}`} onClick={toggleMobileMenu} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileActive ? 'active' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/category">Shop</Link>
        <Link to="/category?cat=new" className="text-gold">Drips</Link>
        <Link to="/cart">Cart {cartCount > 0 && `(${cartCount})`}</Link>
        {isLoggedIn ? (
          <>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={() => { logout(); setMobileActive(false); }} className="text-red-primary font-heading text-2xl tracking-[4px] uppercase mt-4 hover:translate-x-[10px] transition-transform">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-red-primary">Login</Link>
            <Link to="/signup" className="text-gold">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
