import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size']
  },
  color: {
    type: String
  },
  colorHex: {
    type: String
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  sku: {
    type: String
  },
  price: {
    type: Number
  },
  images: [{
    type: String
  }]
}, { _id: true });

const specificationSchema = new mongoose.Schema({
  material: String,
  weight: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  careInstructions: [String],
  features: [String]
}, { _id: false });

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },

  // Anime Specific
  anime: {
    name: {
      type: String,
      required: true,
      index: true
    },
    series: {
      type: String
    },
    character: {
      type: String
    },
    season: String,
    episode: String
  },

  // Categories & Tags
  category: {
    type: String,
    required: true,
    enum: [
      'Clothing',
      'Accessories',
      'Figures',
      'Plushies',
      'Posters',
      'Home Decor',
      'Stationery',
      'Electronics',
      'Collectibles',
      'Manga',
      'Art Books',
      'Cosplay',
      'Keychains',
      'Bags',
      'Jewelry',
      'Other'
    ],
    index: true
  },
  subCategory: {
    type: String,
    enum: [
      '',
      // Clothing
      'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Socks', 'Hats', 'Shoes',
      // Accessories
      'Watches', 'Wallets', 'Belts', 'Scarves', 'Gloves',
      // Figures
      'Action Figures', 'Nendoroid', 'Figma', 'Scale Figures', 'Prize Figures',
      // Plushies
      'Small Plushies', 'Medium Plushies', 'Large Plushies', 'Plush Sets',
      // Posters
      'Wall Scrolls', 'Canvas Prints', 'Poster Sets', 'Mini Posters',
      // Stationery
      'Notebooks', 'Pens', 'Stickers', 'Bookmarks', 'Cards',
      // Keychains
      'Acrylic Keychains', 'Metal Keychains', 'Rubber Keychains', 'Charm Sets',
      // Cosplay
      'Costumes', 'Wigs', 'Props', 'Accessories',
      // Bags
      'Backpacks', 'Messenger Bags', 'Tote Bags', 'Drawstring Bags',
      // Manga
      'Manga Volumes', 'Light Novels', 'Art Books', 'Guide Books',
      // Home Decor
      'Pillows', 'Blankets', 'Lamps', 'Clocks', 'Decorations',
      // Electronics
      'Headphones', 'USB Drives', 'Phone Accessories', 'Gaming Accessories',
      // Others
      'Mugs', 'Phone Cases'
    ]
  },
  tags: [{
    type: String,
    lowercase: true
  }],

  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR']
  },

  // Inventory
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  variants: [variantSchema],

  // Images & Media
  images: {
    type: [{
      url: {
        type: String,
        required: true
      },
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    validate: {
      validator: function(images) {
        return images && images.length > 0;
      },
      message: 'At least one product image is required'
    }
  },
  videos: [{
    url: String,
    thumbnail: String,
    title: String
  }],

  // Product Details
  specifications: specificationSchema,
  
  // Brand & Licensing
  brand: {
    type: String,
    required: true
  },
  manufacturer: String,
  isOfficial: {
    type: Boolean,
    default: false
  },
  licensedBy: String,

  // Ratings & Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [reviewSchema],

  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isPreOrder: {
    type: Boolean,
    default: false
  },
  preOrderReleaseDate: Date,
  
  // Limited Edition
  isLimitedEdition: {
    type: Boolean,
    default: false
  },
  limitedQuantity: Number,

  // Shipping
  shipping: {
    weight: {
      type: Number,
      required: true
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    estimatedDelivery: String
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },

  // Related Products
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'out_of_stock'],
    default: 'draft'
  },

  // Vendor
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Age Rating
  ageRating: {
    type: String,
    enum: ['All Ages', '13+', '16+', '18+', 'Mature'],
    default: 'All Ages'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', 'anime.name': 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'anime.name': 1, status: 1 });
productSchema.index({ price: 1, status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });

// Virtual for discount price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock < 10) return 'Low Stock';
  return 'In Stock';
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Pre-save middleware to generate unique slug
productSchema.pre('save', async function(next) {
  // Only generate slug if it doesn't exist
  if (!this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (true) {
      const existingProduct = await mongoose.models.Product.findOne({ 
        slug, 
        _id: { $ne: this._id } 
      });
      
      if (!existingProduct) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

// Pre-save middleware to calculate discount
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Validate variant SKUs are unique within the product
productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    const skus = this.variants
      .map(v => v.sku)
      .filter(sku => sku && sku.trim() !== '');
    
    const uniqueSkus = new Set(skus);
    
    if (skus.length !== uniqueSkus.size) {
      const error = new Error('Duplicate variant SKUs found within the same product');
      return next(error);
    }
  }
  next();
});

// Ensure at least one image is marked as primary
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Methods
productSchema.methods.addReview = async function(userId, userName, rating, comment, images = []) {
  this.reviews.push({
    user: userId,
    userName,
    rating,
    comment,
    images,
    createdAt: new Date()
  });

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;

  return this.save();
};

productSchema.methods.updateStock = async function(quantity, operation = 'decrease') {
  if (operation === 'decrease') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'increase') {
    this.stock += quantity;
  }

  if (this.stock === 0) {
    this.status = 'out_of_stock';
    this.isAvailable = false;
  } else if (this.status === 'out_of_stock') {
    this.status = 'published';
    this.isAvailable = true;
  }

  return this.save();
};

productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

productSchema.methods.incrementWishlist = function() {
  this.wishlistCount += 1;
  return this.save();
};

productSchema.methods.decrementWishlist = function() {
  this.wishlistCount = Math.max(0, this.wishlistCount - 1);
  return this.save();
};

productSchema.methods.incrementPurchases = function(quantity = 1) {
  this.purchases += quantity;
  return this.save();
};

// Static methods
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ 
    isFeatured: true, 
    isAvailable: true,
    status: 'published'
  })
  .limit(limit)
  .sort('-createdAt');
};

productSchema.statics.getNewArrivals = function(limit = 10) {
  return this.find({ 
    isNewArrival: true, 
    isAvailable: true,
    status: 'published'
  })
  .limit(limit)
  .sort('-createdAt');
};

productSchema.statics.getBestsellers = function(limit = 10) {
  return this.find({ 
    isBestseller: true, 
    isAvailable: true,
    status: 'published'
  })
  .limit(limit)
  .sort('-purchases');
};

productSchema.statics.getByAnime = function(animeName, limit = 20) {
  return this.find({ 
    'anime.name': new RegExp(animeName, 'i'),
    isAvailable: true,
    status: 'published'
  })
  .limit(limit)
  .sort('-rating.average');
};

productSchema.statics.getByCategory = function(category, options = {}) {
  const { 
    subCategory, 
    limit = 20, 
    skip = 0, 
    sortBy = '-createdAt' 
  } = options;

  const query = {
    category,
    isAvailable: true,
    status: 'published'
  };

  if (subCategory) {
    query.subCategory = subCategory;
  }

  return this.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sortBy);
};

productSchema.statics.searchProducts = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    anime,
    sortBy = '-createdAt',
    limit = 20,
    skip = 0
  } = options;

  const filters = {
    isAvailable: true,
    status: 'published'
  };

  if (query && query.trim()) {
    filters.$text = { $search: query };
  }

  if (category) filters.category = category;
  if (anime) filters['anime.name'] = new RegExp(anime, 'i');
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.price = {};
    if (minPrice !== undefined) filters.price.$gte = minPrice;
    if (maxPrice !== undefined) filters.price.$lte = maxPrice;
  }

  return this.find(filters)
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

productSchema.statics.getRelatedProducts = async function(productId, limit = 6) {
  const product = await this.findById(productId);
  
  if (!product) return [];

  return this.find({
    _id: { $ne: productId },
    $or: [
      { category: product.category },
      { 'anime.name': product.anime.name },
      { tags: { $in: product.tags } }
    ],
    isAvailable: true,
    status: 'published'
  })
  .limit(limit)
  .sort('-rating.average');
};

productSchema.statics.getLowStockProducts = function(threshold = 10) {
  return this.find({
    stock: { $lte: threshold, $gt: 0 },
    status: 'published'
  })
  .sort('stock');
};

productSchema.statics.getOutOfStockProducts = function() {
  return this.find({
    $or: [
      { stock: 0 },
      { status: 'out_of_stock' }
    ]
  })
  .sort('-updatedAt');
};

// Delete existing model if it exists to prevent OverwriteModelError
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.model('Product', productSchema);

export default Product;