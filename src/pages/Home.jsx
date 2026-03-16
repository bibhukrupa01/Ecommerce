import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const { products } = useProduct();
  const featuredProducts = products.slice(0, 4);

  // Calculate dynamic category counts
  const catCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in-up md:max-w-xl z-10 relative">
            <div className="inline-block px-4 py-1 border border-red-glow rounded-full text-red-light font-accent text-sm font-semibold tracking-wider mb-8 uppercase backdrop-blur-md bg-red-primary/10">🔥 New Collection 2026</div>
            <div className="hero-title flex flex-col font-heading text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.9] tracking-[2px] mb-6">
              <span className="text-white">UNLEASH YOUR</span>
              <span className="text-red-primary italic">INNER</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary">REBEL</span>
            </div>
            <p className="hero-desc text-text-secondary text-lg mb-10 max-w-md">Premium streetwear inspired by the boldness of La Casa de Papel. Each piece is crafted for those who dare to stand out.</p>
            <div className="hero-btns flex gap-4 flex-wrap">
              <Link to="/category" className="btn btn-primary btn-lg">Shop Collection</Link>
              <Link to="/category?cat=new" className="btn btn-secondary btn-lg">New Arrivals</Link>
            </div>
            <div className="hero-stats flex gap-10 mt-16 pt-8 border-t border-white/10">
              <div className="hero-stat">
                <h3 className="text-3xl font-heading text-white">10K+</h3>
                <p className="text-sm text-text-muted">Happy Customers</p>
              </div>
              <div className="hero-stat">
                <h3 className="text-3xl font-heading text-white">500+</h3>
                <p className="text-sm text-text-muted">Premium Products</p>
              </div>
              <div className="hero-stat">
                <h3 className="text-3xl font-heading text-white">50+</h3>
                <p className="text-sm text-text-muted">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Shop by <span className="text-red-primary">Category</span></h2>
            <p>Explore our curated collections designed for the modern rebel</p>
          </div>
          <div className="categories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/category?cat=hoodies" className="category-card relative rounded-xl overflow-hidden aspect-[3/4] group border border-white/5 mx-auto w-full max-w-[300px]">
              <div className="category-card-bg absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{background: 'linear-gradient(135deg, #1a0a0a, #2a1015)'}}></div>
              <div className="category-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-center">
                <h3 className="text-2xl font-heading tracking-[2px] mb-2 text-white">Hoodies</h3>
                <p className="text-gold font-accent text-sm">{catCounts['hoodies'] || 0} Products</p>
              </div>
            </Link>
            <Link to="/category?cat=jackets" className="category-card relative rounded-xl overflow-hidden aspect-[3/4] group border border-white/5 mx-auto w-full max-w-[300px]">
              <div className="category-card-bg absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{background: 'linear-gradient(135deg, #0a0a1a, #15102a)'}}></div>
              <div className="category-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-center">
                <h3 className="text-2xl font-heading tracking-[2px] mb-2 text-white">Jackets</h3>
                <p className="text-gold font-accent text-sm">{catCounts['jackets'] || 0} Products</p>
              </div>
            </Link>
            <Link to="/category?cat=tshirts" className="category-card relative rounded-xl overflow-hidden aspect-[3/4] group border border-white/5 mx-auto w-full max-w-[300px]">
              <div className="category-card-bg absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{background: 'linear-gradient(135deg, #0a1a0a, #102a15)'}}></div>
              <div className="category-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-center">
                <h3 className="text-2xl font-heading tracking-[2px] mb-2 text-white">T-Shirts</h3>
                <p className="text-gold font-accent text-sm">{catCounts['tshirts'] || 0} Products</p>
              </div>
            </Link>
            <Link to="/category?cat=accessories" className="category-card relative rounded-xl overflow-hidden aspect-[3/4] group border border-white/5 mx-auto w-full max-w-[300px]">
              <div className="category-card-bg absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{background: 'linear-gradient(135deg, #1a1a0a, #2a2510)'}}></div>
              <div className="category-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-center">
                <h3 className="text-2xl font-heading tracking-[2px] mb-2 text-white">Accessories</h3>
                <p className="text-gold font-accent text-sm">{catCounts['accessories'] || 0} Products</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2>Featured <span className="text-red-primary">Drops</span></h2>
            <p>Hand-picked styles that define the season</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/category" className="btn btn-secondary">View All Products →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="glass-red p-10 md:p-16 text-center relative overflow-hidden rounded-2xl border border-red-glow shadow-red">
            <div className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] rounded-full bg-red-glow/30 blur-2xl pointer-events-none"></div>
            <h2 className="mb-3 text-white">THE HEIST <span className="text-red-primary">COLLECTION</span></h2>
            <p className="text-text-secondary max-w-[500px] mx-auto mb-8 text-lg">Limited edition pieces dropping soon. Sign up to get early access and an exclusive 20% discount.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
              <input type="email" className="px-5 py-3 rounded-lg bg-black/50 border border-white/10 text-white w-full focus:border-red-primary focus:ring-1 focus:ring-red-primary outline-none transition-all" placeholder="Enter your email" />
              <button className="btn btn-primary whitespace-nowrap py-3">Notify Me</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="feature-card glass-card p-8 rounded-xl text-center flex flex-col items-center">
              <div className="feature-icon text-4xl mb-4">🚀</div>
              <h4 className="text-white mb-2">Free Shipping</h4>
              <p className="text-text-muted text-sm">Free worldwide shipping on all orders over $100</p>
            </div>
            <div className="feature-card glass-card p-8 rounded-xl text-center flex flex-col items-center">
              <div className="feature-icon text-4xl mb-4">🔒</div>
              <h4 className="text-white mb-2">Secure Payment</h4>
              <p className="text-text-muted text-sm">100% secure payment with industry encryption</p>
            </div>
            <div className="feature-card glass-card p-8 rounded-xl text-center flex flex-col items-center">
              <div className="feature-icon text-4xl mb-4">↩️</div>
              <h4 className="text-white mb-2">Easy Returns</h4>
              <p className="text-text-muted text-sm">30-day hassle-free return and exchange policy</p>
            </div>
            <div className="feature-card glass-card p-8 rounded-xl text-center flex flex-col items-center">
              <div className="feature-icon text-4xl mb-4">💎</div>
              <h4 className="text-white mb-2">Premium Quality</h4>
              <p className="text-text-muted text-sm">Handcrafted with finest materials for lasting wear</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>What Our <span className="text-red-primary">Rebels</span> Say</h2>
            <p>Real reviews from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-xl">
              <div className="stars mb-3 text-gold text-lg">★★★★★</div>
              <p className="text-text-secondary text-base leading-relaxed mb-6">"The quality of these hoodies is insane. I've never felt fabric this premium in streetwear. Bella Ciao! 🔥"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-primary flex items-center justify-center font-bold text-white">A</div>
                <div>
                  <strong className="text-sm text-white block">Alex M.</strong>
                  <span className="text-xs text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-xl">
              <div className="stars mb-3 text-gold text-lg">★★★★★</div>
              <p className="text-text-secondary text-base leading-relaxed mb-6">"Ordered the Professor's Coat — hands down the best jacket I own. The attention to detail is next level."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-dark flex items-center justify-center font-bold text-white">S</div>
                <div>
                  <strong className="text-sm text-white block">Sarah K.</strong>
                  <span className="text-xs text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-xl">
              <div className="stars mb-3 text-gold text-lg">★★★★☆</div>
              <p className="text-text-secondary text-base leading-relaxed mb-6">"Fast shipping, premium packaging, and the clothes speak for themselves. DRIP YARD is my go-to now."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated text-red-primary flex items-center justify-center font-bold">D</div>
                <div>
                  <strong className="text-sm text-white block">Daniel R.</strong>
                  <span className="text-xs text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
