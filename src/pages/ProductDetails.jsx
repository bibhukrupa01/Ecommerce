import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { products } = useProduct(); // For related products
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc-tab');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    const token = localStorage.getItem('dripyard_token');
    if (!token) {
      alert('Please log in to submit a review');
      setSubmittingReview(false);
      return;
    }
    const userStr = localStorage.getItem('dripyard_current_user');
    const user = userStr ? JSON.parse(userStr) : {};
    
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
          userName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      const data = await res.json();
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-red-primary/20 border-t-red-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-secondary">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-4xl text-white font-heading tracking-[4px] mb-4">
          {error === 'Product not found' ? 'Product not found' : 'Error'}
        </h2>
        <p className="text-text-secondary mt-3">
          {error === 'Product not found' 
            ? 'The product you are looking for does not exist.' 
            : 'Something went wrong while loading the product. Please try again later.'}
        </p>
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
            <div className="glass aspect-[3/4] flex items-center justify-center mb-4 overflow-hidden rounded-lg group">
              {(product.images && product.images.length > 0) || product.image ? (
                <img 
                  src={product.images?.[0] || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="font-heading text-5xl text-red-primary/20 tracking-[6px]">DRIP YARD</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(product.images?.length > 0 ? product.images : [product.image]).slice(0, 4).map((img, idx) => (
                <div key={idx} className={`glass aspect-square flex items-center justify-center cursor-pointer text-xs transition-colors overflow-hidden ${idx === 0 ? 'border-red-primary text-white' : 'text-text-muted hover:text-white hover:border-white/20'}`}>
                  {img ? (
                    <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                  ) : (
                    <span>{['Back', 'Side', 'Detail'][idx - 1] || 'View'}</span>
                  )}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 4 - (product.images?.length || (product.image ? 1 : 0))) }).map((_, idx) => (
                 <div key={`empty-${idx}`} className="glass aspect-square flex items-center justify-center cursor-pointer text-xs transition-colors text-text-muted hover:text-white hover:border-white/20">
                    <span>{['Back', 'Side', 'Detail'][idx] || 'View'}</span>
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
                  {'★'.repeat(Math.floor(product.rating || 0))}
                  <span className="opacity-30">{'★'.repeat(5 - Math.floor(product.rating || 0))}</span>
               </span>
               <span className="text-text-muted text-sm">{product.rating || 0} ({product.reviewsCount || product.reviewCount || 0} reviews)</span>
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

             <p className="text-text-secondary leading-relaxed mb-7">{product.description || product.desc || ''}</p>

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
                     <p className="text-text-secondary leading-relaxed text-sm">{product.description || product.desc || 'No description available.'}</p>
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
                                     <div className="w-8 h-8 rounded-full bg-red-primary/10 flex items-center justify-center font-bold text-red-primary text-xs shrink-0">{r.userName?.charAt(0) || 'U'}</div>
                                     <div className="flex-1">
                                         <strong className="text-sm text-white block">{r.userName || 'Anonymous'}</strong>
                                         <p className="text-xs text-text-muted mt-0.5">{formatDate(r.createdAt ? (r.createdAt._seconds ? r.createdAt._seconds * 1000 : r.createdAt) : new Date())}</p>
                                     </div>
                                     <div className="text-gold text-sm tracking-widest flex">
                                        {'★'.repeat(Math.max(0, Math.floor(r.rating || 0)))}
                                        <span className="opacity-30">{'★'.repeat(Math.max(0, 5 - Math.floor(r.rating || 0)))}</span>
                                     </div>
                                 </div>
                                 <p className="text-sm text-text-secondary">{r.comment}</p>
                             </div>
                         )) : (
                             <p className="text-text-muted py-5 text-sm">No reviews yet. Be the first!</p>
                         )}
                         
                         <div className="mt-8 border-t border-white/10 pt-6">
                           <h4 className="text-white font-accent mb-4">Write a Review</h4>
                           <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                             <div>
                               <label className="text-xs text-text-muted uppercase mb-1 block">Rating</label>
                               <select 
                                 className="bg-black/30 border border-white/10 rounded-md p-2 text-white outline-none w-full max-w-[200px]"
                                 value={newReview.rating}
                                 onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                               >
                                 <option value={5}>5 Stars - Excellent</option>
                                 <option value={4}>4 Stars - Good</option>
                                 <option value={3}>3 Stars - Average</option>
                                 <option value={2}>2 Stars - Poor</option>
                                 <option value={1}>1 Star - Terrible</option>
                               </select>
                             </div>
                             <div>
                               <label className="text-xs text-text-muted uppercase mb-1 block">Your Review</label>
                               <textarea 
                                 rows="3" 
                                 required
                                 className="w-full bg-black/30 border border-white/10 rounded-md p-3 text-white text-sm outline-none focus:border-red-primary resize-y"
                                 placeholder="What did you think about this product?"
                                 value={newReview.comment}
                                 onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                               ></textarea>
                             </div>
                             <button type="submit" disabled={submittingReview} className="btn btn-primary self-start">
                               {submittingReview ? 'Submitting...' : 'Submit Review'}
                             </button>
                           </form>
                         </div>
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
