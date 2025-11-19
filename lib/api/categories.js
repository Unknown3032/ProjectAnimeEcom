import axios from '@/lib/axios';

/**
 * Get all categories
 * @param {Object} options - Query options
 * @returns {Promise} Categories data
 */
export async function getCategories(options = {}) {
  try {
    const { 
      includeInactive = false,
      parent = null,
      featured = false,
      tree = false,
      search = '',
      limit = 0,
      page = 1
    } = options;

    const params = {};
    if (includeInactive) params.includeInactive = 'true';
    if (parent !== null) params.parent = parent;
    if (featured) params.featured = 'true';
    if (tree) params.tree = 'true';
    if (search) params.search = search;
    if (limit > 0) params.limit = limit;
    if (page > 1) params.page = page;

    const { data } = await axios.get('/api/categories', { params });
    return data;
  } catch (error) {
    console.error('Get categories error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch categories',
      message: error.response?.data?.message || error.message,
      data: [],
      total: 0
    };
  }
}

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @returns {Promise} Category data
 */
export async function getCategoryBySlug(slug) {
  try {
    const { data } = await axios.get(`/api/categories/${slug}`);
    return data;
  } catch (error) {
    console.error('Get category error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch category',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} Category data
 */
export async function getCategoryById(id) {
  try {
    const { data } = await axios.get(`/api/categories/${id}`);
    return data;
  } catch (error) {
    console.error('Get category error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch category',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Create new category
 * @param {Object} categoryData - Category data
 * @returns {Promise} Created category
 */
export async function createCategory(categoryData) {
  try {
    const { data } = await axios.post('/api/categories', categoryData);
    return data;
  } catch (error) {
    console.error('Create category error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to create category',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Update category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} Updated category
 */
export async function updateCategory(id, categoryData) {
  try {
    const { data } = await axios.put(`/api/categories/${id}`, categoryData);
    return data;
  } catch (error) {
    console.error('Update category error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update category',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Delete categories
 * @param {Array} ids - Array of category IDs
 * @returns {Promise} Delete result
 */
export async function deleteCategories(ids) {
  try {
    const { data } = await axios.delete('/api/categories', {
      params: { ids: ids.join(',') }
    });
    return data;
  } catch (error) {
    console.error('Delete categories error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to delete categories',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get category tree structure
 * @returns {Promise} Category tree
 */
export async function getCategoryTree() {
  try {
    const { data } = await axios.get('/api/categories', {
      params: { tree: 'true' }
    });
    return data;
  } catch (error) {
    console.error('Get category tree error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch category tree',
      data: [],
      total: 0
    };
  }
}