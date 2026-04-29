import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Create order via backend
    const orderPayload = {
      userId: user.id,
      items: cart.map(item => ({ id: item.id, qty: item.qty })),
      total: cartTotal,
      shippingAddress: address,
      status: 'processing'
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      // Simulate payment success
      setPaymentStatus('success');
      clearCart();
      // Redirect to order confirmation page (placeholder)
      navigate(`/order-confirmation/${data.id}`);
    } catch (err) {
      console.error(err);
      setPaymentStatus('error');
    }
  };

  const renderShippingForm = () => (
    <div className="glass p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-accent text-white mb-4">Shipping Address</h2>
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <input type="text" name="name" placeholder="Full Name" value={address.name} onChange={handleAddressChange} required className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
        <input type="text" name="line1" placeholder="Address Line 1" value={address.line1} onChange={handleAddressChange} required className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
        <input type="text" name="line2" placeholder="Address Line 2" value={address.line2} onChange={handleAddressChange} className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
          <input type="text" name="state" placeholder="State" value={address.state} onChange={handleAddressChange} required className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
        </div>
        <input type="text" name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleAddressChange} required className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" />
        <button type="submit" className="btn btn-primary mt-4">Continue to Summary</button>
      </form>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="glass p-6 rounded-lg max-w-xl mx-auto">
      <h2 className="text-xl font-accent text-white mb-4">Order Summary</h2>
      <ul className="mb-4">
        {cart.map(item => (
          <li key={item.id} className="flex justify-between text-text-muted">
            <span>{item.name} × {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-white font-bold mb-4">
        <span>Total:</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <button className="btn btn-primary" onClick={() => setStep(3)}>Proceed to Payment</button>
      <button className="btn btn-secondary ml-2" onClick={() => setStep(1)}>Edit Address</button>
    </div>
  );

  const renderPayment = () => (
    <div className="glass p-6 rounded-lg max-w-md mx-auto text-center">
      <h2 className="text-xl font-accent text-white mb-4">Payment</h2>
      {paymentStatus === 'error' && <p className="text-red-primary">Payment failed. Please try again.</p>}
      <button className="btn btn-primary" onClick={handlePlaceOrder}>Pay ${cartTotal.toFixed(2)}</button>
    </div>
  );

  return (
    <div className="container mx-auto py-12 min-h-[70vh]">
      {step === 1 && renderShippingForm()}
      {step === 2 && renderOrderSummary()}
      {step === 3 && renderPayment()}
    </div>
  );
}
