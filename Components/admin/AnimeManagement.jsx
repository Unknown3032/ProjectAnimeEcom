// components/admin/AnimeManagement.jsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AnimeForm from './AnimeForm';
import AnimeList from './AnimeList';

export default function AnimeManagement() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    status: '',
    sortBy: '-popularity'
  });

  useEffect(() => {
    fetchAnimes();
  }, [page, filters]);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const response = await fetch(`/api/anime?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnimes(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch animes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAnime(null);
    setShowForm(true);
  };

  const handleEdit = (anime) => {
    setEditingAnime(anime);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this anime?')) return;

    try {
      const response = await fetch(`/api/anime/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Anime deleted successfully');
        fetchAnimes();
      } else {
        toast.error(data.error || 'Failed to delete anime');
      }
    } catch (error) {
      toast.error('Failed to delete anime');
      console.error(error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAnime(null);
    fetchAnimes();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Anime Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Anime
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search anime..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mecha">Mecha</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Slice of Life">Slice of Life</option>
            <option value="Sports">Sports</option>
            <option value="Supernatural">Supernatural</option>
            <option value="Thriller">Thriller</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-popularity">Most Popular</option>
            <option value="popularity">Least Popular</option>
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Anime Form Modal */}
      {showForm && (
        <AnimeForm
          anime={editingAnime}
          onClose={() => {
            setShowForm(false);
            setEditingAnime(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Anime List */}
      <AnimeList
        animes={animes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Previous
          </button>
          
          <span className="px-4 py-2">
            Page {page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}