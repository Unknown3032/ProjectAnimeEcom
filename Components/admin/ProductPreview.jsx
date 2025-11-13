'use client';

export default function ProductPreview({ product }) {
  // Extract image URLs for preview
  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    if (img?.url) return img.url;
    if (img?.preview) return img.preview;
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  const images = product.images || [];

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <div className="bg-black/5 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Product Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/60 mb-1">Product Name</p>
            <p className="font-medium">{product.name || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-black/60 mb-1">SKU</p>
            <p className="font-medium">{product.sku || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-black/60 mb-1">Anime</p>
            <p className="font-medium">{product.anime?.name || 'Not set'}</p>
          </div>
          
          {product.anime?.character && (
            <div>
              <p className="text-sm text-black/60 mb-1">Character</p>
              <p className="font-medium">{product.anime.character}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-black/60 mb-1">Category</p>
            <p className="font-medium">
              {product.category || 'Not set'}
              {product.subcategory && ` / ${product.subcategory}`}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-black/60 mb-1">Brand</p>
            <p className="font-medium">{product.brand || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-black/60 mb-1">Price</p>
            <p className="font-medium text-lg">
              ${product.price || '0.00'}
              {product.compareAtPrice && (
                <span className="text-sm text-black/40 line-through ml-2">
                  ${product.compareAtPrice}
                </span>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-black/60 mb-1">Stock</p>
            <p className="font-medium">
              {product.trackQuantity 
                ? `${product.quantity || '0'} units` 
                : 'Not tracked'}
            </p>
          </div>
        </div>
      </div>

      {/* Images Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Product Images ({images.length})</h3>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden border border-black/10 bg-black/5"
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image';
                  }}
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                    Main
                  </div>
                )}
                {typeof image === 'object' && image.publicId && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ☁️
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">⚠️ No images added - Please add at least one image</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <div className="bg-black/5 rounded-xl p-4">
          <p className="text-sm whitespace-pre-wrap">
            {product.description || 'No description provided'}
          </p>
        </div>
        {product.shortDescription && (
          <div className="mt-2 bg-black/5 rounded-xl p-3">
            <p className="text-xs text-black/60">Short: {product.shortDescription}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-black/10 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features & Shipping */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/5 rounded-xl p-4">
          <h4 className="font-semibold mb-2">Product Features</h4>
          <div className="space-y-1 text-sm">
            {product.featured && <p>✓ Featured Product</p>}
            {product.isNewArrival && <p>✓ New Arrival</p>}
            {product.isBestseller && <p>✓ Bestseller</p>}
            {product.isOfficial && <p>✓ Official Product</p>}
            <p>Age Rating: {product.ageRating || 'All Ages'}</p>
            {product.licensedBy && <p>Licensed by: {product.licensedBy}</p>}
            {!product.featured && !product.isNewArrival && !product.isBestseller && !product.isOfficial && (
              <p className="text-black/40">No special features</p>
            )}
          </div>
        </div>

        <div className="bg-black/5 rounded-xl p-4">
          <h4 className="font-semibold mb-2">Shipping Details</h4>
          <div className="space-y-1 text-sm">
            <p>Weight: {product.weight || '0'} kg</p>
            {(product.length || product.width || product.height) && (
              <p>
                Dimensions: {product.length || '0'} × {product.width || '0'} × {product.height || '0'} cm
              </p>
            )}
            {product.allowBackorder && <p>✓ Backorders allowed</p>}
          </div>
        </div>
      </div>

      {/* Profit Margin (if cost is provided) */}
      {product.price && product.costPerItem && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold mb-2 text-green-800">Profit Analysis</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-green-700">Cost</p>
              <p className="font-bold text-green-900">${product.costPerItem}</p>
            </div>
            <div>
              <p className="text-green-700">Profit</p>
              <p className="font-bold text-green-900">
                ${(parseFloat(product.price) - parseFloat(product.costPerItem)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-green-700">Margin</p>
              <p className="font-bold text-green-900">
                {(((parseFloat(product.price) - parseFloat(product.costPerItem)) / parseFloat(product.price)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold mb-2 text-blue-800">Publication Status</h4>
        <p className="text-sm text-blue-900">
          This product will be saved as: <strong className="uppercase">{product.status || 'draft'}</strong>
        </p>
      </div>
    </div>
  );
}