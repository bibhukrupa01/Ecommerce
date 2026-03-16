import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { isLoggedIn } = useAuth();
  const { cart, updateCartQty, removeFromCart, cartTotal, cartCount } = useCart();

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-accent mb-4 text-white">Please log in first</h2>
        <p className="text-text-secondary mb-8 max-w-md">Log in to your DRIP YARD account to add items to your cart and start shopping.</p>
        <Link to="/login" className="btn btn-primary">Login to Continue</Link>
        <p className="mt-4 text-sm text-text-muted">Don't have an account? <Link to="/signup" className="text-gold">Sign Up</Link></p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-accent mb-4 text-white">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Looks like you haven't added anything yet. Explore our collection!</p>
        <Link to="/category" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="container py-12 pb-24 min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-heading tracking-[2px] mb-10 text-white">
        Your <span className="text-red-primary">Cart</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="glass-card p-5">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a1015] flex items-center justify-center shrink-0 font-heading text-red-primary/20 text-3xl">
                  {item.brand ? item.brand.substring(0,2) : 'DY'}
                </div>
                <div className="flex-1 w-full">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{item.brand || 'DRIP YARD'}</p>
                  <h4 className="text-lg text-white mb-2">{item.name}</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    {item.size && `Size: ${item.size} · `}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  
                  <div className="flex items-center flex-wrap gap-4 sm:gap-6 w-full justify-between sm:justify-start">
                    <div className="glass inline-flex items-center gap-3 px-3 py-1 rounded-md">
                      <button 
                        onClick={() => item.qty <= 1 ? removeFromCart(item.id) : updateCartQty(item.id, item.qty - 1)}
                        className="text-text-secondary hover:text-white px-2 py-1"
                      >−</button>
                      <span className="font-semibold text-white w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, item.qty + 1)}
                        className="text-text-secondary hover:text-white px-2 py-1"
                      >+</button>
                    </div>
                    
                    <span className="font-bold text-xl text-white">${(item.price * item.qty).toFixed(2)}</span>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-sm text-text-muted hover:text-red-primary transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-7 lg:sticky lg:top-24">
          <h3 className="text-xl font-accent mb-6 text-white font-semibold">Order Summary</h3>
          <div className="text-sm text-text-secondary flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Subtotal ({cartCount} items)</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-500" : "text-white"}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-2 my-6">
            <input type="text" className="form-input flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-md focus:border-red-primary outline-none transition-colors text-white" placeholder="Coupon code" />
            <button className="btn btn-secondary btn-sm rounded-md whitespace-nowrap">Apply</button>
          </div>
          
          <div className="border-t border-white/10 pt-4 mt-2">
            <div className="flex justify-between items-end">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-white font-heading text-4xl leading-none">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Link to="/checkout" className="btn btn-primary w-full mt-8 rounded-md py-4 text-lg">Proceed to Checkout</Link>
          <Link to="/category" className="btn btn-ghost w-full mt-3 text-center block">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
