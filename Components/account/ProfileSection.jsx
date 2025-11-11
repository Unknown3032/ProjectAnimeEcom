'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ProfileSection = ({ user: initialUser, setUser }) => {
  const containerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialUser?.firstName || '',
    lastName: initialUser?.lastName || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser = { 
        ...initialUser, 
        ...formData, 
        fullName: `${formData.firstName} ${formData.lastName}` 
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Profile</h1>
          <p className="text-black/50">Manage your personal information</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2 group"
          >
            <span className="group-hover:rotate-12 transition-transform">✏️</span>
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3.5 rounded-xl border transition-all font-medium ${
                  isEditing
                    ? 'bg-white border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black'
                    : 'bg-black/5 border-black/5 text-black/60'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3.5 rounded-xl border transition-all font-medium ${
                  isEditing
                    ? 'bg-white border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black'
                    : 'bg-black/5 border-black/5 text-black/60'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3.5 rounded-xl border transition-all font-medium ${
                isEditing
                  ? 'bg-white border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black'
                  : 'bg-black/5 border-black/5 text-black/60'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3.5 rounded-xl border transition-all font-medium ${
                isEditing
                  ? 'bg-white border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black'
                  : 'bg-black/5 border-black/5 text-black/60'
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="px-6 md:px-8 py-4 bg-black/5 border-t border-black/10 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3.5 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={() => {
                setFormData({
                  firstName: initialUser?.firstName || '',
                  lastName: initialUser?.lastName || '',
                  email: initialUser?.email || '',
                  phone: initialUser?.phone || '',
                });
                setIsEditing(false);
              }}
              disabled={saving}
              className="flex-1 px-6 py-3.5 bg-white border border-black/10 text-black rounded-xl font-medium hover:bg-black/5 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📅</span>
            <span className="text-sm font-medium text-black/50">Member Since</span>
          </div>
          <p className="text-xl font-bold text-black">
            {new Date(initialUser?.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">✅</span>
            <span className="text-sm font-medium text-black/50">Status</span>
          </div>
          <p className="text-xl font-bold text-black">
            {initialUser?.isVerified ? 'Verified' : 'Unverified'}
          </p>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👤</span>
            <span className="text-sm font-medium text-black/50">Account Type</span>
          </div>
          <p className="text-xl font-bold text-black capitalize">
            {initialUser?.role || 'Customer'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;