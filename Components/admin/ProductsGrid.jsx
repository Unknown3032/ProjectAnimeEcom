'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import ProductDetailsModal from './ProductDetailsModal';

const ProductsGrid = ({ view = 'grid' }) => {
  const gridRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Naruto Uzumaki Figure',
      sku: 'NAR-FIG-001',
      category: 'Figures',
      price: 89.99,
      stock: 45,
      status: 'in-stock',
      sales: 234,
      rating: 4.8,
      image: '🎎',
      description: 'Premium collectible figure with detailed craftsmanship',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Attack on Titan Poster Set',
      sku: 'AOT-POS-002',
      category: 'Posters',
      price: 34.99,
      stock: 12,
      status: 'low-stock',
      sales: 189,
      rating: 4.6,
      image: '🖼️',
      description: 'High-quality poster collection featuring iconic scenes',
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      name: 'Demon Slayer Keychain',
      sku: 'DS-KEY-003',
      category: 'Keychains',
      price: 12.99,
      stock: 0,
      status: 'out-of-stock',
      sales: 156,
      rating: 4.5,
      image: '🔑',
      description: 'Adorable character keychain with metal finish',
      createdAt: '2024-01-08'
    },
    {
      id: 4,
      name: 'One Piece Mug',
      sku: 'OP-MUG-004',
      category: 'Accessories',
      price: 24.99,
      stock: 67,
      status: 'in-stock',
      sales: 142,
      rating: 4.7,
      image: '☕',
      description: 'Ceramic mug with vibrant character designs',
      createdAt: '2024-01-15'
    },
    {
      id: 5,
      name: 'My Hero Academia T-Shirt',
      sku: 'MHA-CLO-005',
      category: 'Clothing',
      price: 29.99,
      stock: 34,
      status: 'in-stock',
      sales: 128,
      rating: 4.9,
      image: '👕',
      description: 'Premium cotton t-shirt with official artwork',
      createdAt: '2024-01-05'
    },
    {
      id: 6,
      name: 'Dragon Ball Z Figure Set',
      sku: 'DBZ-FIG-006',
      category: 'Figures',
      price: 149.99,
      stock: 8,
      status: 'low-stock',
      sales: 98,
      rating: 4.8,
      image: '🎎',
      description: 'Complete set of legendary Super Saiyan figures',
      createdAt: '2024-01-18'
    },
    {
      id: 7,
      name: 'Jujutsu Kaisen Poster',
      sku: 'JJK-POS-007',
      category: 'Posters',
      price: 19.99,
      stock: 89,
      status: 'in-stock',
      sales: 176,
      rating: 4.6,
      image: '🖼️',
      description: 'Limited edition poster with holographic finish',
      createdAt: '2024-01-20'
    },
    {
      id: 8,
      name: 'Tokyo Ghoul Mask',
      sku: 'TG-ACC-008',
      category: 'Accessories',
      price: 44.99,
      stock: 23,
      status: 'in-stock',
      sales: 87,
      rating: 4.4,
      image: '🎭',
      description: 'Replica mask with adjustable straps',
      createdAt: '2024-01-22'
    },
  ];

  const getStockBadge = (status) => {
    const badges = {
      'in-stock': 'bg-black text-white',
      'low-stock': 'bg-black/60 text-white',
      'out-of-stock': 'bg-black/20 text-black/60',
    };
    const labels = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    };
    return { class: badges[status], label: labels[status] };
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (view === 'grid') {
        gsap.from(gridRef.current.querySelectorAll('.product-card'), {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        });
      } else {
        gsap.from(gridRef.current.querySelectorAll('.product-row'), {
          opacity: 0,
          x: -30,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [view, currentPage]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-black">Products Catalog</h2>
            <p className="text-sm text-black/50 mt-1">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-black/5 rounded-lg text-sm font-medium text-black hover:bg-black/10 transition-colors">
              Bulk Actions
            </button>
            
            <Link
              href="/admin/products/add"
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors inline-flex items-center gap-2"
            >
              <span>+</span>
              <span className="hidden sm:inline">Add New</span>
            </Link>
          </div>
        </div>

        {/* Grid View */}
        {view === 'grid' && (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {currentProducts.map((product) => {
              const badge = getStockBadge(product.status);
              return (
                <div
                  key={product.id}
                  className="product-card group bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div 
                    onClick={() => setSelectedProduct(product)}
                    className="aspect-square bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    <span className="relative z-10">{product.image}</span>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm('Are you sure you want to delete this product?')) {
                            console.log('Delete product:', product.id);
                          }
                        }}
                        className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
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
                          className="font-semibold text-black truncate group-hover:underline"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-black/50 mt-1">{product.sku}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs ml-2">
                        <span>⭐</span>
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-black">${product.price}</span>
                      <span className="text-xs text-black/50">{product.stock} in stock</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-black/50 mb-3">
                      <span>{product.category}</span>
                      <span>{product.sales} sold</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
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
                          opacity: product.stock === 0 ? 0.2 : 1
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
        {view === 'list' && (
          <div ref={gridRef} className="divide-y divide-black/5">
            {currentProducts.map((product) => {
              const badge = getStockBadge(product.status);
              return (
                <div
                  key={product.id}
                  className="product-row p-6 hover:bg-black/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="w-20 h-20 bg-gradient-to-br from-black/5 to-black/10 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                      {product.image}
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
                        <p className="text-lg font-bold text-black">${product.price}</p>
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
                          <p className="text-sm font-semibold text-black">{product.sales}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span>⭐</span>
                            <span className="font-medium">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-all flex items-center justify-center"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-black hover:text-white transition-all flex items-center justify-center"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this product?')) {
                            console.log('Delete product:', product.id);
                          }
                        }}
                        className="w-10 h-10 bg-black/5 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
          <p className="text-sm text-black/60">
            Page {currentPage} of {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
            >
              Previous
            </button>
            
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === idx + 1
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black/5'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductsGrid;