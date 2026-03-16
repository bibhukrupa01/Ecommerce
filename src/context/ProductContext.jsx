import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

const initialProducts = [
  { id: 1, name: 'Heist Red Hoodie', brand: 'DRIP YARD', price: 89.99, originalPrice: 129.99, image: '', rating: 4.8, reviewCount: 142, category: 'hoodies', badge: 'Best Seller', desc: 'Premium heavyweight hoodie crafted from 100% organic cotton. Features the iconic Dali mask embroidery on the chest, oversized fit, and kangaroo pocket.', colors: ['#c41e3a', '#111', '#f0e6d3'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], isNew: false },
  { id: 2, name: 'Bella Ciao Tee', brand: 'DRIP YARD', price: 49.99, originalPrice: 69.99, image: '', rating: 4.6, reviewCount: 98, category: 'tshirts', badge: 'New', desc: 'Classic crew-neck tee with the legendary Bella Ciao lyrics screenprinted on the back. Soft-touch cotton blend for all-day comfort.', colors: ['#c41e3a', '#111', '#2a3a5c'], sizes: ['S', 'M', 'L', 'XL'], isNew: true },
  { id: 3, name: "Professor's Coat", brand: 'DRIP YARD', price: 199.99, originalPrice: 299.99, image: '', rating: 4.9, reviewCount: 234, category: 'jackets', badge: 'Limited', desc: 'The iconic long coat inspired by The Professor. Tailored silhouette with hidden inner pockets and a luxurious wool-blend fabric.', colors: ['#111', '#2a2015'], sizes: ['S', 'M', 'L', 'XL'], isNew: false },
  { id: 4, name: 'Tokyo Cargo Pants', brand: 'DRIP YARD', price: 79.99, originalPrice: null, image: '', rating: 4.5, reviewCount: 67, category: 'pants', badge: null, desc: 'Tactical-inspired cargo pants with multiple utility pockets. Relaxed fit, tapered leg, and adjustable ankle cuffs for a streetwear edge.', colors: ['#111', '#3a3a2a', '#2a3a5c'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], isNew: false },
  { id: 5, name: 'Denver Cap', brand: 'DRIP YARD', price: 34.99, originalPrice: 44.99, image: '', rating: 4.7, reviewCount: 189, category: 'accessories', badge: 'Hot', desc: 'Structured snapback cap with embroidered DRIP YARD logo. Adjustable strap, curved brim, and breathable cotton construction.', colors: ['#c41e3a', '#111'], sizes: ['One Size'], isNew: false },
  { id: 6, name: 'Nairobi Bomber Jacket', brand: 'DRIP YARD', price: 159.99, originalPrice: 219.99, image: '', rating: 4.8, reviewCount: 112, category: 'jackets', badge: 'Trending', desc: 'Sleek bomber jacket with satin finish. Ribbed collar, cuffs and hem. Two-way zipper and interior pocket. A modern rebel essential.', colors: ['#111', '#2a1015', '#1a2a10'], sizes: ['S', 'M', 'L', 'XL'], isNew: false },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const saved = localStorage.getItem('dripyard_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      localStorage.setItem('dripyard_products', JSON.stringify(initialProducts));
    }
  }, []);

  const getProductById = (id) => products.find(p => p.id === Number(id));

  return (
    <ProductContext.Provider value={{ products, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
