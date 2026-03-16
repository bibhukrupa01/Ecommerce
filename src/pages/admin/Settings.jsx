import { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'DRIP YARD',
    storeEmail: 'support@dripyard.com',
    storeDesc: 'Premium streetwear inspired by Money Heist. Bold designs for the modern rebel.',
    freeShipThreshold: 100,
    flatShipping: 5.99,
    taxRate: 8.0,
    notifOrders: true,
    notifReviews: true,
    notifStock: false
  });

  useEffect(() => {
    // Load saved settings from localStorage if they exist
    const saved = localStorage.getItem('dripyard_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('dripyard_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure? This will delete ALL data (orders, users, products)!')) {
      localStorage.clear();
      alert('All local data has been reset. The app will now reload.');
      window.location.reload();
    }
  };

  return (
    <div className="admin-settings">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
        
        {/* Store Information */}
        <div className="glass p-6 rounded-lg">
          <h4 className="text-lg font-accent text-white mb-5 border-b border-white/10 pb-3">Store Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Store Name</label>
              <input 
                type="text" 
                name="storeName"
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                value={settings.storeName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Store Email</label>
              <input 
                type="email" 
                name="storeEmail"
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                value={settings.storeEmail}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Store Description</label>
            <textarea 
              name="storeDesc"
              rows="3"
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary resize-y" 
              value={settings.storeDesc}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="glass p-6 rounded-lg">
          <h4 className="text-lg font-accent text-white mb-5 border-b border-white/10 pb-3">Shipping & Tax</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Free Shipping Threshold ($)</label>
              <input 
                type="number" 
                name="freeShipThreshold"
                min="0"
                step="1"
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                value={settings.freeShipThreshold}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Flat Rate Shipping ($)</label>
              <input 
                type="number" 
                name="flatShipping"
                min="0"
                step="0.01"
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                value={settings.flatShipping}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Tax Rate (%)</label>
              <input 
                type="number" 
                name="taxRate"
                min="0"
                step="0.01"
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                value={settings.taxRate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass p-6 rounded-lg">
          <h4 className="text-lg font-accent text-white mb-5 border-b border-white/10 pb-3">Admin Notifications</h4>
          
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="notifOrders"
                className="w-4 h-4 accent-red-primary" 
                checked={settings.notifOrders}
                onChange={handleInputChange}
              />
              <span className="text-sm text-text-secondary">Email me on new orders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="notifReviews"
                className="w-4 h-4 accent-red-primary" 
                checked={settings.notifReviews}
                onChange={handleInputChange}
              />
              <span className="text-sm text-text-secondary">Email me on new customer reviews</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="notifStock"
                className="w-4 h-4 accent-red-primary" 
                checked={settings.notifStock}
                onChange={handleInputChange}
              />
              <span className="text-sm text-text-secondary">Low stock alerts</span>
            </label>
          </div>
        </div>

        <div className="flex justify-start pt-2 mb-6">
          <button type="submit" className="btn btn-primary px-8">Save Settings</button>
        </div>

        {/* Danger Zone */}
        <div className="glass p-6 rounded-lg border border-red-primary/30 bg-red-primary/5">
          <h4 className="text-lg font-accent text-red-primary mb-2">Danger Zone</h4>
          <p className="text-sm text-text-secondary mb-5">
            Reset all store data. This will clear all local orders, reviews, tickets, custom products, and user data.
          </p>
          <button 
            type="button" 
            className="btn py-2 px-4 border border-red-primary text-red-primary hover:bg-red-primary hover:text-white transition-colors text-sm rounded bg-transparent"
            onClick={handleResetData}
          >
            Reset All Data
          </button>
        </div>
      </form>
    </div>
  );
}
