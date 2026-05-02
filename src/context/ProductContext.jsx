import { createContext, useContext, useState, useEffect } from "react";


const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch from Express Backend instead of direct Firestore
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const productsData = await response.json();
      
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const getProductById = (id) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById, refetchProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

