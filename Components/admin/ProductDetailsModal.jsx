'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ProductDetailsModal = ({ product, onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(modalRef.current, {
        opacity: 0,
        duration: 0.3,
      });

      gsap.from(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onClose,
    });
  };

  const getStockBadge = (status) => {
    const badges = {
      'in-stock': { class: 'bg-black text-white', label: 'In Stock' },
      'low-stock': { class: 'bg-black/60 text-white', label: 'Low Stock' },
      'out-of-stock': { class: 'bg-black/20 text-black/60', label: 'Out of Stock' },
    };
    return badges[status];
  };

  const badge = getStockBadge(product.status);

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-black/5 to-black/10 rounded-xl flex items-center justify-center text-4xl">
                {product.image}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">{product.name}</h2>
                <p className="text-sm text-black/50">{product.sku}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                    {badge.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/10 text-black">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center group"
            >
              <span className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-black/5">
          <div className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-black/40 hover:text-black/60'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Pricing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-black">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-black">${(product.price * product.sales).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Description</h3>
                <p className="text-sm text-black/60 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Total Sales</p>
                  <p className="text-xl font-bold text-black">{product.sales}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Rating</p>
                  <p className="text-xl font-bold text-black">⭐ {product.rating}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Stock Level</p>
                  <p className="text-xl font-bold text-black">{product.stock}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Stock Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Current Stock</span>
                    <span className="text-lg font-bold text-black">{product.stock} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Reorder Level</span>
                    <span className="text-sm font-semibold text-black">20 units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Last Restock</span>
                    <span className="text-sm text-black/60">Jan 15, 2024</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
                    Add Stock
                  </button>
                  <button className="flex-1 px-4 py-2 bg-black/10 text-black rounded-lg text-sm font-medium hover:bg-black/20 transition-colors">
                    Adjust Stock
                  </button>
                </div>
              </div>

              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Stock History</h3>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 15, 2024', action: 'Stock Added', quantity: '+50', type: 'increase' },
                    { date: 'Jan 10, 2024', action: 'Sale', quantity: '-5', type: 'decrease' },
                    { date: 'Jan 08, 2024', action: 'Sale', quantity: '-3', type: 'decrease' },
                  ].map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-black">{record.action}</p>
                        <p className="text-xs text-black/50">{record.date}</p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        record.type === 'increase' ? 'text-black' : 'text-black/60'
                      }`}>
                        {record.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 rounded-xl p-6">
                  <p className="text-xs text-black/50 mb-2">Views</p>
                  <p className="text-2xl font-bold text-black mb-2">2,847</p>
                  <p className="text-xs text-black/40">+12.5% this month</p>
                </div>
                <div className="bg-black/5 rounded-xl p-6">
                  <p className="text-xs text-black/50 mb-2">Conversion Rate</p>
                  <p className="text-2xl font-bold text-black mb-2">8.2%</p>
                  <p className="text-xs text-black/40">+2.1% vs last month</p>
                </div>
              </div>

              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Sales Trend</h3>
                <div className="space-y-3">
                  {[
                    { period: 'This Week', sales: 42, revenue: 3780 },
                    { period: 'Last Week', sales: 38, revenue: 3420 },
                    { period: 'This Month', sales: 168, revenue: 15120 },
                  ].map((trend, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-black/60">{trend.period}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-black">{trend.sales} sales</p>
                        <p className="text-xs text-black/50">${trend.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 flex items-center gap-3">
          <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all duration-300">
            Edit Product
          </button>
          <button className="flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300">
            Duplicate
          </button>
          <button className="px-6 py-3 bg-red-500/10 text-red-600 rounded-xl font-medium hover:bg-red-500/20 transition-all duration-300">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;