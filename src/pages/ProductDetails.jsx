import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { getProductById, products } = useProduct();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  
  const product = getProductById(id);
  
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc-tab');

  useEffect(() => {
    // Reset state when product changes
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[Math.floor(product.sizes.length / 2)] : '');
      setSelectedColor(product.colors ? product.colors[0] : '');
      setQty(1);
      setActiveTab('desc-tab');
      document.title = `${product.name} — DRIP YARD`;
    }
  }, [product]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('dripyard_reviews') || '[]');
    setReviews(storedReviews.filter(r => r.productId === Number(id)));
  }, [id]);

  if (!product) {
    return (
      <div className="container py-20 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-4xl text-white font-heading tracking-[4px] mb-4">Product not found</h2>
        <p className="text-text-secondary mt-3">The product you are looking for does not exist.</p>
        <Link to="/category" className="btn btn-primary mt-6 inline-block">Browse Products</Link>
      </div>
    );
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const colorNames = { 
    '#c41e3a': 'Heist Red', '#111': 'Black', '#f0e6d3': 'Cream', 
    '#2a3a5c': 'Navy', '#2a2015': 'Dark Brown', '#3a3a2a': 'Olive', 
    '#1a2a10': 'Forest Green', '#ffffff': 'White', '#000000': 'Black' 
  };
  
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
        addToCart({
            ...product,
            size: selectedSize,
            color: selectedColor
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const relatedList = related.length === 0 ? products.filter(p => p.id !== product.id).slice(0, 4) : related;

  return (
    <div className="page-wrapper pt-8 pb-16">
      <div className="container">
        <p className="text-text-muted text-sm mb-6">
          <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link> / 
          <Link to="/category" className="text-text-muted hover:text-white transition-colors ml-1">Shop</Link> / 
          <span className="text-red-primary ml-1">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start" id="product-detail">
          {/* Images */}
          <div>
            <div className="glass aspect-[3/4] flex items-center justify-center mb-4 overflow-hidden rounded-lg">
              <div className="font-heading text-5xl text-red-primary/20 tracking-[6px]">DRIP YARD</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['Front', 'Back', 'Side', 'Detail'].map((label, idx) => (
                <div key={idx} className={`glass aspect-square flex items-center justify-center cursor-pointer text-xs transition-colors ${idx === 0 ? 'border-red-primary text-white' : 'text-text-muted hover:text-white hover:border-white/20'}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
             {product.badge && <span className="badge badge-red mb-3 inline-block">{product.badge}</span>}
             <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{product.brand}</p>
             <h1 className="text-4xl mb-2">{product.name}</h1>
             
             <div className="flex items-center gap-3 mb-5">
               <span className="text-gold text-base tracking-widest">
                  {'★'.repeat(Math.floor(product.rating))}
                  <span className="opacity-30">{'★'.repeat(5 - Math.floor(product.rating))}</span>
               </span>
               <span className="text-text-muted text-sm">{product.rating} ({product.reviewCount} reviews)</span>
             </div>

             <div className="flex items-baseline gap-3 mb-6">
                <span className="font-heading text-4xl text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                    <>
                    <span className="text-lg text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="badge badge-green">{discount}% OFF</span>
                    </>
                )}
             </div>

             <p className="text-text-secondary leading-relaxed mb-7">{product.desc || ''}</p>

             {/* Colors */}
             {product.colors && (
                 <div className="mb-6">
                     <p className="text-sm text-text-muted uppercase mb-2">Color: <strong className="text-white">{colorNames[selectedColor] || selectedColor}</strong></p>
                     <div className="flex gap-2">
                         {product.colors.map(c => (
                             <button 
                                key={c}
                                onClick={() => setSelectedColor(c)}
                                className="w-8 h-8 rounded-full border-2 transition-all"
                                style={{ backgroundColor: c, borderColor: c === selectedColor ? 'var(--red-primary)' : 'transparent' }}
                             ></button>
                         ))}
                     </div>
                 </div>
             )}

             {/* Sizes */}
             {product.sizes && (
                 <div className="mb-7">
                     <div className="flex justify-between mb-2">
                         <p className="text-sm text-text-muted uppercase">Select Size</p>
                         <button className="text-sm text-red-primary hover:underline">Size Guide</button>
                     </div>
                     <div className="flex gap-2 flex-wrap">
                         {product.sizes.map(s => (
                             <button
                                key={s}
                                onClick={() => setSelectedSize(s)}
                                className={`btn btn-sm ${s === selectedSize ? 'btn-primary' : 'btn-secondary'}`}
                             >
                                {s}
                             </button>
                         ))}
                     </div>
                 </div>
             )}

             {/* Actions */}
             <div className="flex gap-3 mb-5 flex-wrap">
                <div className="glass flex items-center gap-4 px-4 py-2 rounded-sm shrink-0">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-xl text-text-secondary hover:text-white">−</button>
                    <span className="font-semibold min-w-[20px] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="text-xl text-text-secondary hover:text-white">+</button>
                </div>
                <button className="btn btn-primary btn-lg flex-1" onClick={handleAddToCart}>Add to Cart</button>
                <button 
                  className={`btn ${isInWishlist(product.id) ? 'btn-primary' : 'btn-secondary'} btn-icon w-[52px] h-[52px] shrink-0`}
                  onClick={() => toggleWishlist({ id: product.id, name: product.name, brand: product.brand, price: product.price })}
                >
                  <svg width="20" height="20" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z"/></svg>
                </button>
             </div>

             <div className="flex gap-2 flex-wrap mb-7">
                <span className="tag">🚀 Free Shipping</span>
                <span className="tag">↩️ 30-Day Returns</span>
                <span className="tag">🔒 Secure Checkout</span>
             </div>

             {/* Tabs */}
             <div className="tabs border-b border-white/10 mb-4 flex gap-4">
                 <button className={`pb-3 border-b-2 transition-colors ${activeTab === 'desc-tab' ? 'border-red-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`} onClick={() => setActiveTab('desc-tab')}>Description</button>
                 <button className={`pb-3 border-b-2 transition-colors ${activeTab === 'spec-tab' ? 'border-red-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`} onClick={() => setActiveTab('spec-tab')}>Specifications</button>
                 <button className={`pb-3 border-b-2 transition-colors ${activeTab === 'review-tab' ? 'border-red-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`} onClick={() => setActiveTab('review-tab')}>Reviews ({reviews.length})</button>
             </div>

             <div className="tab-content py-2">
                 {activeTab === 'desc-tab' && (
                     <p className="text-text-secondary leading-relaxed text-sm">{product.desc || 'No description available.'}</p>
                 )}
                 {activeTab === 'spec-tab' && (
                     <div className="text-sm text-text-secondary">
                         <div className="flex justify-between py-2 border-b border-white/5"><span>Brand</span><span className="text-white">{product.brand}</span></div>
                         <div className="flex justify-between py-2 border-b border-white/5"><span>Category</span><span className="text-white capitalize">{product.category}</span></div>
                         <div className="flex justify-between py-2 border-b border-white/5"><span>Available Sizes</span><span className="text-white">{(product.sizes || []).join(', ')}</span></div>
                         <div className="flex justify-between py-2"><span>Rating</span><span className="text-white">{product.rating}/5</span></div>
                     </div>
                 )}
                 {activeTab === 'review-tab' && (
                     <div>
                         {reviews.length > 0 ? reviews.map(r => (
                             <div key={r.id} className="glass-card mb-3 p-4 rounded-lg bg-black/10 border border-white/5">
                                 <div className="flex items-center gap-3 mb-2">
                                     <div className="w-8 h-8 rounded-full bg-red-primary/10 flex items-center justify-center font-bold text-red-primary text-xs shrink-0">{r.userName.charAt(0)}</div>
                                     <div className="flex-1">
                                         <strong className="text-sm text-white block">{r.userName}</strong>
                                         <p className="text-xs text-text-muted mt-0.5">{formatDate(r.date)}</p>
                                     </div>
                                     <div className="text-gold text-sm tracking-widest flex">
                                        {'★'.repeat(Math.floor(r.rating))}
                                        <span className="opacity-30">{'★'.repeat(5 - Math.floor(r.rating))}</span>
                                     </div>
                                 </div>
                                 <p className="text-sm text-text-secondary">{r.text}</p>
                             </div>
                         )) : (
                             <p className="text-text-muted py-5 text-sm">No reviews yet. Be the first!</p>
                         )}
                         <Link to="/customer-reviews" className="btn btn-secondary mt-4 w-full md:w-auto inline-block text-center">Write a Review</Link>
                     </div>
                 )}
             </div>

          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
            <h2 className="text-3xl mb-8 font-heading">You May Also <span className="text-red-primary">Like</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedList.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
