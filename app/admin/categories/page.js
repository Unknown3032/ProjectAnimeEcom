'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/lib/hooks/useCategories';
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryList from '@/components/admin/CategoryList';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const { categories, loading, error, refetch, pagination } = useCategories({
    includeInactive: true,
    limit: 0, // Get all categories for admin
    search: searchTerm
  });

  // Reset selections when categories change
  useEffect(() => {
    setSelectedCategories([]);
  }, [categories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    const toastId = toast.loading('Deleting category...');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Category deleted successfully', { id: toastId });
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete category', { id: toastId });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete category', { id: toastId });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCategories.length} category(ies)?`)) {
      return;
    }

    const toastId = toast.loading('Deleting categories...');

    try {
      const response = await fetch(`/api/categories?ids=${selectedCategories.join(',')}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${result.deletedCount} category(ies) deleted successfully`, { id: toastId });
        setSelectedCategories([]);
        setShowBulkActions(false);
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete categories', { id: toastId });
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete categories', { id: toastId });
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }

    const toastId = toast.loading(`Processing ${action}...`);

    try {
      const response = await fetch('/api/categories/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ids: selectedCategories
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${result.affected} category(ies) updated successfully`, { id: toastId });
        setSelectedCategories([]);
        setShowBulkActions(false);
        refetch();
      } else {
        toast.error(result.error || 'Bulk action failed', { id: toastId });
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Bulk action failed', { id: toastId });
    }
  };

  const handleToggleStatus = async (categoryId, field) => {
    const toastId = toast.loading('Updating status...');

    try {
      const response = await fetch(`/api/categories/${categoryId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Status updated successfully', { id: toastId });
        refetch();
      } else {
        toast.error(result.error || 'Failed to update status', { id: toastId });
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat._id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your product categories and subcategories
          </p>
          {pagination.total > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Total: {pagination.total} categories
            </p>
          )}
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Bulk Actions ({selectedCategories.length})
              </button>
            )}
            
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Category
            </button>
          </div>
        </div>

        {/* Bulk Actions Menu */}
        {showBulkActions && selectedCategories.length > 0 && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Set as Featured
              </button>
              <button
                onClick={() => handleBulkAction('unfeature')}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Remove Featured
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setShowBulkActions(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-gray-500">Loading categories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-medium">Error loading categories</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <CategoryList
            categories={categories}
            selectedCategories={selectedCategories}
            onSelect={handleSelectCategory}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Category Form Modal */}
        {showForm && (
          <CategoryForm
            category={editingCategory}
            categories={categories}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
}