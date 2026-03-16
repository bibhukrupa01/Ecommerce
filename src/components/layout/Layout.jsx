import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Layout({ minimal = false }) {
  const { cartCount } = useCart();
  
  return (
    <div className="page-wrapper min-h-screen flex flex-col pt-[72px]">
      <Navbar minimal={minimal} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {!minimal && (
        <Link to="/cart" className="cart-float-btn" title="Cart">
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge flex">{cartCount}</span>}
        </Link>
      )}
    </div>
  );
}
