import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Users from './pages/admin/Users';
import Reviews from './pages/admin/Reviews';
import Coupons from './pages/admin/Coupons';
import Settings from './pages/admin/Settings';

const Placeholder = ({ title }) => (
  <div className="container py-20 text-center min-h-[50vh] flex flex-col justify-center">
    <h1 className="text-4xl text-red-primary font-heading tracking-[4px] mb-4">{title}</h1>
    <p className="text-text-secondary">This page is part of the React migration and is built soon.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="product/:id" element={<Placeholder title="PRODUCT DETAILS" />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Placeholder title="MY WISHLIST" />} />
        <Route path="user-profile" element={<Placeholder title="USER PROFILE" />} />
        <Route path="my-orders" element={<Placeholder title="MY ORDERS" />} />
        <Route path="customer-reviews" element={<Placeholder title="REVIEWS" />} />
        <Route path="help-submission" element={<Placeholder title="SUPPORT" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      
      <Route path="/" element={<Layout minimal={true} />}>
        <Route path="checkout" element={<Placeholder title="CHECKOUT" />} />
        <Route path="payment-success" element={<Placeholder title="PAYMENT SUCCESS" />} />
      
      </Route>
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
