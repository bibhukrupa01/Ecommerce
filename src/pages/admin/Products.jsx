import { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';

export default function Products() {
  const { products: defaultProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'hoodies',
    badge: '',
    desc: ''
  });

  useEffect(() => {
    // Read from localStorage to allow admin mutations
    const storedProducts = localStorage.getItem('dripyard_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(defaultProducts);
    }
  }, [defaultProducts]);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('dripyard_products', JSON.stringify(newProducts));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      brand: 'DRIP YARD',
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category,
      badge: formData.badge || null,
      desc: formData.desc,
      image: '', // Needs a real image picker in a production app
      colors: ['#c41e3a', '#111'],
      sizes: ['S', 'M', 'L', 'XL'],
      isNew: true,
      rating: 5.0,
      reviewCount: 0
    };

    saveProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setFormData({ name: '', price: '', originalPrice: '', category: 'hoodies', badge: '', desc: '' });
    
    alert('Product added successfully!');
  };

  const deleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const filtered = products.filter(p => p.id !== id);
      saveProducts(filtered);
      alert('Product deleted.');
    }
  };

  return (
    <div className="admin-products">
      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-accent text-white">Product Catalog</h2>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Product
          </button>
        </div>
        
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
                    ${p.price.toFixed(2)}
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
              
              <button type="submit" className="btn btn-primary w-full py-3 mt-2">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
