import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProduct } from '../../context/ProductContext';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const AVAILABLE_COLORS = ['White', 'Black', 'Red', 'Blue', 'Green', 'Grey', 'Navy', 'Brown', 'Beige', 'Pink', 'Yellow', 'Orange', 'Purple', 'Olive', 'Maroon', 'Teal'];

const DEFAULT_FORM = {
  name: '',
  brand: 'Drip Yard',
  price: '',
  originalPrice: '',
  category: 'hoodies',
  badge: '',
  description: '',
  colors: [],
  sizes: [],
  stock: {},       // { S: 10, M: 20, ... }
  images: [''],    // array of image URLs
  isFeatured: false,
  rating: '',
  reviewsCount: ''
};

// Reusable input class
const inputCls = "bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary placeholder:text-white/30 transition-colors outline-none";
const labelCls = "text-sm font-medium text-text-secondary";

// Required asterisk helper
const Req = () => <span className="text-red-primary ml-0.5">*</span>;

// ────────── Size-Stock Picker Component ──────────
function SizeStockPicker({ sizes, stock, onChange }) {
  const toggleSize = (size) => {
    let newSizes, newStock;
    if (sizes.includes(size)) {
      newSizes = sizes.filter(s => s !== size);
      newStock = { ...stock };
      delete newStock[size];
    } else {
      newSizes = [...sizes, size];
      newStock = { ...stock, [size]: 0 };
    }
    onChange(newSizes, newStock);
  };

  const updateStock = (size, value) => {
    const newStock = { ...stock, [size]: Math.max(0, parseInt(value) || 0) };
    onChange(sizes, newStock);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className={labelCls}>Sizes &amp; Stock per Size <Req /></label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SIZES.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              sizes.includes(size)
                ? 'bg-red-primary/20 border-red-primary text-red-primary'
                : 'bg-black/20 border-white/10 text-text-muted hover:border-white/30'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {sizes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
          {AVAILABLE_SIZES.filter(s => sizes.includes(s)).map(size => (
            <div key={size} className="flex items-center gap-2">
              <span className="text-xs text-text-secondary w-8 font-semibold">{size}</span>
              <input
                type="number"
                min="0"
                className={`${inputCls} flex-1 !p-2 text-sm`}
                placeholder="Stock"
                value={stock[size] ?? ''}
                onChange={(e) => updateStock(size, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      {sizes.length === 0 && (
        <p className="text-xs text-text-muted">Click sizes above to enable them</p>
      )}
    </div>
  );
}

// ────────── Color Picker Component ──────────
function ColorPicker({ selected, onChange }) {
  const toggle = (color) => {
    if (selected.includes(color)) {
      onChange(selected.filter(c => c !== color));
    } else {
      onChange([...selected, color]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>Colors</label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => toggle(color)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              selected.includes(color)
                ? 'bg-red-primary/20 border-red-primary text-red-primary'
                : 'bg-black/20 border-white/10 text-text-muted hover:border-white/30'
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────── Image URLs Component ──────────
function ImageUrlList({ images, onChange }) {
  const updateUrl = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    onChange(updated);
  };
  const addField = () => onChange([...images, '']);
  const removeField = (index) => {
    if (images.length <= 1) return;
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>Image URLs <Req /></label>
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="url"
            className={`${inputCls} flex-1`}
            placeholder={`Image URL #${i + 1}`}
            value={url}
            onChange={(e) => updateUrl(i, e.target.value)}
          />
          {images.length > 1 && (
            <button type="button" onClick={() => removeField(i)} className="text-red-primary hover:text-white text-lg transition-colors leading-none">&times;</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addField} className="text-xs text-red-primary hover:text-white transition-colors self-start mt-1">
        + Add another image URL
      </button>
    </div>
  );
}

// ────────── Product Form Fields (shared between Add & Edit) ──────────
function ProductFormFields({ data, onFieldChange, onColorsChange, onSizeStockChange, onImagesChange, onFeaturedChange }) {
  return (
    <>
      {/* Required fields note */}
      <p className="text-xs text-text-muted -mb-2">Fields marked with <span className="text-red-primary">*</span> are required</p>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Product Name <Req /></label>
        <input type="text" name="name" className={inputCls} value={data.name} onChange={onFieldChange} required />
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Brand <Req /></label>
        <input type="text" name="brand" className={inputCls} value={data.brand} onChange={onFieldChange} required />
      </div>

      {/* Price + Original Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Price ($) <Req /></label>
          <input type="number" step="0.01" name="price" className={inputCls} value={data.price} onChange={onFieldChange} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Original Price ($)</label>
          <input type="number" step="0.01" name="originalPrice" className={inputCls} placeholder="Leave empty if no discount" value={data.originalPrice} onChange={onFieldChange} />
        </div>
      </div>

      {/* Category + Badge */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Category <Req /></label>
          <select name="category" className={`${inputCls} cursor-pointer`} value={data.category} onChange={onFieldChange} required>
            <option value="hoodies">Hoodies</option>
            <option value="tshirts">T-Shirts</option>
            <option value="jackets">Jackets</option>
            <option value="pants">Pants</option>
            <option value="accessories">Accessories</option>
            <option value="sets">Sets</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Badge</label>
          <input type="text" name="badge" placeholder="e.g. New, Hot, Limited" className={inputCls} value={data.badge} onChange={onFieldChange} />
        </div>
      </div>

      {/* Rating + Reviews Count */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Rating (0-5)</label>
          <input type="number" step="0.1" min="0" max="5" name="rating" placeholder="e.g. 4.5" className={inputCls} value={data.rating} onChange={onFieldChange} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Reviews Count</label>
          <input type="number" min="0" name="reviewsCount" placeholder="e.g. 120" className={inputCls} value={data.reviewsCount} onChange={onFieldChange} />
        </div>
      </div>

      {/* Colors */}
      <ColorPicker selected={data.colors || []} onChange={onColorsChange} />

      {/* Sizes & Per-Size Stock */}
      <SizeStockPicker
        sizes={data.sizes || []}
        stock={data.stock || {}}
        onChange={onSizeStockChange}
      />

      {/* Images */}
      <ImageUrlList images={data.images || ['']} onChange={onImagesChange} />

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Description <Req /></label>
        <textarea name="description" rows="3" className={`${inputCls} resize-y`} value={data.description} onChange={onFieldChange} required></textarea>
      </div>

      {/* Featured Toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          className={`w-10 h-5 rounded-full relative transition-colors ${data.isFeatured ? 'bg-red-primary' : 'bg-white/10'}`}
          onClick={onFeaturedChange}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
        </div>
        <span className="text-sm text-text-secondary">Featured Product</span>
      </label>
    </>
  );
}

// ────────── Main Products Component ──────────
export default function Products() {
  const { products, loading: productsLoading, refetchProducts } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [editProductData, setEditProductData] = useState(null);

  // ── Add Product handlers ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Custom validation for fields the browser can't check (sizes, images)
    if (!formData.sizes || formData.sizes.length === 0) {
      toast.error('Please select at least one size.');
      return;
    }
    const validImages = (formData.images || []).filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Please add at least one image URL.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('dripyard_token');
    try {
      const newProduct = {
        name: formData.name,
        brand: formData.brand || 'Drip Yard',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        badge: formData.badge || null,
        description: formData.description,
        colors: formData.colors || [],
        sizes: formData.sizes || [],
        stock: formData.stock || {},
        images: validImages,
        isFeatured: formData.isFeatured || false,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviewsCount: formData.reviewsCount ? parseInt(formData.reviewsCount) : 0
      };
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to add product');
      }
      // Success – close modal, reset form, refresh product list
      setIsModalOpen(false);
      setFormData({ ...DEFAULT_FORM });
      toast.success(`"${newProduct.name}" has been added successfully!`);
      await refetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Edit Product handlers ──
  const openEditModal = (product) => {
    // Normalize legacy single stock number → per-size stock object
    let stock = product.stock || {};
    if (typeof stock === 'number') {
      const sizes = product.sizes || [];
      const perSize = sizes.length > 0 ? Math.floor(stock / sizes.length) : stock;
      stock = {};
      sizes.forEach(s => { stock[s] = perSize; });
    }
    setEditProductData({
      ...product,
      description: product.description || product.desc || '',
      originalPrice: product.originalPrice || '',
      badge: product.badge || '',
      brand: product.brand || 'Drip Yard',
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock,
      images: product.images && product.images.length > 0 ? product.images : [''],
      isFeatured: product.isFeatured || false,
      rating: product.rating ?? '',
      reviewsCount: product.reviewsCount ?? ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProductData) return;

    // Custom validation
    if (!editProductData.sizes || editProductData.sizes.length === 0) {
      toast.error('Please select at least one size.');
      return;
    }
    const validImages = (editProductData.images || []).filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Please add at least one image URL.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('dripyard_token');
    try {
      const { id, ...updates } = editProductData;
      updates.price = parseFloat(updates.price);
      if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
      else updates.originalPrice = null;
      updates.images = validImages;
      updates.rating = updates.rating ? parseFloat(updates.rating) : 0;
      updates.reviewsCount = updates.reviewsCount ? parseInt(updates.reviewsCount) : 0;
      updates.isFeatured = !!updates.isFeatured;

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update product');
      }
      const productName = editProductData.name;
      setEditProductData(null);
      toast.success(`"${productName}" has been updated successfully!`);
      await refetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const token = localStorage.getItem('dripyard_token');
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to delete product');
        toast.success(`"${name}" has been deleted.`);
        await refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product. Please try again.');
      }
    }
  };

  // Helper: total stock from stock object
  const getTotalStock = (product) => {
    const s = product.stock;
    if (!s) return '—';
    if (typeof s === 'number') return s;
    if (typeof s === 'object') {
      const total = Object.values(s).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
      return total;
    }
    return '—';
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
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Product</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Brand</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Price</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Category</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Stock</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Featured</th>
                    <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center gap-3">
                          {p.images && p.images[0] && (
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-md object-cover border border-white/10" />
                          )}
                          <div>
                            <strong className="text-white block">{p.name}</strong>
                            {p.badge && <span className="text-[10px] px-1.5 py-0.5 bg-red-primary/20 text-red-primary rounded-full font-semibold uppercase">{p.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-secondary">{p.brand || '—'}</td>
                      <td className="py-4 px-4 text-sm text-white">
                        ${p.price?.toFixed(2) || "0.00"}
                        {p.originalPrice && (
                          <span className="text-text-muted line-through text-xs ml-1">${p.originalPrice?.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm capitalize text-text-secondary">{p.category}</td>
                      <td className="py-4 px-4 text-sm text-white">{getTotalStock(p)}</td>
                      <td className="py-4 px-4 text-sm">
                        {p.isFeatured ? (
                          <span className="text-green-400 text-xs font-semibold">● Yes</span>
                        ) : (
                          <span className="text-text-muted text-xs">No</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <button className="text-blue-400 hover:text-white transition-colors text-xs mr-3" onClick={() => openEditModal(p)}>
                          Edit
                        </button>
                        <button className="text-red-primary hover:text-white transition-colors text-xs" onClick={() => deleteProduct(p.id, p.name)}>
                          Delete
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

      {/* ────────── Add Product Modal ────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="glass p-8 w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-5">
              <ProductFormFields
                data={formData}
                onFieldChange={handleInputChange}
                onColorsChange={(colors) => setFormData(prev => ({ ...prev, colors }))}
                onSizeStockChange={(sizes, stock) => setFormData(prev => ({ ...prev, sizes, stock }))}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                onFeaturedChange={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
              />
              <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ────────── Edit Product Modal ────────── */}
      {editProductData && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditProductData(null); }}>
          <div className="glass p-8 w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Edit Product</h3>
              <button onClick={() => setEditProductData(null)} className="text-text-muted hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
              <ProductFormFields
                data={editProductData}
                onFieldChange={handleEditChange}
                onColorsChange={(colors) => setEditProductData(prev => ({ ...prev, colors }))}
                onSizeStockChange={(sizes, stock) => setEditProductData(prev => ({ ...prev, sizes, stock }))}
                onImagesChange={(images) => setEditProductData(prev => ({ ...prev, images }))}
                onFeaturedChange={() => setEditProductData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
              />
              <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
