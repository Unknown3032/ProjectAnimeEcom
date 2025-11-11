'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomerDetailsModal = ({ customer, onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  const getStatusBadge = (status) => {
    const badges = {
      vip: { class: 'bg-black text-white', label: 'VIP Customer' },
      active: { class: 'bg-black/80 text-white', label: 'Active' },
      new: { class: 'bg-black/60 text-white', label: 'New Customer' },
      inactive: { class: 'bg-black/20 text-black/60', label: 'Inactive' },
    };
    return badges[status];
  };

  const badge = getStatusBadge(customer.status);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
  ];

  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-20', items: 3, total: 245.99, status: 'delivered' },
    { id: 'ORD-002', date: '2024-01-15', items: 2, total: 159.98, status: 'delivered' },
    { id: 'ORD-003', date: '2024-01-10', items: 1, total: 89.99, status: 'shipped' },
  ];

  const activities = [
    { type: 'order', text: 'Placed order #ORD-001', time: '2 hours ago' },
    { type: 'review', text: 'Left a 5-star review', time: '1 day ago' },
    { type: 'login', text: 'Logged in to account', time: '2 days ago' },
    { type: 'wishlist', text: 'Added item to wishlist', time: '3 days ago' },
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
              <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center text-3xl">
                {customer.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">{customer.name}</h2>
                <p className="text-sm text-black/50 mb-2">{customer.email}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-black/40">
                    Member since {new Date(customer.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-black">{customer.orders}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-black">${customer.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-black">${(customer.totalSpent / customer.orders).toFixed(2)}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Loyalty Points</p>
                  <p className="text-2xl font-bold text-black">{customer.loyaltyPoints}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-black/50">Email:</span>
                    <span className="text-sm font-medium text-black">{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black/50">Phone:</span>
                    <span className="text-sm font-medium text-black">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black/50">Location:</span>
                    <span className="text-sm font-medium text-black">{customer.location}</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Summary */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black/60">Last Order:</span>
                    <span className="text-sm font-semibold text-black">
                      {new Date(customer.lastOrder).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black/60">Account Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black mb-4">Order History</h3>
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-black/5 rounded-xl p-4 hover:bg-black/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-black">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-black text-white' : 'bg-black/60 text-white'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-black/60">
                      <span>{order.items} items</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="font-bold text-black">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black mb-4">Activity Timeline</h3>
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-black">{activity.text}</p>
                    <p className="text-xs text-black/40 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 flex items-center gap-3">
          <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all duration-300">
            Send Email
          </button>
          <button className="flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300">
            View All Orders
          </button>
          <button className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;