import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    setIsInitialized(false); // Prevent syncs during data fetch
    
    if (isLoggedIn) {
      const token = localStorage.getItem('dripyard_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      Promise.all([
        fetch('http://localhost:5000/api/users/cart', { headers }).then(res => res.json()),
        fetch('http://localhost:5000/api/users/wishlist', { headers }).then(res => res.json())
      ]).then(([cartData, wishlistData]) => {
        if (cartData.cart) setCart(cartData.cart);
        if (wishlistData.wishlist) setWishlist(wishlistData.wishlist);
        setIsInitialized(true);
      }).catch(err => {
        console.error('Failed to load data from backend:', err);
        setIsInitialized(true);
      });
    } else {
      const savedCart = localStorage.getItem('dripyard_cart');
      const savedWishlist = localStorage.getItem('dripyard_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      setIsInitialized(true);
    }
  }, [isLoggedIn, authLoading]);

  // Sync cart to backend when logged in, otherwise to localStorage
  useEffect(() => {
    if (!isInitialized) return; // Prevent overwriting backend with uninitialized data
    
    if (isLoggedIn) {
      const token = localStorage.getItem('dripyard_token');
      fetch('http://localhost:5000/api/users/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ cart })
      }).catch(err => console.error('Failed to sync cart:', err));
    } else {
      localStorage.setItem('dripyard_cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return; // Prevent overwriting backend with uninitialized data
    
    if (isLoggedIn) {
      const token = localStorage.getItem('dripyard_token');
      fetch('http://localhost:5000/api/users/wishlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wishlist })
      }).catch(err => console.error('Failed to sync wishlist:', err));
    } else {
      localStorage.setItem('dripyard_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoggedIn, isInitialized]);

  const addToCart = (product) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart!');
      return;
    }
    
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      toast.error(`${product.name || 'Item'} is already in the cart`);
      return;
    }

    toast.success(`${product.name || 'Item'} added to cart`);
    setCart(prev => [...prev, { ...product, qty: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Apply a coupon via backend API
  const applyCouponCode = async (code, orderTotal) => {
    const token = localStorage.getItem('dripyard_token');
    const res = await fetch('http://localhost:5000/api/coupons/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code, orderTotal })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Invalid coupon');
    }
    const data = await res.json();
    setAppliedCoupon(data.coupon);
    setDiscountAmount(data.discount);
    return data;
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const toggleWishlist = (product) => {
    if (!isLoggedIn) {
      alert('Please log in to use your wishlist!');
      return;
    }
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.filter(i => i.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => !!wishlist.find(i => i.id === productId);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, wishlist, addToCart, removeFromCart, updateCartQty, clearCart,
      toggleWishlist, isInWishlist, cartTotal, cartCount,
      appliedCoupon, discountAmount, applyCouponCode, clearCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};
