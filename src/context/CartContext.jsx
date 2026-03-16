import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('dripyard_cart');
    const savedWishlist = localStorage.getItem('dripyard_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Sync to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dripyard_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dripyard_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart!');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
  };

  const clearCart = () => setCart([]);

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
      toggleWishlist, isInWishlist, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
