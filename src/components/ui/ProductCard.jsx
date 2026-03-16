import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWished = isInWishlist(product.id);

  return (
    <div className="product-card group relative cursor-pointer" onClick={() => window.location.href=`/product/${product.id}`}>
      {product.badge && <span className="product-card-badge">{product.badge}</span>}
      
      <div className="product-card-img">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="w-full h-full bg-bg-secondary flex flex-col items-center justify-center font-heading text-4xl text-red-primary/30 tracking-[4px]">
            {product.brand}
          </div>
        )}
        
        <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => toggleWishlist(product)} title="Wishlist">
            <Heart size={16} fill={isWished ? 'var(--red-primary)' : 'none'} color={isWished ? 'var(--red-primary)' : 'currentColor'} />
          </button>
          <button onClick={() => addToCart(product)} title="Add to Cart">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
      
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h4 className="product-card-title">{product.name}</h4>
        <div className="product-card-price">
          <span className="current">${product.price.toFixed(2)}</span>
          {product.originalPrice && <span className="original">${product.originalPrice.toFixed(2)}</span>}
        </div>
        <div className="product-card-rating">
          <span className="stars text-gold">
            {'★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="count">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
