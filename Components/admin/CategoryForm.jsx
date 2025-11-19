'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CategoryForm({ category, categories, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    tagline: '',
    image: '',
    parent: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        tagline: category.tagline || '',
        image: category.image || '',
        parent: category.parent?._id || '',
        isActive: category.isActive ?? true,
        isFeatured: category.isFeatured || false,
        order: category.order || 0,
      });
      setImages(category.images || []);
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name' && !category) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleAddImage = () => {
    setImages(prev => [...prev, { url: '', alt: '', isPrimary: prev.length === 0 }]);
  };

  const handleImageChange = (index, field, value) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = { ...newImages[index], [field]: value };
      
      // If setting as primary, unset others
      if (field === 'isPrimary' && value) {
        newImages.forEach((img, i) => {
          if (i !== index) img.isPrimary = false;
        });
      }
      
      return newImages;
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = category 
        ? `/api/categories/${category._id}`
        : '/api/categories';
      
      const method = category ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        images: images.filter(img => img.url), // Only include images with URLs
        parent: formData.parent || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(category ? 'Category updated successfully' : 'Category created successfully');
        onSuccess();
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Filter out current category and its descendants from parent options
  const availableParents = categories.filter(cat => {
    if (category && cat._id === category._id) return false;
    // Add logic to filter descendants if needed
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Anime Figures"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., anime-figures"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version (auto-generated from name)
            </p>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Short catchy phrase"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Detailed description of this category"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-category.jpg';
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-sm text-black hover:underline"
              >
                + Add Image
              </button>
            </div>
            
            {images.map((img, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={img.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Image description"
                    />
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={img.isPrimary}
                      onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                      className="mr-2"
                    />
                    Set as primary image
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {img.url && (
                  <div className="mt-2">
                    <img
                      src={img.url}
                      alt={img.alt || 'Preview'}
                      className="h-24 w-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-category.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">None (Root Category)</option>
              {availableParents.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Category</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}