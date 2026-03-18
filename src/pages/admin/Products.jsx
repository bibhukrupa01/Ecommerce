import { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function Products() {
  const { products, loading: productsLoading } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'hoodies',
    badge: '',
    desc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newProduct = {
        name: formData.name,
        brand: 'DRIP YARD',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        badge: formData.badge || null,
        desc: formData.desc,
        image: '', 
        colors: ['#c41e3a', '#111'],
        sizes: ['S', 'M', 'L', 'XL'],
        isNew: true,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "products"), newProduct);
      
      setIsModalOpen(false);
      setFormData({ name: '', price: '', originalPrice: '', category: 'hoodies', badge: '', desc: '' });
      alert('Product added successfully to Firestore! Refresh to see changes if not real-time.');
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "products", id));
        alert('Product deleted from Firestore.');
        window.location.reload();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product.");
      }
    }
  };

  const seedInitialProducts = async () => {
    const productsToSeed = [
      {
        name: "Classic Over-sized Hoodie",
        desc: "Premium cotton-blend oversized hoodie inspired by urban streetwear aesthetics. Features ribbed cuffs and a kangaroo pocket.",
        price: 85.00,
        originalPrice: 105.00,
        category: "hoodies",
        brand: "DRIP YARD",
        stock: 25,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#111", "#444", "#f0e6d3"],
        badge: "Best Seller",
        rating: 4.8,
        reviewCount: 124,
        isNew: false,
        createdAt: new Date().toISOString()
      },
      {
        name: "Cargo Street Joggers",
        desc: "Multi-pocket cargo pants with a tapered fit and adjustable ankle cuffs. Finished with high-quality water-resistant fabric.",
        price: 65.00,
        originalPrice: 85.00,
        category: "pants",
        brand: "DRIP YARD",
        stock: 40,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800",
        sizes: ["S", "M", "L"],
        colors: ["#2d3a2a", "#111", "#c2b280"],
        badge: "New",
        rating: 4.5,
        reviewCount: 89,
        isNew: true,
        createdAt: new Date().toISOString()
      },
      {
        name: "Graphic Tee 'Rebirth'",
        desc: "Limited edition heavyweight cotton graphic tee featuring our signature 'Rebirth' artwork printed on the back.",
        price: 35.00,
        originalPrice: 45.00,
        category: "tshirts",
        brand: "DRIP YARD",
        stock: 100,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["#fff", "#111"],
        badge: null,
        rating: 4.9,
        reviewCount: 215,
        isNew: false,
        createdAt: new Date().toISOString()
      },
      {
        name: "Signature Snapback Cap",
        desc: "Sleek monochromatic snapback cap with an embroidered logo on the front panel and adjustable strap.",
        price: 28.00,
        originalPrice: null,
        category: "accessories",
        brand: "DRIP YARD",
        stock: 60,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
        sizes: ["One Size"],
        colors: ["#111", "#0e1a3a"],
        badge: "Hot",
        rating: 4.2,
        reviewCount: 56,
        isNew: false,
        createdAt: new Date().toISOString()
      },
      {
        name: "Reflective Bomber Jacket",
        desc: "High-visibility reflective bomber jacket with quilted lining and premium metal zippers. Perfect for night aesthetics.",
        price: 120.00,
        originalPrice: 159.00,
        category: "jackets",
        brand: "DRIP YARD",
        stock: 15,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#c0c0c0", "#3a3a3a"],
        badge: "Limited",
        rating: 4.9,
        reviewCount: 42,
        isNew: true,
        createdAt: new Date().toISOString()
      }
    ];

    try {
      setLoading(true);
      for (const p of productsToSeed) {
        await addDoc(collection(db, "products"), p);
      }
      alert("Seeded successfully!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Error seeding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-products">
      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-accent text-white">Product Catalog</h2>
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={seedInitialProducts}
              disabled={loading}
            >
              🚀 Seed Data
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Product
            </button>
          </div>
        </div>
        
        {productsLoading ? (
          <div className="py-12 text-center text-white">Loading products...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Product</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Price</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Category</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Rating</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Badge</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm">
                        <strong className="text-white block">{p.name}</strong>
                        <span className="text-xs text-text-muted">{p.brand}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-white">
                        ${p.price?.toFixed(2) || "0.00"}
                        {p.originalPrice && (
                          <span className="block text-xs text-text-muted line-through">
                            ${p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm capitalize text-text-secondary">{p.category}</td>
                      <td className="py-4 px-4 text-sm text-text-secondary">
                        <span className="text-gold mr-1">★</span>{p.rating}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {p.badge ? (
                          <span className="badge badge-red text-xs px-2 py-1 rounded bg-red-primary text-white">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <button 
                          className="text-red-primary hover:text-white transition-colors text-xs"
                          onClick={() => deleteProduct(p.id, p.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-text-muted border-b border-white/5">
                        No products found in the catalog.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-text-muted">
              {products.length} products total
            </div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="glass p-8 w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Add New Product</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="price"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.price}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Original Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="originalPrice"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <select 
                    name="category"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary outline-none" 
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="jackets">Jackets</option>
                    <option value="pants">Pants</option>
                    <option value="accessories">Accessories</option>
                    <option value="sets">Sets</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Badge</label>
                  <input 
                    type="text" 
                    name="badge"
                    placeholder="e.g. New, Hot, Limited"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.badge}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea 
                  name="desc"
                  rows="3"
                  className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary resize-y" 
                  value={formData.desc}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
