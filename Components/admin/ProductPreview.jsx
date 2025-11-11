'use client';

const ProductPreview = ({ product }) => {
  return (
    <div className="space-y-6">
      {/* Product Card Preview */}
      <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
        <h3 className="font-semibold text-black mb-4">Product Card Preview</h3>
        
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden max-w-sm mx-auto">
          {/* Main Image */}
          {product.images.length > 0 ? (
            <div className="aspect-square bg-black/5">
              <img
                src={product.images[0].preview}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-6xl">
              📦
            </div>
          )}

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-black">{product.name || 'Product Name'}</h4>
              {product.featured && <span className="text-xl">⭐</span>}
            </div>
            <p className="text-xs text-black/50 mb-3">{product.sku || 'SKU-000'}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-black">${product.price || '0.00'}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-black/40 line-through ml-2">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>
              {product.trackQuantity && (
                <span className="text-xs text-black/50">
                  {product.quantity || 0} in stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black/5 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-black mb-3">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Name:</span>
                <span className="font-medium text-black">{product.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">SKU:</span>
                <span className="font-medium text-black">{product.sku || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Category:</span>
                <span className="font-medium text-black capitalize">{product.category || '-'}</span>
              </div>
              {product.subcategory && (
                <div className="flex justify-between">
                  <span className="text-black/50">Subcategory:</span>
                  <span className="font-medium text-black">{product.subcategory}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/5 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-black mb-3">Pricing</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Price:</span>
                <span className="font-medium text-black">${product.price || '0.00'}</span>
              </div>
              {product.compareAtPrice && (
                <div className="flex justify-between">
                  <span className="text-black/50">Compare Price:</span>
                  <span className="font-medium text-black">${product.compareAtPrice}</span>
                </div>
              )}
              {product.costPerItem && (
                <div className="flex justify-between">
                  <span className="text-black/50">Cost:</span>
                  <span className="font-medium text-black">${product.costPerItem}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/5 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-black mb-3">Inventory</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Track Quantity:</span>
                <span className="font-medium text-black">{product.trackQuantity ? 'Yes' : 'No'}</span>
              </div>
              {product.trackQuantity && (
                <>
                  <div className="flex justify-between">
                    <span className="text-black/50">Quantity:</span>
                    <span className="font-medium text-black">{product.quantity || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Low Stock Alert:</span>
                    <span className="font-medium text-black">{product.lowStockThreshold || 10}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Backorder:</span>
                    <span className="font-medium text-black">{product.allowBackorder ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-black/5 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-black mb-3">Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Status:</span>
                <span className="font-medium text-black capitalize">{product.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Featured:</span>
                <span className="font-medium text-black">{product.featured ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Images:</span>
                <span className="font-medium text-black">{product.images.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="bg-black/5 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-black mb-3">Description</h4>
          <p className="text-sm text-black/60 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="bg-black/5 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-black mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-black/10 rounded-full text-sm text-black">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPreview;