'use client';

import { useState } from 'react';

export default function CategoryList({ 
  categories, 
  selectedCategories = [],
  onSelect,
  onSelectAll,
  onEdit, 
  onDelete,
  onToggleStatus 
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const CategoryRow = ({ category, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);
    const isSelected = selectedCategories.includes(category._id);

    // Get primary image or first image from images array
    const categoryImage = category.images?.find(img => img.isPrimary)?.url || 
                         category.images?.[0]?.url || 
                         category.image || 
                         null;

    return (
      <>
        <tr className={`border-b border-gray-200 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
          {/* Checkbox */}
          <td className="px-6 py-4 w-12">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(category._id)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
          </td>

          {/* Category Info */}
          <td className="px-6 py-4">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <div className="flex items-center gap-3">
                {categoryImage ? (
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-category.jpg';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">/{category.slug}</div>
                  {category.tagline && (
                    <div className="text-xs text-gray-400 italic mt-1">{category.tagline}</div>
                  )}
                </div>
              </div>
            </div>
          </td>
          
          {/* Description */}
          <td className="px-6 py-4 max-w-xs">
            {category.description ? (
              <span className="text-sm text-gray-600 line-clamp-2">{category.description}</span>
            ) : (
              <span className="text-gray-400 italic text-sm">No description</span>
            )}
          </td>

          {/* Parent */}
          <td className="px-6 py-4 text-sm text-gray-600">
            {category.parent ? (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {category.parent.name}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">Root</span>
            )}
          </td>

          {/* Subcategories Count */}
          <td className="px-6 py-4 text-center">
            <span className="text-sm text-gray-600 font-medium">
              {category.children?.length || 0}
            </span>
          </td>

          {/* Order */}
          <td className="px-6 py-4 text-center">
            <span className="text-sm text-gray-600">{category.order}</span>
          </td>

          {/* Status */}
          <td className="px-6 py-4">
            <div className="flex flex-col gap-2">
              {/* Active Status */}
              <button
                onClick={() => onToggleStatus(category._id, 'isActive')}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.isActive ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Inactive
                  </>
                )}
              </button>

              {/* Featured Status */}
              {category.isFeatured && (
                <button
                  onClick={() => onToggleStatus(category._id, 'isFeatured')}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </button>
              )}
            </div>
          </td>

          {/* Actions */}
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(category._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
                disabled={category.children && category.children.length > 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && category.children.map(child => (
          <CategoryRow key={child._id} category={child} level={level + 1} />
        ))}
      </>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-500 text-sm">Get started by creating your first category</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcategories
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <CategoryRow key={category._id} category={category} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}