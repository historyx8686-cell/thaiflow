const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getPosts({ city, category, search, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const res = await fetch(`${API_BASE}/posts?${params}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  async getCities() {
    const res = await fetch(`${API_BASE}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getShowcase({ city, search } = {}) {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/showcase?${params}`);
    if (!res.ok) throw new Error('Failed to fetch showcase');
    return res.json();
  },

  async getBanners({ category, city } = {}) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (city) params.append('city', city);

    const res = await fetch(`${API_BASE}/banners?${params}`);
    if (!res.ok) throw new Error('Failed to fetch banners');
    return res.json();
  },

  async addFavorite(tgUserId, postId) {
    const params = new URLSearchParams({ tg_user_id: tgUserId, post_id: postId });
    const res = await fetch(`${API_BASE}/favorites?${params}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to add favorite');
    return res.json();
  },

  async getFavorites(tgUserId) {
    const params = new URLSearchParams({ tg_user_id: tgUserId });
    const res = await fetch(`${API_BASE}/favorites?${params}`);
    if (!res.ok) throw new Error('Failed to fetch favorites');
    return res.json();
  },
};
