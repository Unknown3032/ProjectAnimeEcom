'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '../../../Components/admin/DashboardHeader';
import CustomersTable from '../../../Components/admin/CustomersTable';
import CustomersStats from '../../../Components/admin/CustomersStats';
import CustomersFilters from '../../../Components/admin/CustomersFilters';
import CustomersAnalytics from '../../../Components/admin/CustomersAnalytics';
import { customerAPI } from "@/lib/apiClient";

export default function CustomersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [filters, setFilters] = useState({
    segment: 'all',
    search: '',
    dateRange: 'all',
    sortBy: 'recent'
  });
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    if (!isAdmin()) {
      router.replace('/');
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [router]);

  const handleExport = async () => {
    try {
      const blob = await customerAPI.export('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export customers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
      <DashboardHeader />
      
      <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              Customers Management
            </h1>
            <p className="text-sm md:text-base text-black/50">
              Manage and engage with your customer base
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="bg-black/5 text-black px-6 py-3 rounded-xl font-medium hover:bg-black/10 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>📊</span>
              <span>Export Data</span>
            </button>
            
            <button 
              onClick={() => setShowEmailModal(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 group"
            >
              <span>✉️</span>
              <span>Send Email</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <CustomersStats />

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomersAnalytics />
          </div>
          <div>
            <TopCustomers />
          </div>
        </div>

        {/* Filters */}
        <CustomersFilters 
          onFilterChange={setFilters}
        />

        {/* Customers Table */}
        <CustomersTable 
          filters={filters.segment}
          sortBy={filters.sortBy}
          searchQuery={filters.search}
          dateRange={filters.dateRange}
        />
      </main>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  );
}

// Top Customers Component with real data
function TopCustomers() {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopCustomers();
  }, []);

  const fetchTopCustomers = async () => {
    try {
      const response = await customerAPI.getAll({ 
        limit: 4, 
        sortBy: 'spending-high' 
      });
      setTopCustomers(response.customers);
    } catch (error) {
      console.error('Failed to fetch top customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <h3 className="text-xl font-bold text-black mb-6">Top Customers</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-black/10 rounded-full" />
              <div className="w-12 h-12 bg-black/10 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-black/10 rounded mb-2 w-3/4" />
                <div className="h-3 bg-black/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
      <h3 className="text-xl font-bold text-black mb-6">Top Customers</h3>
      
      <div className="space-y-4">
        {topCustomers.map((customer, index) => (
          <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            
            <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-2xl flex-shrink-0">
              <img className='w-full h-full rounded-full' src={customer?.avatar} alt="" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">{customer.name}</p>
              <p className="text-xs text-black/50">{customer.orders} orders</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-black">${customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
        View All Customers
      </button>
    </div>
  );
}

// Email Modal Component
function EmailModal({ onClose }) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    sendToAll: true,
    customerIds: []
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      await customerAPI.sendEmail(formData);
      alert('Email sent successfully!');
      onClose();
    } catch (error) {
      console.error('Send email error:', error);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Send Email to Customers</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Your message..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToAll"
              checked={formData.sendToAll}
              onChange={(e) => setFormData({ ...formData, sendToAll: e.target.checked })}
              className="w-4 h-4 rounded border-black/20"
            />
            <label htmlFor="sendToAll" className="text-sm text-black">
              Send to all active customers
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-black/5 rounded-xl font-medium hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}