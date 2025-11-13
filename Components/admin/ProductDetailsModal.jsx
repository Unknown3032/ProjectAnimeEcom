'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ProductDetailsModal = ({ product, onClose, onDelete, onUpdate }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [stockAmount, setStockAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      gsap.from(modalRef.current, {
        opacity: 0,
        duration: 0.3,
      });

      gsap.from(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    return () => {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      ctx.revert();
    };
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onClose,
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      alert('Product deleted successfully!');
      onDelete && onDelete(product._id);
      handleClose();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (operation) => {
    if (stockAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product._id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: stockAmount,
          operation: operation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      const data = await response.json();
      alert(`Stock ${operation === 'increase' ? 'added' : 'removed'} successfully!`);
      onUpdate && onUpdate(data.product);
      setStockAmount(0);
    } catch (error) {
      console.error('Stock update error:', error);
      alert('Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
  setLoading(true);
  const loadingToast = toast ? toast.loading('Duplicating product...') : null;
  
  try {
    console.log('Duplicating product:', product._id);
    
    const response = await fetch(`/api/admin/products/${product._id}/duplicate`, {
      method: 'POST',
    });

    console.log('Duplicate response status:', response.status);

    const data = await response.json();
    console.log('Duplicate response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to duplicate product');
    }

    if (loadingToast && toast) {
      toast.dismiss(loadingToast);
      toast.success(data.message || 'Product duplicated successfully!');
    } else {
      alert(data.message || 'Product duplicated successfully!');
    }
    
    handleClose();
    
    // Redirect to edit the new product
    setTimeout(() => {
      router.push(`/admin/products/edit/${data.product._id}`);
    }, 500);
  } catch (error) {
    console.error('Duplicate error:', error);
    
    if (loadingToast && toast) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to duplicate product');
    } else {
      alert(error.message || 'Failed to duplicate product. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  // Safe stock badge getter with default values
  const getStockBadge = () => {
    const stock = product?.stock ?? 0;
    
    if (stock === 0) {
      return { class: 'bg-red-500 text-white', label: 'Out of Stock' };
    }
    if (stock < 10) {
      return { class: 'bg-yellow-500 text-white', label: 'Low Stock' };
    }
    return { class: 'bg-green-500 text-white', label: 'In Stock' };
  };

  const badge = getStockBadge();

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
      style={{ margin: 0, padding: '1rem' }}
    >
      <div
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-black/60">Processing...</p>
            </div>
          </div>
        )}

        {/* Header - Fixed */}
        <div className="p-6 border-b border-black/5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-black/5 to-black/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {product?.images && product.images.length > 0 ? (
                  <img 
                    src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || product.images[0]} 
                    alt={product?.name || 'Product'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-4xl">📦</span>';
                    }}
                  />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-black mb-1 truncate">{product?.name || 'Product'}</h2>
                <p className="text-sm text-black/50">{product?.sku || 'N/A'}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                    {badge.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/10 text-black">
                    {product?.category || 'Uncategorized'}
                  </span>
                  {product?.isOfficial && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      Official
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center group flex-shrink-0"
              disabled={loading}
            >
              <span className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
            </button>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="border-b border-black/5 flex-shrink-0">
          <div className="flex px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-black/40 hover:text-black/60'
                }`}
                disabled={loading}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Pricing Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-black">
                      {product?.currency || '$'} {product?.price || '0.00'}
                    </p>
                  </div>
                  {product?.originalPrice && product.originalPrice > product.price && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Original Price</p>
                      <p className="text-lg font-semibold text-black/60 line-through">
                        {product?.currency || '$'} {product.originalPrice}
                      </p>
                    </div>
                  )}
                  {product?.discount > 0 && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Discount</p>
                      <p className="text-2xl font-bold text-green-600">{product.discount}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-black/50 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-black">
                      {product?.currency || '$'} {((product?.price || 0) * (product?.purchases || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anime Info */}
              {product?.anime?.name && (
                <div className="bg-black/5 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-black mb-4">Anime Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-black/50 mb-1">Anime Name</p>
                      <p className="text-sm font-medium text-black">{product.anime.name}</p>
                    </div>
                    {product.anime.character && (
                      <div>
                        <p className="text-xs text-black/50 mb-1">Character</p>
                        <p className="text-sm font-medium text-black">{product.anime.character}</p>
                      </div>
                    )}
                    {product.anime.series && (
                      <div>
                        <p className="text-xs text-black/50 mb-1">Series</p>
                        <p className="text-sm font-medium text-black">{product.anime.series}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Description</h3>
                <p className="text-sm text-black/60 leading-relaxed whitespace-pre-wrap">
                  {product?.description || 'No description available'}
                </p>
                {product?.shortDescription && (
                  <p className="text-sm text-black/40 leading-relaxed mt-2 italic">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Total Sales</p>
                  <p className="text-xl font-bold text-black">{product?.purchases || 0}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Rating</p>
                  <p className="text-xl font-bold text-black">
                    ⭐ {product?.rating?.average?.toFixed(1) || 'N/A'}
                  </p>
                  <p className="text-xs text-black/40">({product?.rating?.count || 0} reviews)</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Stock Level</p>
                  <p className="text-xl font-bold text-black">{product?.stock ?? 0}</p>
                </div>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-xs text-black/50 mb-2">Views</p>
                  <p className="text-xl font-bold text-black">{product?.views || 0}</p>
                </div>
              </div>

              {/* Brand & Licensing */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Brand & Licensing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Brand</p>
                    <p className="text-sm font-medium text-black">{product?.brand || 'N/A'}</p>
                  </div>
                  {product?.manufacturer && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Manufacturer</p>
                      <p className="text-sm font-medium text-black">{product.manufacturer}</p>
                    </div>
                  )}
                  {product?.licensedBy && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Licensed By</p>
                      <p className="text-sm font-medium text-black">{product.licensedBy}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-black/50 mb-1">Age Rating</p>
                    <p className="text-sm font-medium text-black">{product?.ageRating || 'All Ages'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Stock Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Current Stock</span>
                    <span className="text-lg font-bold text-black">{product?.stock ?? 0} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <input
                    type="number"
                    min="1"
                    value={stockAmount}
                    onChange={(e) => setStockAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                    disabled={loading}
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStockUpdate('increase')}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
                      disabled={loading || stockAmount <= 0}
                    >
                      Add Stock
                    </button>
                    <button 
                      onClick={() => handleStockUpdate('decrease')}
                      className="flex-1 px-4 py-2 bg-black/10 text-black rounded-lg text-sm font-medium hover:bg-black/20 transition-colors disabled:opacity-50"
                      disabled={loading || stockAmount <= 0}
                    >
                      Remove Stock
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {product?.shipping && (
                <div className="bg-black/5 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-black mb-4">Shipping Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/60">Weight</span>
                      <span className="text-sm font-medium text-black">{product.shipping.weight || 0} kg</span>
                    </div>
                    {product.shipping.dimensions && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-black/60">Dimensions</span>
                        <span className="text-sm font-medium text-black">
                          {product.shipping.dimensions.length || 0} × {product.shipping.dimensions.width || 0} × {product.shipping.dimensions.height || 0} cm
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/60">Free Shipping</span>
                      <span className="text-sm font-medium text-black">
                        {product.shipping.freeShipping ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 rounded-xl p-6">
                  <p className="text-xs text-black/50 mb-2">Total Views</p>
                  <p className="text-2xl font-bold text-black mb-2">{product?.views || 0}</p>
                  <p className="text-xs text-black/40">All time</p>
                </div>
                <div className="bg-black/5 rounded-xl p-6">
                  <p className="text-xs text-black/50 mb-2">Wishlist Count</p>
                  <p className="text-2xl font-bold text-black mb-2">{product?.wishlistCount || 0}</p>
                  <p className="text-xs text-black/40">Users saved</p>
                </div>
              </div>

              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Sales Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Total Purchases</span>
                    <span className="text-lg font-bold text-black">{product?.purchases || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Total Revenue</span>
                    <span className="text-lg font-bold text-black">
                      {product?.currency || '$'} {((product?.purchases || 0) * (product?.price || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Average Rating</span>
                    <span className="text-lg font-bold text-black">
                      ⭐ {product?.rating?.average?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Status */}
              <div className="bg-black/5 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-4">Product Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Status</span>
                    <span className="text-sm font-medium text-black capitalize">{product?.status || 'draft'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Featured</span>
                    <span className="text-sm font-medium text-black">{product?.isFeatured ? '✅' : '❌'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">New Arrival</span>
                    <span className="text-sm font-medium text-black">{product?.isNewArrival ? '✅' : '❌'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60">Bestseller</span>
                    <span className="text-sm font-medium text-black">{product?.isBestseller ? '✅' : '❌'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-black/5 flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
            className="w-full sm:flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            Edit Product
          </button>
          <button 
            onClick={handleDuplicate}
            className="w-full sm:flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            Duplicate
          </button>
          <button 
            onClick={handleDelete}
            className="w-full sm:w-auto px-6 py-3 bg-red-500/10 text-red-600 rounded-xl font-medium hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;