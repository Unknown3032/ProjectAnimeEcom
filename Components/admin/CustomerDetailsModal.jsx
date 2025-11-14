'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { customerAPI } from "@/lib/apiClient";
import axios from 'axios';

const CustomerDetailsModal = ({ customer: initialCustomer, onClose, onUpdate }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [customer, setCustomer] = useState(initialCustomer);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    isActive: customer?.isActive ?? true,
  });

  // Send email state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);

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

    // Fetch full customer details
    fetchCustomerDetails();

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    } else if (activeTab === 'activity' && activities.length === 0) {
      fetchActivity();
    }
  }, [activeTab]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getById(customer.id);
      setCustomer(response.customer);
      setFormData({
        firstName: response.customer.firstName || '',
        lastName: response.customer.lastName || '',
        email: response.customer.email || '',
        phone: response.customer.phone || '',
        isActive: response.customer.isActive ?? true,
      });
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await customerAPI.getCustomerOrders(customer.id);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      setActivitiesLoading(true);
      const response = await customerAPI.getCustomerActivity(customer.id);
      setActivities(response.activities || []);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

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

  const handleSave = async () => {
    try {
      setSaving(true);
      await customerAPI.update(customer.id, formData);
      
      // Refresh customer data
      await fetchCustomerDetails();
      
      setIsEditing(false);
      if (onUpdate) onUpdate();
      
      // Show success message
      alert('Customer updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.error || 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      alert('Please fill in subject and message');
      return;
    }

    try {
      setSendingEmail(true);
      await customerAPI.sendEmail({
        customerIds: [customer.id],
        subject: emailData.subject,
        message: emailData.message,
        sendToAll: false
      });
      
      alert('Email sent successfully!');
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
    } catch (error) {
      console.error('Send email error:', error);
      alert(error.error || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      vip: { class: 'bg-black text-white', label: 'VIP Customer' },
      active: { class: 'bg-black/80 text-white', label: 'Active' },
      new: { class: 'bg-black/60 text-white', label: 'New Customer' },
      inactive: { class: 'bg-black/20 text-black/60', label: 'Inactive' },
    };
    return badges[status] || badges.active;
  };

  const getOrderStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-yellow-500 text-white', label: 'Pending' },
      processing: { class: 'bg-blue-500 text-white', label: 'Processing' },
      shipped: { class: 'bg-purple-500 text-white', label: 'Shipped' },
      delivered: { class: 'bg-green-500 text-white', label: 'Delivered' },
      cancelled: { class: 'bg-red-500 text-white', label: 'Cancelled' },
    };
    return badges[status] || badges.pending;
  };

  const badge = getStatusBadge(customer?.status);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
  ];

  if (loading) {
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl p-12">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40">Loading customer details...</p>
        </div>
      </div>
    );
  }

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
              <img src={customer?.avatar } alt="" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First Name"
                        className="px-3 py-1 border border-black/10 rounded-lg text-lg font-bold"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="px-3 py-1 border border-black/10 rounded-lg text-lg font-bold"
                      />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-1 border border-black/10 rounded-lg text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-black mb-1">
                      {customer?.firstName} {customer?.lastName}
                    </h2>
                    <p className="text-sm text-black/50 mb-2">{customer?.email}</p>
                  </>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                    {badge.label}
                  </span>
                  {customer?.joinedDate && (
                    <span className="text-xs text-black/40">
                      Member since {new Date(customer.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: customer.firstName || '',
                        lastName: customer.lastName || '',
                        email: customer.email || '',
                        phone: customer.phone || '',
                        isActive: customer.isActive ?? true,
                      });
                    }}
                    className="px-4 py-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : null}
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center group"
              >
                <span className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
              </button>
            </div>
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
                  <p className="text-2xl font-bold text-black">{customer?.orders?.length || 0}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-black">
                    ${(customer?.totalSpent || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-black">
                    ${customer?.orders?.length > 0 
                      ? ((customer?.totalSpent || 0) / customer.orders.length).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-1">Loyalty Points</p>
                  <p className="text-2xl font-bold text-black">{customer?.loyaltyPoints || 0}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Contact Information</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-black/50 block mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-black/10 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isActive" className="text-sm text-black">
                        Active Account
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-black/50">Email:</span>
                      <span className="text-sm font-medium text-black">{customer?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black/50">Phone:</span>
                      <span className="text-sm font-medium text-black">{customer?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black/50">Location:</span>
                      <span className="text-sm font-medium text-black">{customer?.location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black/50">Account Status:</span>
                      <span className={`text-sm font-medium ${customer?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {customer?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses */}
              {customer?.addresses && customer.addresses.length > 0 && (
                <div className="bg-black/5 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-black mb-4">Addresses</h3>
                  <div className="space-y-3">
                    {customer.addresses.map((address, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium px-2 py-1 bg-black/10 rounded capitalize">
                            {address.addressType}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs font-medium px-2 py-1 bg-black text-white rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-black font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-black/60">
                          {address.street}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-sm text-black/60">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-black/60">{address.country}</p>
                        <p className="text-sm text-black/60 mt-1">{address.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {customer?.wishlist && customer.wishlist.length > 0 && (
                <div className="bg-black/5 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-black mb-4">
                    Wishlist ({customer.wishlist.length} items)
                  </h3>
                  <div className="space-y-2">
                    {customer.wishlist.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-black">
                          {item.product?.name || 'Product'}
                        </span>
                        <span className="text-xs text-black/40">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity Summary */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {customer?.lastOrder && (
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
                  )}
                  {customer?.lastLogin && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black/60">Last Login:</span>
                      <span className="text-sm font-semibold text-black">
                        {new Date(customer.lastLogin).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-black">Order History</h3>
                {orders.length > 0 && (
                  <span className="text-xs text-black/50">{orders.length} total orders</span>
                )}
              </div>
              
              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-black/40">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-black/40">No orders yet</p>
                </div>
              ) : (
                orders.map((order) => {
                  const orderBadge = getOrderStatusBadge(order.status);
                  return (
                    <div key={order.id} className="bg-black/5 rounded-xl p-4 hover:bg-black/10 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-black">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderBadge.class}`}>
                          {orderBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="text-black/60">
                          <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(order.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <span className="font-bold text-black">${order.total.toFixed(2)}</span>
                      </div>
                      {order.products && order.products.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-black/10">
                          <p className="text-xs text-black/50 mb-1">Products:</p>
                          {order.products.map((product, idx) => (
                            <p key={idx} className="text-xs text-black/60">
                              • {product.name} x{product.quantity} - ${product.price?.toFixed(2)}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black mb-4">Activity Timeline</h3>
              
              {activitiesLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-black/40">Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-black/40">No activity yet</p>
                </div>
              ) : (
                activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-black/5 last:border-0">
                    <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-black font-medium">{activity.text}</p>
                      <p className="text-xs text-black/40 mt-1">{activity.timeAgo}</p>
                      {activity.data && (
                        <div className="mt-1 text-xs text-black/60">
                          {activity.data.total && <span>Total: ${activity.data.total.toFixed(2)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 flex items-center gap-3">
          <button 
            onClick={() => setShowEmailModal(true)}
            className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all duration-300"
          >
            Send Email
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className="flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300"
          >
            View All Orders
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300"
          >
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowEmailModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-black mb-4">Send Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Your message..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
                >
                  {sendingEmail ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsModal;