import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer bg-bg-secondary w-full py-16 border-t border-white/5 mt-auto">
      <div className="container mx-auto px-6 max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-brand">
            <h3 className="font-heading text-3xl mb-4 tracking-widest">DRIP <span className="text-red-primary">YARD</span></h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">Premium streetwear inspired by the boldness of Money Heist. Every piece tells a story of rebellion, style, and unmatched quality.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-accent font-semibold mb-2">Shop</h4>
            <Link to="/category" className="text-text-secondary hover:text-red-primary text-sm transition-colors">All Products</Link>
            <Link to="/category?cat=hoodies" className="text-text-secondary hover:text-red-primary text-sm transition-colors">Hoodies</Link>
            <Link to="/category?cat=jackets" className="text-text-secondary hover:text-red-primary text-sm transition-colors">Jackets</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-accent font-semibold mb-2">Account</h4>
            <Link to="/user-profile" className="text-text-secondary hover:text-red-primary text-sm transition-colors">My Profile</Link>
            <Link to="/my-orders" className="text-text-secondary hover:text-red-primary text-sm transition-colors">My Orders</Link>
            <Link to="/cart" className="text-text-secondary hover:text-red-primary text-sm transition-colors">Cart</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-accent font-semibold mb-2">Company</h4>
            <Link to="/customer-reviews" className="text-text-secondary hover:text-red-primary text-sm transition-colors">Reviews</Link>
            <Link to="/help-submission" className="text-text-secondary hover:text-red-primary text-sm transition-colors">Contact Support</Link>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 py-6 flex flex-col md:flex-row justify-between text-xs text-text-muted gap-4">
          <p>&copy; 2026 DRIP YARD. All rights reserved.</p>
          <p>Inspired by La Casa de Papel</p>
        </div>
      </div>
    </footer>
  );
}
