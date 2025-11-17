// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    // Order identification - will be auto-generated
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Order items
    items: {
      type: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required'],
        },
        name: {
          type: String,
          required: [true, 'Product name is required'],
        },
        price: {
          type: Number,
          required: [true, 'Product price is required'],
          min: [0, 'Price cannot be negative'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        image: String,
      }],
      required: [true, 'Order must contain items'],
      validate: {
        validator: function(items) {
          return items && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },

    // Shipping information
    shippingInfo: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: {
        type: String,
        required: [true, 'ZIP code is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
    },

    // Also keep shippingAddress for backward compatibility
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      street: String,
      apartment: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Payment information (store only safe data)
    paymentInfo: {
      cardNumber: String, // Last 4 digits only
      cardName: String,
      paymentMethod: {
        type: String,
        default: 'card',
      },
    },

    // Also keep paymentMethod for backward compatibility
    paymentMethod: {
      type: String,
      default: 'card',
    },

    // Pricing
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    total: {
      type: Number,
      min: [0, 'Total cannot be negative'],
    },

    // Order status
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },

    // Tracking
    trackingNumber: String,
    
    // Notes
    customerNotes: String,
    adminNotes: String,

    // Dates
    orderDate: {
      type: Date,
      default: Date.now,
    },
    shippedDate: Date,
    deliveredDate: Date,
    estimatedDelivery: Date,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate unique order number BEFORE saving
OrderSchema.pre('save', async function (next) {
  // Only generate if it's a new document and orderNumber is not set
  if (this.isNew && !this.orderNumber) {
    try {
      // Method: Using timestamp + random
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.orderNumber = `ORD-${timestamp}-${random}`;
      
      // Check if this order number already exists (very unlikely but safe)
      const existing = await mongoose.models.Order.findOne({ orderNumber: this.orderNumber });
      if (existing) {
        // Fallback: add more randomness
        this.orderNumber = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    } catch (error) {
      console.error('Error generating order number:', error);
      // Ultimate fallback
      this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  }
  
  // Sync shippingAddress with shippingInfo for backward compatibility
  if (this.shippingInfo) {
    this.shippingAddress = {
      firstName: this.shippingInfo.firstName,
      lastName: this.shippingInfo.lastName,
      email: this.shippingInfo.email,
      phone: this.shippingInfo.phone,
      address: this.shippingInfo.address,
      street: this.shippingInfo.address, // Also set street
      city: this.shippingInfo.city,
      state: this.shippingInfo.state,
      zipCode: this.shippingInfo.zipCode,
      country: this.shippingInfo.country,
    };
  }
  
  // Set userId from user if not set
  if (this.user && !this.userId) {
    this.userId = this.user;
  }

  // Sync total with totalAmount for backward compatibility
  if (this.totalAmount && !this.total) {
    this.total = this.totalAmount;
  }

  // Sync shipping with shippingCost for backward compatibility
  if (this.shippingCost !== undefined && this.shipping === undefined) {
    this.shipping = this.shippingCost;
  }

  // Sync paymentMethod
  if (this.paymentInfo?.paymentMethod && !this.paymentMethod) {
    this.paymentMethod = this.paymentInfo.paymentMethod;
  }
  
  next();
});

// Virtual for order total items count
OrderSchema.virtual('totalItems').get(function() {
  return this.items ? this.items.reduce((total, item) => total + item.quantity, 0) : 0;
});

// Index for better query performance
// ONLY define indexes here to avoid duplicate index warning
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'shippingAddress.email': 1 });
OrderSchema.index({ 'shippingInfo.email': 1 });

// Methods
OrderSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Ensure backward compatibility fields exist
  if (!obj.total && obj.totalAmount) {
    obj.total = obj.totalAmount;
  }
  
  if (!obj.shipping && obj.shippingCost !== undefined) {
    obj.shipping = obj.shippingCost;
  }
  
  return obj;
};

// Static methods
OrderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber });
};

OrderSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ userId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.limit) {
    query.limit(options.limit);
  }
  
  query.sort({ createdAt: -1 });
  
  return query;
};

OrderSchema.statics.getStatusCounts = async function(userId = null) {
  const matchStage = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
  
  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
};

// Ensure model is not redefined
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);