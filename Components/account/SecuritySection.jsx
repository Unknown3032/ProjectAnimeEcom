'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SecuritySection = () => {
  const containerRef = useRef(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Handle password change
    alert('Password updated successfully!');
    setShowPasswordForm(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <h2 className="text-2xl font-bold text-black mb-1">Security Settings</h2>
        <p className="text-sm text-black/50">Manage your account security</p>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-black mb-1">Password</h3>
            <p className="text-sm text-black/50">Last changed 30 days ago</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t border-black/5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-black mb-1">Two-Factor Authentication</h3>
            <p className="text-sm text-black/50">Add an extra layer of security</p>
          </div>
          <button className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all">
            Enable
          </button>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-4">Recent Login Activity</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on MacOS', location: 'Tokyo, Japan', time: '2 hours ago', current: true },
            { device: 'Safari on iPhone', location: 'Tokyo, Japan', time: '1 day ago', current: false },
            { device: 'Chrome on Windows', location: 'Osaka, Japan', time: '3 days ago', current: false },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
              <div>
                <p className="font-medium text-black text-sm">{activity.device}</p>
                <p className="text-xs text-black/50">{activity.location} • {activity.time}</p>
              </div>
              {activity.current && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full">Current</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;