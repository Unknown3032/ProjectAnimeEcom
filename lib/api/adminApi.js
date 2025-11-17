const API_BASE = '/api/admin/dashboard';

async function fetchAPI(endpoint, options = {}) {
  if (typeof window === 'undefined') {
    throw new Error('API calls can only be made from the client side');
  }

  // Get user ID from localStorage (your auth system)
  const userStr = localStorage.getItem('user');
  let userId = null;
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId = user._id;
    } catch (e) {
      console.error('Failed to parse user:', e);
    }
  }

  if (!userId) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userId}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Redirect to login
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
    const errorData = await response.json()
    console.log(errorData);
    
    // .catch(() => ({}));
    // throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const adminAPI = {
  // Get dashboard stats
  getStats: () => fetchAPI('/stats'),

  // Get sales data
  getSalesData: (period = '30d') => fetchAPI(`/sales-data?period=${period}`),

  // Get orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/orders?${query}`);
  },

  // Get top products
  getTopProducts: (limit = 5, period = '30d') => 
    fetchAPI(`/products/top?limit=${limit}&period=${period}`),

  // Get analytics
  getAnalytics: () => fetchAPI('/analytics'),

  // Update order status
  updateOrderStatus: (orderId, status) =>
    fetchAPI(`/orders`, {
      method: 'PATCH',
      body: JSON.stringify({ orderId, status }),
    }),
};

export default adminAPI;