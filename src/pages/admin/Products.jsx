import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';

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

  const [editProductData, setEditProductData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('dripyard_token');
    try {
      const newProduct = {
        name: formData.name,
        brand: 'DRIP YARD',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        badge: formData.badge || null,
        desc: formData.desc
      };
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (!res.ok) throw new Error('Failed to add product');
      setIsModalOpen(false);
      setFormData({ name: '', price: '', originalPrice: '', category: 'hoodies', badge: '', desc: '' });
      window.location.reload();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditProductData({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProductData) return;
    const token = localStorage.getItem('dripyard_token');
    try {
      const { id, ...updates } = editProductData;
      updates.price = parseFloat(updates.price);
      if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
      
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update product');
      setEditProductData(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product.');
    }
  };

  const deleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const token = localStorage.getItem('dripyard_token');
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to delete product');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
      }
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
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm">
                        <strong className="text-white block">{p.name}</strong>
                      </td>
                      <td className="py-4 px-4 text-sm text-white">
                        ${p.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-4 px-4 text-sm capitalize text-text-secondary">{p.category}</td>
                      <td className="py-4 px-4 text-sm">
                        <button className="text-red-primary hover:text-white transition-colors text-xs" onClick={() => deleteProduct(p.id, p.name)}>
                          Delete
                        </button>
                        <button className="text-blue-500 hover:text-white transition-colors text-xs ml-2" onClick={() => openEditModal(p)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="glass p-8 w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white text-2xl leading-none">&times;</button>
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
      {editProductData && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditProductData(null); }}>
          <div className="glass p-8 w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Edit Product</h3>
              <button onClick={() => setEditProductData(null)} className="text-text-muted hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Product Name</label>
                <input type="text" name="name" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" value={editProductData.name || ''} onChange={handleEditChange} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Price ($)</label>
                  <input type="number" step="0.01" name="price" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" value={editProductData.price || ''} onChange={handleEditChange} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Original Price ($)</label>
                  <input type="number" step="0.01" name="originalPrice" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" value={editProductData.originalPrice || ''} onChange={handleEditChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <select name="category" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary outline-none" value={editProductData.category || ''} onChange={handleEditChange} required>
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
                  <input type="text" name="badge" placeholder="e.g. New, Hot, Limited" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" value={editProductData.badge || ''} onChange={handleEditChange} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea name="desc" rows="3" className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary resize-y" value={editProductData.desc || ''} onChange={handleEditChange} required></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full py-3 mt-2">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
