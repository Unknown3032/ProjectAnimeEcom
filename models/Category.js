import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      // Remove index: true from here since we define it separately below
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    tagline: {
      type: String,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    images: [{
      url: String,
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      // Remove index: true from here
    },
    isActive: {
      type: Boolean,
      default: true,
      // Remove index: true from here
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    metadata: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Define indexes separately (not in field definitions)
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, order: 1 });
categorySchema.index({ name: 'text', description: 'text' });

// Virtual for product count (requires Product model)
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .populate('parent', 'name slug')
    .sort('order name');

  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => {
        if (parentId === null) {
          return !cat.parent;
        }
        return cat.parent && cat.parent._id.toString() === parentId.toString();
      })
      .map(cat => ({
        ...cat.toObject(),
        children: buildTree(cat._id)
      }));
  };

  return buildTree();
};

// Static method to get full category path
categorySchema.statics.getCategoryPath = async function(categoryId) {
  const path = [];
  let currentCategory = await this.findById(categoryId);

  while (currentCategory) {
    path.unshift({
      _id: currentCategory._id,
      name: currentCategory.name,
      slug: currentCategory.slug
    });

    if (currentCategory.parent) {
      currentCategory = await this.findById(currentCategory.parent);
    } else {
      currentCategory = null;
    }
  }

  return path;
};

// Instance method to get all descendants
categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  const queue = [this._id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await this.constructor.find({ parent: currentId });
    
    for (const child of children) {
      descendants.push(child);
      queue.push(child._id);
    }
  }

  return descendants;
};

// Pre-remove middleware to handle orphaned subcategories
categorySchema.pre('remove', async function(next) {
  await this.constructor.deleteMany({ parent: this._id });
  next();
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;