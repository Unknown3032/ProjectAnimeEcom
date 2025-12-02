// components/admin/AnimeForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Thriller'
];

export default function AnimeForm({ anime, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    japaneseName: '',
    englishName: '',
    description: '',
    image: '',
    banner: '',
    genre: [],
    studio: '',
    releaseYear: new Date().getFullYear(),
    status: 'Ongoing',
    episodes: 0,
    rating: 0,
  });

  useEffect(() => {
    if (anime) {
      setFormData({
        name: anime.name || '',
        japaneseName: anime.japaneseName || '',
        englishName: anime.englishName || '',
        description: anime.description || '',
        image: anime.image || '',
        banner: anime.banner || '',
        genre: anime.genre || [],
        studio: anime.studio || '',
        releaseYear: anime.releaseYear || new Date().getFullYear(),
        status: anime.status || 'Ongoing',
        episodes: anime.episodes || 0,
        rating: anime.rating || 0,
      });
    }
  }, [anime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.image) {
      toast.error('Name and image are required');
      return;
    }

    setLoading(true);

    try {
      const url = anime 
        ? `/api/anime/${anime._id}` 
        : '/api/anime';
      
      const method = anime ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(anime ? 'Anime updated successfully' : 'Anime created successfully');
        onSuccess();
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save anime');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {anime ? 'Edit Anime' : 'Add New Anime'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Japanese Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Japanese Name
              </label>
              <input
                type="text"
                name="japaneseName"
                value={formData.japaneseName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                English Name
              </label>
              <input
                type="text"
                name="englishName"
                value={formData.englishName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Studio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Studio
              </label>
              <input
                type="text"
                name="studio"
                value={formData.studio}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Banner URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Banner URL
              </label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Release Year
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                min="1900"
                max="2100"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            {/* Episodes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Episodes
              </label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating (0-10)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              maxLength="2000"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* Genres */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Genres
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {GENRES.map(genre => (
                <label
                  key={genre}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="rounded w-4 h-4"
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Image Preview
              </label>
              <img
                src={formData.image}
                alt="Preview"
                className="w-48 h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Saving...' : anime ? 'Update Anime' : 'Add Anime'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}