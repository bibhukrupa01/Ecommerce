import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
    const token = localStorage.getItem('dripyard_token');
    const orderPayload = {
      userId: user.id,
      items: cart.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        qty: item.qty 
      })),
      total: cartTotal,
      shippingAddress: address,
      status: 'processing'
    };
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      // Simulate payment success
      setPaymentStatus('success');
      clearCart();
      // Redirect to profile to see order history after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
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
      {paymentStatus === 'success' ? (
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <p className="text-lg font-bold">Payment Successful!</p>
          <p className="text-sm text-white mt-2">Redirecting to your profile...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-black/20 p-4 rounded-md border border-white/10 text-left">
            <p className="text-sm text-text-muted mb-2">Simulated Credit Card</p>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" readOnly className="bg-black/30 w-full border border-white/10 rounded-md p-2 text-white outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/YY" defaultValue="12/26" readOnly className="bg-black/30 border border-white/10 rounded-md p-2 text-white outline-none" />
              <input type="text" placeholder="CVC" defaultValue="123" readOnly className="bg-black/30 border border-white/10 rounded-md p-2 text-white outline-none" />
            </div>
          </div>
          {paymentStatus === 'error' && <p className="text-red-primary mb-4">Payment failed. Please try again.</p>}
          <button className="btn btn-primary w-full" onClick={handlePlaceOrder}>Pay ${cartTotal.toFixed(2)}</button>
          <button className="btn btn-secondary w-full mt-2" onClick={() => setStep(2)}>Back</button>
        </>
      )}
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
