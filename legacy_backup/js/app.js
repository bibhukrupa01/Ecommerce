/* ========== DRIP YARD - Shared Application Logic ========== */

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== BURGER MENU =====
function toggleMobileMenu() {
  const burger = document.querySelector('.burger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  if (burger) burger.classList.toggle('active');
  if (mobileNav) mobileNav.classList.toggle('active');
  document.body.style.overflow = (mobileNav && mobileNav.classList.contains('active')) ? 'hidden' : '';
}

function initBurgerMenu() {
  // Close mobile nav when a link inside it is clicked
  document.addEventListener('click', function (e) {
    if (e.target.closest('.mobile-nav a')) {
      const burger = document.querySelector('.burger-menu');
      const mobileNav = document.querySelector('.mobile-nav');
      if (burger) burger.classList.remove('active');
      if (mobileNav) mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ===== SEED DATA (runs once on first visit) =====
function seedData() {
  if (localStorage.getItem('dripyard_seeded')) return;

  // Seed products
  const products = [
    { id: 1, name: 'Heist Red Hoodie', brand: 'DRIP YARD', price: 89.99, originalPrice: 129.99, image: '', rating: 4.8, reviewCount: 142, category: 'hoodies', badge: 'Best Seller', desc: 'Premium heavyweight hoodie crafted from 100% organic cotton. Features the iconic Dali mask embroidery on the chest, oversized fit, and kangaroo pocket.', colors: ['#c41e3a', '#111', '#f0e6d3'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], isNew: false },
    { id: 2, name: 'Bella Ciao Tee', brand: 'DRIP YARD', price: 49.99, originalPrice: 69.99, image: '', rating: 4.6, reviewCount: 98, category: 'tshirts', badge: 'New', desc: 'Classic crew-neck tee with the legendary Bella Ciao lyrics screenprinted on the back. Soft-touch cotton blend for all-day comfort.', colors: ['#c41e3a', '#111', '#2a3a5c'], sizes: ['S', 'M', 'L', 'XL'], isNew: true },
    { id: 3, name: "Professor's Coat", brand: 'DRIP YARD', price: 199.99, originalPrice: 299.99, image: '', rating: 4.9, reviewCount: 234, category: 'jackets', badge: 'Limited', desc: 'The iconic long coat inspired by The Professor. Tailored silhouette with hidden inner pockets and a luxurious wool-blend fabric.', colors: ['#111', '#2a2015'], sizes: ['S', 'M', 'L', 'XL'], isNew: false },
    { id: 4, name: 'Tokyo Cargo Pants', brand: 'DRIP YARD', price: 79.99, originalPrice: null, image: '', rating: 4.5, reviewCount: 67, category: 'pants', badge: null, desc: 'Tactical-inspired cargo pants with multiple utility pockets. Relaxed fit, tapered leg, and adjustable ankle cuffs for a streetwear edge.', colors: ['#111', '#3a3a2a', '#2a3a5c'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], isNew: false },
    { id: 5, name: 'Denver Cap', brand: 'DRIP YARD', price: 34.99, originalPrice: 44.99, image: '', rating: 4.7, reviewCount: 189, category: 'accessories', badge: 'Hot', desc: 'Structured snapback cap with embroidered DRIP YARD logo. Adjustable strap, curved brim, and breathable cotton construction.', colors: ['#c41e3a', '#111'], sizes: ['One Size'], isNew: false },
    { id: 6, name: 'Nairobi Bomber Jacket', brand: 'DRIP YARD', price: 159.99, originalPrice: 219.99, image: '', rating: 4.8, reviewCount: 112, category: 'jackets', badge: 'Trending', desc: 'Sleek bomber jacket with satin finish. Ribbed collar, cuffs and hem. Two-way zipper and interior pocket. A modern rebel essential.', colors: ['#111', '#2a1015', '#1a2a10'], sizes: ['S', 'M', 'L', 'XL'], isNew: false },
    { id: 7, name: 'Helsinki Windbreaker', brand: 'DRIP YARD', price: 119.99, originalPrice: null, image: '', rating: 4.4, reviewCount: 56, category: 'jackets', badge: null, desc: 'Lightweight windbreaker with water-resistant nylon shell. Half-zip design, packable hood, and reflective DRIP YARD detailing.', colors: ['#111', '#2a3a5c'], sizes: ['M', 'L', 'XL'], isNew: true },
    { id: 8, name: 'Rio Streetwear Set', brand: 'DRIP YARD', price: 139.99, originalPrice: 189.99, image: '', rating: 4.7, reviewCount: 78, category: 'sets', badge: 'New', desc: 'Matching hoodie and jogger set in premium French terry. Coordinated design with contrast stitching and embroidered logos.', colors: ['#c41e3a', '#111', '#f0e6d3'], sizes: ['S', 'M', 'L', 'XL'], isNew: true },
  ];
  localStorage.setItem('dripyard_products', JSON.stringify(products));

  // Seed users
  const users = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@dripyard.com', password: 'admin123', role: 'admin', joined: '2025-06-01' },
    { id: 2, firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password', role: 'user', joined: '2025-11-15' },
    { id: 3, firstName: 'Sarah', lastName: 'Khan', email: 'sarah@example.com', password: 'password', role: 'user', joined: '2026-01-10' },
  ];
  localStorage.setItem('dripyard_users', JSON.stringify(users));

  // Seed orders
  const orders = [
    { id: 'DY-2026-4821', userId: 2, items: [{ id: 1, name: 'Heist Red Hoodie', brand: 'DRIP YARD', price: 89.99, qty: 1, size: 'M', color: 'Red' }, { id: 3, name: "Professor's Coat", brand: 'DRIP YARD', price: 199.99, qty: 2, size: 'L', color: 'Black' }], subtotal: 489.97, tax: 39.20, shipping: 0, total: 529.17, status: 'processing', date: '2026-03-05', address: { name: 'John Doe', street: '123 Heist Street', city: 'Madrid', state: 'CA', zip: '28001', country: 'Spain', phone: '+1 555-0100' }, payment: 'Credit Card' },
    { id: 'DY-2026-3917', userId: 3, items: [{ id: 4, name: 'Tokyo Cargo Pants', brand: 'DRIP YARD', price: 79.99, qty: 1, size: 'M', color: 'Black' }], subtotal: 79.99, tax: 6.40, shipping: 0, total: 86.39, status: 'shipped', date: '2026-02-20', address: { name: 'Sarah Khan', street: '456 Rebel Ave', city: 'London', state: '', zip: 'SW1A1AA', country: 'United Kingdom', phone: '+44 7700-900' }, payment: 'PayPal' },
    { id: 'DY-2026-2541', userId: 2, items: [{ id: 5, name: 'Denver Cap', brand: 'DRIP YARD', price: 34.99, qty: 1, size: 'One Size', color: 'Red' }, { id: 2, name: 'Bella Ciao Tee', brand: 'DRIP YARD', price: 49.99, qty: 2, size: 'L', color: 'Red' }, { id: 6, name: 'Nairobi Bomber Jacket', brand: 'DRIP YARD', price: 159.99, qty: 1, size: 'L', color: 'Black' }], subtotal: 294.96, tax: 23.60, shipping: 0, total: 318.56, status: 'delivered', date: '2026-01-15', address: { name: 'John Doe', street: '123 Heist Street', city: 'Madrid', state: 'CA', zip: '28001', country: 'Spain', phone: '+1 555-0100' }, payment: 'Credit Card' },
  ];
  localStorage.setItem('dripyard_orders', JSON.stringify(orders));

  // Seed reviews
  const reviews = [
    { id: 1, productId: 1, userId: 2, userName: 'John D.', rating: 5, text: 'Absolutely love this hoodie! The fabric quality is unreal and the fit is perfect. Bella Ciao!', date: '2026-02-20', status: 'approved' },
    { id: 2, productId: 1, userId: 3, userName: 'Sarah K.', rating: 4, text: 'Great quality and fast shipping. Runs a bit large so size down if you want a regular fit.', date: '2026-01-28', status: 'approved' },
    { id: 3, productId: 3, userId: 2, userName: 'John D.', rating: 5, text: "This coat is absolutely incredible. The tailoring is top-notch. I feel like The Professor every time I wear it.", date: '2026-02-10', status: 'approved' },
    { id: 4, productId: 2, userId: 3, userName: 'Sarah K.', rating: 5, text: 'Best tee I own! The Bella Ciao print is so well done. Soft fabric too.', date: '2026-03-01', status: 'pending' },
    { id: 5, productId: 6, userId: 2, userName: 'John D.', rating: 4, text: 'Bomber jacket looks sick. Satin finish is really premium. Only wish it had more color options.', date: '2026-02-15', status: 'approved' },
  ];
  localStorage.setItem('dripyard_reviews', JSON.stringify(reviews));

  // Seed tickets
  const tickets = [
    { id: 1, userId: 2, category: 'Shipping & Delivery', subject: 'Late delivery on order #DY-2026-4821', description: 'My order was supposed to arrive 3 days ago but tracking shows it is still in transit.', priority: 'high', status: 'open', date: '2026-03-04', orderId: 'DY-2026-4821' },
    { id: 2, userId: 3, category: 'Product Inquiry', subject: 'Size guide clarification', description: 'Can you help me figure out my size for the Helsinki Windbreaker? I am usually between M and L.', priority: 'medium', status: 'resolved', date: '2026-02-18', orderId: '' },
  ];
  localStorage.setItem('dripyard_tickets', JSON.stringify(tickets));

  // Seed coupons
  const coupons = [
    { id: 1, code: 'HEIST20', type: 'percentage', value: 20, minOrder: 100, maxUses: 500, usedCount: 127, expiresAt: '2026-06-30', active: true },
    { id: 2, code: 'BELLACIAO', type: 'fixed', value: 15, minOrder: 75, maxUses: 1000, usedCount: 342, expiresAt: '2026-12-31', active: true },
    { id: 3, code: 'FIRST10', type: 'percentage', value: 10, minOrder: 0, maxUses: null, usedCount: 891, expiresAt: '2026-12-31', active: true },
    { id: 4, code: 'SUMMER25', type: 'percentage', value: 25, minOrder: 150, maxUses: 200, usedCount: 200, expiresAt: '2025-09-30', active: false },
  ];
  localStorage.setItem('dripyard_coupons', JSON.stringify(coupons));

  localStorage.setItem('dripyard_seeded', 'true');
}
seedData();

// ===== AUTH SYSTEM =====
function isLoggedIn() {
  return localStorage.getItem('dripyard_loggedin') === 'true';
}

function getCurrentUser() {
  const userData = localStorage.getItem('dripyard_current_user');
  return userData ? JSON.parse(userData) : null;
}

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  localStorage.setItem('dripyard_loggedin', 'true');
  localStorage.setItem('dripyard_current_user', JSON.stringify(user));
  return user;
}

function registerUser(data) {
  const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
  const exists = users.find(u => u.email === data.email);
  if (exists) return null;
  const newUser = { id: Date.now(), firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, role: 'user', joined: new Date().toISOString().split('T')[0] };
  users.push(newUser);
  localStorage.setItem('dripyard_users', JSON.stringify(users));
  localStorage.setItem('dripyard_loggedin', 'true');
  localStorage.setItem('dripyard_current_user', JSON.stringify(newUser));
  return newUser;
}

function updateCurrentUser(data) {
  const users = JSON.parse(localStorage.getItem('dripyard_users') || '[]');
  const user = getCurrentUser();
  if (!user) return;
  const idx = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    Object.assign(users[idx], data);
    localStorage.setItem('dripyard_users', JSON.stringify(users));
    localStorage.setItem('dripyard_current_user', JSON.stringify(users[idx]));
  }
}

function logoutUser() {
  localStorage.removeItem('dripyard_loggedin');
  localStorage.removeItem('dripyard_current_user');
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem('dripyard_users') || '[]');
}

// ===== PRODUCTS =====
function getProducts() {
  return JSON.parse(localStorage.getItem('dripyard_products') || '[]');
}

function getProductById(id) {
  return getProducts().find(p => p.id === Number(id));
}

function addProduct(data) {
  const products = getProducts();
  data.id = Date.now();
  data.rating = 0;
  data.reviewCount = 0;
  products.push(data);
  localStorage.setItem('dripyard_products', JSON.stringify(products));
  return data;
}

function updateProduct(id, data) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx > -1) { Object.assign(products[idx], data); localStorage.setItem('dripyard_products', JSON.stringify(products)); }
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== Number(id));
  localStorage.setItem('dripyard_products', JSON.stringify(products));
}

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('dripyard_cart') || '[]');

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(product) {
  if (!isLoggedIn()) {
    showToast('Please log in to add items to your cart!', 'error');
    return;
  }
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  localStorage.setItem('dripyard_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  localStorage.setItem('dripyard_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartQty(productId, qty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    localStorage.setItem('dripyard_cart', JSON.stringify(cart));
    updateCartBadge();
  }
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function clearCart() {
  cart = [];
  localStorage.setItem('dripyard_cart', JSON.stringify(cart));
  updateCartBadge();
}

// ===== WISHLIST =====
let wishlist = JSON.parse(localStorage.getItem('dripyard_wishlist') || '[]');

function toggleWishlist(product) {
  if (!isLoggedIn()) {
    showToast('Please log in to use your wishlist!', 'error');
    return;
  }
  const idx = wishlist.findIndex(i => i.id === product.id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist'); }
  else { wishlist.push(product); showToast('Added to wishlist ❤️'); }
  localStorage.setItem('dripyard_wishlist', JSON.stringify(wishlist));
}

function isInWishlist(productId) {
  return wishlist.some(i => i.id === productId);
}

// ===== ORDERS =====
function getOrders() {
  return JSON.parse(localStorage.getItem('dripyard_orders') || '[]');
}

function getOrderById(id) {
  return getOrders().find(o => o.id === id);
}

function getMyOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  return getOrders().filter(o => o.userId === user.id);
}

function placeOrder(shippingData, paymentMethod) {
  const user = getCurrentUser();
  if (!user || cart.length === 0) return null;
  const subtotal = getCartTotal();
  const tax = +(subtotal * 0.08).toFixed(2);
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const total = +(subtotal + tax + shipping).toFixed(2);
  const order = {
    id: 'DY-' + new Date().getFullYear() + '-' + (1000 + Math.floor(Math.random() * 9000)),
    userId: user.id,
    items: cart.map(i => ({ ...i })),
    subtotal, tax, shipping, total,
    status: 'processing',
    date: new Date().toISOString().split('T')[0],
    address: shippingData,
    payment: paymentMethod || 'Credit Card'
  };
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('dripyard_orders', JSON.stringify(orders));
  clearCart();
  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = status; localStorage.setItem('dripyard_orders', JSON.stringify(orders)); }
}

// ===== REVIEWS =====
function getReviews() {
  return JSON.parse(localStorage.getItem('dripyard_reviews') || '[]');
}

function getApprovedReviews() {
  return getReviews().filter(r => r.status === 'approved');
}

function getProductReviews(productId) {
  return getApprovedReviews().filter(r => r.productId === Number(productId));
}

function submitReview(data) {
  const reviews = getReviews();
  const user = getCurrentUser();
  data.id = Date.now();
  data.userId = user ? user.id : 0;
  data.userName = user ? user.firstName + ' ' + user.lastName.charAt(0) + '.' : 'Anonymous';
  data.date = new Date().toISOString().split('T')[0];
  data.status = 'pending';
  reviews.push(data);
  localStorage.setItem('dripyard_reviews', JSON.stringify(reviews));
}

function updateReviewStatus(id, status) {
  const reviews = getReviews();
  const review = reviews.find(r => r.id === Number(id));
  if (review) { review.status = status; localStorage.setItem('dripyard_reviews', JSON.stringify(reviews)); }
}

// ===== TICKETS =====
function getTickets() {
  return JSON.parse(localStorage.getItem('dripyard_tickets') || '[]');
}

function getMyTickets() {
  const user = getCurrentUser();
  if (!user) return [];
  return getTickets().filter(t => t.userId === user.id);
}

function submitTicket(data) {
  const tickets = getTickets();
  const user = getCurrentUser();
  data.id = Date.now();
  data.userId = user ? user.id : 0;
  data.status = 'open';
  data.date = new Date().toISOString().split('T')[0];
  tickets.push(data);
  localStorage.setItem('dripyard_tickets', JSON.stringify(tickets));
}

function updateTicketStatus(id, status) {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === Number(id));
  if (ticket) { ticket.status = status; localStorage.setItem('dripyard_tickets', JSON.stringify(tickets)); }
}

// ===== COUPONS =====
function getCoupons() {
  return JSON.parse(localStorage.getItem('dripyard_coupons') || '[]');
}

function createCoupon(data) {
  const coupons = getCoupons();
  data.id = Date.now();
  data.usedCount = 0;
  coupons.push(data);
  localStorage.setItem('dripyard_coupons', JSON.stringify(coupons));
}

function deleteCoupon(id) {
  const coupons = getCoupons().filter(c => c.id !== Number(id));
  localStorage.setItem('dripyard_coupons', JSON.stringify(coupons));
}

function applyCoupon(code) {
  const coupon = getCoupons().find(c => c.code.toLowerCase() === code.toLowerCase() && c.active);
  if (!coupon) return null;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return null;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
  return coupon;
}

// ===== SETTINGS =====
function getSettings() {
  return JSON.parse(localStorage.getItem('dripyard_settings') || '{}');
}

function saveSettings(data) {
  localStorage.setItem('dripyard_settings', JSON.stringify(data));
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.style.cssText = `
    position:fixed;bottom:100px;right:32px;z-index:9999;padding:14px 24px;
    background:${type === 'success' ? 'rgba(34,197,94,0.9)' : type === 'error' ? 'rgba(196,30,58,0.9)' : 'rgba(234,179,8,0.9)'};
    color:#fff;border-radius:8px;font-size:0.9rem;font-family:'Inter',sans-serif;
    backdrop-filter:blur(8px);box-shadow:0 8px 32px rgba(0,0,0,0.3);
    animation:fadeInUp 0.3s ease;pointer-events:none;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const targetEl = document.getElementById(target);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  });
}

// ===== STAR RATING =====
function initStarRating() {
  document.querySelectorAll('.star-rating-input').forEach(container => {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
        container.dataset.rating = idx + 1;
      });
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.style.color = i <= idx ? '#d4a853' : '');
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => { s.style.color = ''; });
      });
    });
  });
}

// ===== MODAL =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

// ===== ADMIN SIDEBAR TOGGLE (MOBILE) =====
function toggleAdminSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// ===== URL HELPERS =====
function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// ===== RENDER PRODUCT CARD =====
function renderProductCard(product) {
  const isWished = isInWishlist(product.id);
  const prodStr = JSON.stringify({ id: product.id, name: product.name, brand: product.brand, price: product.price }).replace(/"/g, '&quot;');
  return `
    <div class="product-card" onclick="window.location.href='${getPagePath("product-details.html")}?id=${product.id}'">
      ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
      <div class="product-card-img">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a1a,#2a1015);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:2rem;color:rgba(196,30,58,0.3);letter-spacing:4px;">${product.brand}</div>
        <div class="product-card-actions" onclick="event.stopPropagation()">
          <button onclick="toggleWishlist(${prodStr})" title="Wishlist">
            <svg width="16" height="16" fill="${isWished ? 'var(--red-primary)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z"/></svg>
          </button>
          <button onclick="addToCart(${prodStr})" title="Add to Cart">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <p class="product-card-brand">${product.brand}</p>
        <h4 class="product-card-title">${product.name}</h4>
        <div class="product-card-price">
          <span class="current">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-card-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span class="count">(${product.reviewCount})</span>
        </div>
      </div>
    </div>`;
}

// ===== PATH HELPER =====
function getPagePath(page) {
  const path = window.location.pathname;
  if (path.includes('/pages/')) return page;
  return 'pages/' + page;
}
function getRootPath(page) {
  const path = window.location.pathname;
  if (path.includes('/pages/')) return '../' + page;
  return page;
}

// ===== GENERATE NAVBAR HTML =====
function getNavbarHTML(minimal) {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();
  const initial = user ? user.firstName.charAt(0) : 'U';

  const navLinksHTML = minimal
    ? `<div class="nav-links" style="position:absolute;left:50%;transform:translateX(-50%)">
        <a href="${getPagePath('category.html')}">Shop</a>
        <a href="${getPagePath('category.html')}?cat=new" style="color:var(--gold)">Drips</a>
      </div>`
    : `<div class="nav-links">
        <a href="${getRootPath('index.html')}">Home</a>
        <a href="${getPagePath('category.html')}">Shop</a>
        <a href="${getPagePath('category.html')}?cat=new" style="color:var(--gold)">Drips</a>
        ${loggedIn ? `<a href="${getPagePath('my-orders.html')}">Orders</a>
        <a href="${getPagePath('customer-reviews.html')}">Reviews</a>
        <a href="${getPagePath('help-submission.html')}">Support</a>` : ''}
      </div>`;

  const wishlistHTML = loggedIn
    ? `<a href="${getPagePath('wishlist.html')}" class="btn-icon" style="color:var(--text-secondary)" title="Wishlist">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z"/></svg>
        </a>` : '';

  const authHTML = loggedIn
    ? `<a href="${getPagePath('user-profile.html')}" class="nav-user-btn" title="Profile">${initial}</a>`
    : `<a href="${getPagePath('login.html')}" class="btn btn-ghost btn-sm" style="color:var(--text-secondary);font-size:0.85rem">Login</a>
        <a href="${getPagePath('signup.html')}" class="btn btn-primary btn-sm" style="font-size:0.85rem">Sign Up</a>`;

  const mobileNavHTML = minimal
    ? `<div class="mobile-nav">
        <a href="${getRootPath('index.html')}">Home</a>
        <a href="${getPagePath('category.html')}">Shop</a>
        <a href="${getPagePath('category.html')}?cat=new" style="color:var(--gold)">Drips</a>
        <a href="${getPagePath('cart.html')}">Cart</a>
        ${loggedIn ? `<a href="${getPagePath('wishlist.html')}">Wishlist</a>
        <a href="${getPagePath('user-profile.html')}">Profile</a>
        <a href="#" onclick="logoutUser();location.href='${getPagePath('login.html')}'" style="color:var(--red-primary)">Logout</a>`
      : `<a href="${getPagePath('login.html')}" style="color:var(--red-primary)">Login</a>
           <a href="${getPagePath('signup.html')}" style="color:var(--gold)">Sign Up</a>`}
      </div>`
    : `<div class="mobile-nav">
        <a href="${getRootPath('index.html')}">Home</a>
        <a href="${getPagePath('category.html')}">Shop</a>
        <a href="${getPagePath('category.html')}?cat=new" style="color:var(--gold)">Drips</a>
        <a href="${getPagePath('cart.html')}">Cart</a>
        ${loggedIn ? `<a href="${getPagePath('wishlist.html')}">Wishlist</a>
        <a href="${getPagePath('my-orders.html')}">My Orders</a>
        <a href="${getPagePath('customer-reviews.html')}">Reviews</a>
        <a href="${getPagePath('help-submission.html')}">Support</a>
        <a href="${getPagePath('user-profile.html')}">Profile</a>
        <a href="#" onclick="logoutUser();location.href='${getPagePath('login.html')}'" style="color:var(--red-primary)">Logout</a>`
      : `<a href="${getPagePath('login.html')}" style="color:var(--red-primary)">Login</a>
           <a href="${getPagePath('signup.html')}" style="color:var(--gold)">Sign Up</a>`}
      </div>`;

  return `
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="${getRootPath('index.html')}" class="navbar-logo">DRIP <span>YARD</span></a>
      ${navLinksHTML}
      <div class="nav-actions">
        <div class="nav-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search products...">
        </div>
        ${wishlistHTML}
        ${authHTML}
        <button class="burger-menu" onclick="toggleMobileMenu()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
  ${mobileNavHTML}`;
}

// ===== GENERATE FOOTER HTML =====
function getFooterHTML() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>DRIP <span>YARD</span></h3>
          <p>Premium streetwear inspired by the boldness of Money Heist. Every piece tells a story of rebellion, style, and unmatched quality.</p>
          <div class="footer-social">
            <a href="#" title="Instagram">IG</a>
            <a href="#" title="Twitter">X</a>
            <a href="#" title="Facebook">FB</a>
            <a href="#" title="YouTube">YT</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="${getPagePath('category.html')}">All Products</a>
          <a href="${getPagePath('category.html')}?cat=hoodies">Hoodies</a>
          <a href="${getPagePath('category.html')}?cat=jackets">Jackets</a>
          <a href="${getPagePath('category.html')}?cat=tshirts">T-Shirts</a>
          <a href="${getPagePath('category.html')}?cat=accessories">Accessories</a>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <a href="${getPagePath('user-profile.html')}">My Profile</a>
          <a href="${getPagePath('my-orders.html')}">My Orders</a>
          <a href="${getPagePath('wishlist.html')}">Wishlist</a>
          <a href="${getPagePath('cart.html')}">Cart</a>
          <a href="${getPagePath('my-tickets.html')}">Support Tickets</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="${getPagePath('customer-reviews.html')}">Reviews</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="${getPagePath('help-submission.html')}">Contact</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 DRIP YARD. All rights reserved.</p>
        <p>Inspired by La Casa de Papel</p>
      </div>
    </div>
  </footer>`;
}

// ===== CART FLOATING BUTTON HTML =====
function getCartButtonHTML() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return `
  <a href="${getPagePath('cart.html')}" class="cart-float-btn" title="Cart">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
    <span class="cart-badge" style="display:${count > 0 ? 'flex' : 'none'}">${count}</span>
  </a>`;
}

// ===== ADMIN SIDEBAR HTML =====
function getAdminSidebarHTML(activePage) {
  const links = [
    { href: 'admin-dashboard.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>', label: 'Dashboard' },
    { href: 'admin-products.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>', label: 'Products' },
    { href: 'admin-orders.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Orders' },
    { href: 'admin-users.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', label: 'Users' },
    { href: 'admin-reviews.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', label: 'Reviews' },
    { href: 'admin-coupons.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>', label: 'Coupons' },
    { href: 'admin-settings.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.15.34.23.71.23 1.1V12z"/></svg>', label: 'Settings' }
  ];
  return `
  <aside class="admin-sidebar">
    <div class="admin-sidebar-header"><h4>Admin Panel</h4></div>
    ${links.map(l => `<a href="${l.href}" class="sidebar-link ${activePage === l.href ? 'active' : ''}">${l.icon} ${l.label}</a>`).join('')}
    <div style="padding:20px;margin-top:auto;border-top:1px solid rgba(255,255,255,0.05)">
      <a href="${getRootPath('index.html')}" class="sidebar-link" style="color:var(--text-muted)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Back to Store
      </a>
    </div>
  </aside>`;
}

// ===== HELPER: FORMAT DATE =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ===== HELPER: STATUS BADGE =====
function statusBadge(status) {
  const colors = { processing: 'yellow', shipped: 'blue', delivered: 'green', cancelled: 'red', open: 'yellow', resolved: 'green', closed: 'red', pending: 'yellow', approved: 'green', rejected: 'red' };
  return `<span class="badge badge-${colors[status] || 'yellow'}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initTabs();
  initStarRating();
  updateCartBadge();
});
