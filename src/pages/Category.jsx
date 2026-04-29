import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const CAT_NAMES = {
  hoodies: 'Hoodies',
  tshirts: 'T-Shirts',
  jackets: 'Jackets',
  pants: 'Pants',
  accessories: 'Accessories',
  sets: 'Sets',
  new: 'New Arrivals'
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Category() {
  const { products } = useProduct();
  const [searchParams] = useSearchParams();
  const urlCat = searchParams.get('cat');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCats, setSelectedCats] = useState(urlCat ? [urlCat] : []);
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  // If URL changes (e.g., clicking 'Drips' in nav which links to ?cat=new)
  useEffect(() => {
    if (urlCat) {
      setSelectedCats([urlCat]);
    } else {
      setSelectedCats([]);
    }
  }, [urlCat]);

  const allCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  const handleCatToggle = (cat) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSize(prev => prev === size ? null : size);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category Filter
    if (selectedCats.length > 0) {
      if (selectedCats.includes('new') && selectedCats.length === 1) {
        // "New Arrivals" special case (from URL usually)
        filtered = filtered.filter(p => p.isNew || p.badge === 'New');
      } else {
        filtered = filtered.filter(p => selectedCats.includes(p.category));
      }
    }

    // Price Filter
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Size Filter
    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // featured
        break;
    }

    return filtered;
  }, [products, selectedCats, maxPrice, selectedSize, sortBy, searchQuery]);

  // Determine Breadcrumb current name
  let breadcrumbName = 'Shop';
  if (urlCat === 'new') breadcrumbName = 'New Arrivals';
  else if (urlCat && CAT_NAMES[urlCat]) breadcrumbName = CAT_NAMES[urlCat];

  return (
    <div className="container pt-8 pb-16 min-h-[70vh]">
      <div className="text-text-muted text-sm mb-6">
        <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link> / <span className="text-red-primary">{breadcrumbName}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="glass w-full md:w-[260px] p-6 shrink-0 md:sticky md:top-24 max-md:hidden">
          <h4 className="mb-5 text-base text-white">Filters</h4>

          <div className="mb-6">
            <h5 className="text-xs uppercase tracking-[1px] text-text-muted mb-3">Search</h5>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white text-sm focus:border-red-primary outline-none"
            />
          </div>
          
          <div className="mb-6">
            <h5 className="text-xs uppercase tracking-[1px] text-text-muted mb-3">Category</h5>
            <div className="flex flex-col gap-2">
              {allCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="accent-red-primary"
                    checked={selectedCats.includes(cat)}
                    onChange={() => handleCatToggle(cat)}
                  />
                  <span className="text-sm text-text-secondary group-hover:text-white transition-colors">
                    {CAT_NAMES[cat] || cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-xs uppercase tracking-[1px] text-text-muted mb-3">Price Range</h5>
            <input 
              type="range" 
              min="0" 
              max="300" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-red-primary"
            />
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-[1px] text-text-muted mb-3">Size</h5>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map(s => (
                <button 
                  key={s}
                  onClick={() => handleSizeToggle(s)}
                  className={`btn btn-sm px-3.5 py-1.5 text-xs rounded-sm transition-colors ${
                    selectedSize === s 
                      ? 'bg-red-primary text-white border border-red-primary' 
                      : 'bg-transparent text-text-secondary border border-white/20 hover:border-white/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-3xl font-heading text-white tracking-[1px]">
              All Products <span className="text-text-muted text-lg relative -top-1">({filteredProducts.length})</span>
            </h2>
            
            <select 
              className="bg-black/30 border border-white/10 text-white text-sm rounded-md px-3 py-2 outline-none focus:border-red-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Best Rating</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-5 glass rounded-lg mt-4">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-accent text-xl mb-2 text-white">No products found</h3>
              <p className="text-text-secondary">Try adjusting your filters or price range.</p>
              <button 
                onClick={() => { setSelectedCats([]); setMaxPrice(300); setSelectedSize(null); }}
                className="btn btn-primary mt-6"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
