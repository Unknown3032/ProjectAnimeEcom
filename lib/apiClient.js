'use client';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user._id || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Base fetch wrapper
const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    console.error('❌ No authentication token found');
    throw new Error('No authentication token found. Please sign in.');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  console.log('📤 API Request:', {
    endpoint,
    method: config.method || 'GET',
    hasToken: !!token
  });

  try {
    const response = await fetch(endpoint, config);
    
    console.log('📥 API Response:', {
      endpoint,
      status: response.status,
      ok: response.ok
    });

    // Handle blob responses (for exports)
    if (options.responseType === 'blob') {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
      }
      return await response.blob();
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', {
      endpoint,
      message: error.message
    });
    
    // Handle auth errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      if (typeof window !== 'undefined') {
        alert('Your session has expired. Please sign in again.');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
    
    throw error;
  }
};

// Customer API methods
export const customerAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/admin/customers${queryString ? `?${queryString}` : ''}`;
    return apiClient(url);
  },

  getById: (id) => {
    if (!id) throw new Error('Customer ID is required');
    return apiClient(`/api/admin/customers/${id}`);
  },

  update: (id, data) => {
    if (!id) throw new Error('Customer ID is required');
    return apiClient(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: (id) => {
    if (!id) throw new Error('Customer ID is required');
    return apiClient(`/api/admin/customers/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: () => {
    return apiClient('/api/admin/customers/stats');
  },

  getAnalytics: (period = '30d') => {
    return apiClient(`/api/admin/customers/analytics?period=${period}`);
  },

  export: (format = 'csv') => {
    return apiClient(`/api/admin/customers/export?format=${format}`, {
      responseType: 'blob',
    });
  },

  sendEmail: (data) => {
    return apiClient('/api/admin/customers/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCustomerOrders: (customerId, params = {}) => {
    if (!customerId) throw new Error('Customer ID is required');
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/admin/customers/${customerId}/orders${queryString ? `?${queryString}` : ''}`;
    return apiClient(url);
  },

  getCustomerActivity: (customerId, params = {}) => {
    if (!customerId) throw new Error('Customer ID is required');
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/admin/customers/${customerId}/activity${queryString ? `?${queryString}` : ''}`;
    return apiClient(url);
  },
};

export default apiClient;