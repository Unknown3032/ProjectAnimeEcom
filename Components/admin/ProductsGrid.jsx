'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import ProductDetailsModal from './ProductDetailsModal';

const ProductsGrid = ({ view = 'grid', filters = {} }) => {
  const gridRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Fetch products whenever filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: productsPerPage,
        ...filters,
      });

      // Handle stock filter
      if (filters.stock) {
        queryParams.delete('stock');
        if (filters.stock === 'in-stock') {
          queryParams.append('minStock', '10');
        } else if (filters.stock === 'low-stock') {
          queryParams.append('minStock', '1');
          queryParams.append('maxStock', '9');
        } else if (filters.stock === 'out-of-stock') {
          queryParams.append('maxStock', '0');
        }
      }

      const response = await fetch(`/api/admin/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    setTotalProducts((prev) => prev - 1);
    fetchProducts();
  };

  const handleUpdate = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setSelectedProduct(updatedProduct);
  };

  const getStockBadge = (product) => {
    if (product.stock === 0) {
      return { class: 'bg-red-500 text-white', label: 'Out of Stock' };
    }
    if (product.stock < 10) {
      return { class: 'bg-yellow-500 text-white', label: 'Low Stock' };
    }
    return { class: 'bg-green-500 text-white', label: 'In Stock' };
  };

  // Animate cards after loading
  useEffect(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      const ctx = gsap.context(() => {
        if (view === 'grid') {
          const cards = gridRef.current.querySelectorAll('.product-card');
          if (cards.length > 0) {
            // Set initial state
            gsap.set(cards, { opacity: 0, scale: 0.9 });
            // Animate to visible
            gsap.to(cards, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: 'power2.out',
              clearProps: 'all', // Clear all properties after animation
            });
          }
        } else {
          const rows = gridRef.current.querySelectorAll('.product-row');
          if (rows.length > 0) {
            // Set initial state
            gsap.set(rows, { opacity: 0, x: -30 });
            // Animate to visible
            gsap.to(rows, {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: 'power2.out',
              clearProps: 'all', // Clear all properties after animation
            });
          }
        }
      }, gridRef);

      return () => ctx.revert();
    }
  }, [view, currentPage, products, loading]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  if (loading && products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-black">Products Catalog</h2>
            <p className="text-sm text-black/50 mt-1">
              Showing {products.length > 0 ? indexOfFirstProduct + 1 : 0}-
              {Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/add"
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors inline-flex items-center gap-2"
            >
              <span>+</span>
              <span className="hidden sm:inline">Add New</span>
            </Link>
          </div>
        </div>

        {/* Loading Overlay - Only show when reloading with existing products */}
        {loading && products.length > 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && products.length > 0 && (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {products.map((product) => {
              const badge = getStockBadge(product);
              return (
                <div
                  key={product._id}
                  className="product-card group bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="aspect-square bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden"
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={
                          product.images.find((img) => img.isPrimary)?.url ||
                          product.images[0]?.url ||
                          product.images[0]
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-7xl">📦</span>';
                        }}
                      />
                    ) : (
                      <span className="text-7xl">📦</span>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // console.log('Editing product:', product._id);
                        }}
                        className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors text-sm"
                        title="Edit product"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            try {
                              const response = await fetch(`/api/admin/products/${product._id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                handleDelete(product._id);
                              } else {
                                alert('Failed to delete product');
                              }
                            } catch (error) {
                              console.error('Delete error:', error);
                              alert('Failed to delete product');
                            }
                          }
                        }}
                        className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-sm"
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Stock Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-semibold text-black truncate group-hover:underline cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-black/50 mt-1">{product.sku}</p>
                      </div>
                      {product.rating?.average > 0 && (
                        <div className="flex items-center gap-1 text-xs ml-2">
                          <span>⭐</span>
                          <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-black">
                        {product.currency || '$'} {product.price}
                      </span>
                      <span className="text-xs text-black/50">{product.stock} in stock</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-black/50 mb-3">
                      <span>{product.category}</span>
                      <span>{product.purchases || 0} sold</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-black/90 transition-all text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 px-3 py-2 bg-black/5 text-black rounded-lg text-xs font-medium hover:bg-black/10 transition-all"
                      >
                        View
                      </button>
                    </div>

                    {/* Stock Progress */}
                    <div className="mt-3 h-1 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                          opacity: product.stock === 0 ? 0.2 : 1,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === 'list' && products.length > 0 && (
          <div ref={gridRef} className="divide-y divide-black/5">
            {products.map((product) => {
              const badge = getStockBadge(product);
              return (
                <div key={product._id} className="product-row p-6 hover:bg-black/5 transition-all duration-200 group">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="w-20 h-20 bg-gradient-to-br from-black/5 to-black/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images.find((img) => img.isPrimary)?.url ||
                            product.images[0]?.url ||
                            product.images[0]
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-3xl">📦</span>';
                          }}
                        />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-semibold text-black group-hover:underline truncate cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-black/50 mt-1">{product.sku}</p>
                        <p className="text-xs text-black/40 mt-1">{product.category}</p>
                      </div>

                      <div>
                        <p className="text-xs text-black/50 mb-1">Price</p>
                        <p className="text-lg font-bold text-black">
                          {product.currency || '$'} {product.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black/50 mb-1">Stock</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-black">{product.stock}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-black/50 mb-1">Sales</p>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-black">{product.purchases || 0}</p>
                          {product.rating?.average > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <span>⭐</span>
                              <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-all flex items-center justify-center text-sm"
                        title="Edit product"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-all flex items-center justify-center text-sm"
                        title="View details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            try {
                              const response = await fetch(`/api/admin/products/${product._id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                handleDelete(product._id);
                              } else {
                                alert('Failed to delete product');
                              }
                            } catch (error) {
                              console.error('Delete error:', error);
                              alert('Failed to delete product');
                            }
                          }
                        }}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-sm"
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-black mb-2">No Products Found</h3>
            <p className="text-black/50 mb-6">
              {Object.keys(filters).some((key) => filters[key])
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
            >
              <span>+</span>
              <span>Add Product</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-black/60">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = currentPage - 2 + idx;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum ? 'bg-black text-white' : 'text-black hover:bg-black/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ProductsGrid;