'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AddressesSection = () => {
  const containerRef = useRef(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      label: 'Home',
      name: 'Sakura Tanaka',
      street: '123 Sakura Street',
      city: 'Tokyo',
      state: 'Kanto',
      zipCode: '100-0001',
      country: 'Japan',
      phone: '+81 90-1234-5678',
      isDefault: true,
    },
    {
      id: 2,
      type: 'work',
      label: 'Work',
      name: 'Sakura Tanaka',
      street: '456 Business Avenue',
      city: 'Tokyo',
      state: 'Kanto',
      zipCode: '100-0002',
      country: 'Japan',
      phone: '+81 90-1234-5678',
      isDefault: false,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black mb-1">Saved Addresses</h2>
            <p className="text-sm text-black/50">Manage your delivery addresses</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2"
          >
            <span>+</span>
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
          <h3 className="text-xl font-bold text-black mb-6">Add New Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Street Address</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">City</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">ZIP Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
              Save Address
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
              address.isDefault
                ? 'border-black ring-2 ring-black/10'
                : 'border-black/5 hover:border-black/20'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-black">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-black/60">{address.name}</p>
              </div>
              <span className="text-2xl">
                {address.type === 'home' ? '🏠' : '🏢'}
              </span>
            </div>

            {/* Address Details */}
            <div className="space-y-1 mb-4 text-sm text-black/60">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
              <p className="font-medium text-black">{address.phone}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-black/5">
              <button className="flex-1 px-4 py-2 bg-black/5 text-black rounded-lg text-sm font-medium hover:bg-black/10 transition-all">
                Edit
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-all"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesSection;