import axios from '@/lib/axios';

/**
 * Get all animes
 * @param {Object} options - Query options
 * @returns {Promise} Anime data
 */
export async function getAnimes(options = {}) {
  try {
    const { 
      limit = 0,
      active = true,
      sortBy = 'popularity'
    } = options;

    const params = new URLSearchParams();
    if (limit > 0) params.append('limit', limit.toString());
    if (active) params.append('active', 'true');
    params.append('sortBy', sortBy);

    const { data } = await axios.get(`/api/animes?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Get animes error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch animes',
      message: error.response?.data?.message || error.message,
      data: []
    };
  }
}

/**
 * Get anime by slug
 * @param {string} slug - Anime slug
 * @returns {Promise} Anime data
 */
export async function getAnimeBySlug(slug) {
  try {
    const { data } = await axios.get(`/api/animes/slug/${slug}`);
    return data;
  } catch (error) {
    console.error('Get anime by slug error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch anime'
    };
  }
}