import { useState, useEffect } from 'react';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '0',
    maxUses: '',
    expiresAt: ''
  });

  useEffect(() => {
    const storedCoupons = JSON.parse(localStorage.getItem('dripyard_coupons') || '[]');
    setCoupons(storedCoupons);
  }, []);

  const saveCoupons = (newCoupons) => {
    setCoupons(newCoupons);
    localStorage.setItem('dripyard_coupons', JSON.stringify(newCoupons));
  };

  const handleInputChange = (e) => {
    // Force uppercase for coupon codes
    const value = e.target.name === 'code' ? e.target.value.toUpperCase() : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    
    const newCoupon = {
      id: Date.now(),
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      minOrder: parseFloat(formData.minOrder) || 0,
      maxUses: formData.maxUses ? parseInt(formData.maxUses, 10) : null,
      usedCount: 0,
      expiresAt: formData.expiresAt,
      active: true
    };

    saveCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setFormData({ code: '', type: 'percentage', value: '', minOrder: '0', maxUses: '', expiresAt: '' });
    alert('Coupon created successfully!');
  };

  const deleteCoupon = (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      const filtered = coupons.filter(c => c.id !== id);
      saveCoupons(filtered);
      alert('Coupon deleted.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-coupons">
      <div className="glass p-6 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-accent text-white">Discount Coupons</h2>
          <button 
            className="btn btn-primary btn-sm px-4"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Coupon
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Code</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Discount</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Min Order</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Usage</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Expires</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Status</th>
                <th className="py-3 px-4 text-xs tracking-wider text-text-muted uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => {
                const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                const maxedOut = c.maxUses && c.usedCount >= c.maxUses;
                const active = c.active && !expired && !maxedOut;

                return (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-sm">
                      <code className="text-gold font-bold bg-gold/10 px-2.5 py-1 rounded inline-block tracking-widest">
                        {c.code}
                      </code>
                    </td>
                    <td className="py-4 px-4 text-sm text-white">
                      {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">${c.minOrder}</td>
                    <td className="py-4 px-4 text-sm text-text-secondary">
                      {c.usedCount}{c.maxUses ? `/${c.maxUses}` : '/∞'}
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary">{formatDate(c.expiresAt)}</td>
                    <td className="py-4 px-4 text-sm">
                      {active ? (
                        <span className="badge badge-green text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-red text-xs px-2 py-1 rounded bg-red-primary/20 text-red-primary border border-red-primary/30">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <button 
                        className="text-red-primary hover:text-white transition-colors text-xs"
                        onClick={() => deleteCoupon(c.id, c.code)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-text-muted border-b border-white/5">
                    No active discount coupons.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-xs text-text-muted">
          {coupons.length} coupons total
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="glass p-8 w-full max-w-[500px] rounded-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-accent text-white">Create Coupon</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Coupon Code</label>
                <input 
                  type="text" 
                  name="code"
                  placeholder="e.g. HEIST20"
                  className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary uppercase tracking-widest font-bold" 
                  value={formData.code}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Discount Type</label>
                  <select 
                    name="type"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary outline-none" 
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Discount Value</label>
                  <input 
                    type="number" 
                    name="value"
                    min="1"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.value}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Min Order ($)</label>
                  <input 
                    type="number" 
                    name="minOrder"
                    min="0"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.minOrder}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Max Uses</label>
                  <input 
                    type="number" 
                    name="maxUses"
                    min="1"
                    placeholder="Unlimited"
                    className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                    value={formData.maxUses}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-sm font-medium text-text-secondary">Expires At</label>
                <input 
                  type="date" 
                  name="expiresAt"
                  className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary w-full py-3">
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
