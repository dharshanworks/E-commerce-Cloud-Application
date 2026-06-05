import mongoose from 'mongoose';

/**
 * Product Schema
 * Represents products in the CloudCart e-commerce platform
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Electronics',
          'Fashion',
          'Home & Garden',
          'Sports & Outdoors',
          'Books',
          'Toys & Games',
          'Health & Beauty',
          'Automotive',
          'Food & Groceries',
          'Other'
        ],
        message: 'Invalid category selected'
      },
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [999999, 'Price cannot exceed 999999']
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
      max: [999999, 'Sale price cannot exceed 999999'],
      default: null
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one image URL is required'
      }
    },
    primaryImage: {
      type: String,
      default: null
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for active display price
productSchema.virtual('displayPrice').get(function () {
  if (this.salePrice !== null && this.salePrice !== undefined && this.salePrice < this.price) {
    return this.salePrice;
  }

  return this.price;
});

// Virtual field for discount percentage
productSchema.virtual('discount').get(function () {
  if (this.salePrice !== null && this.salePrice !== undefined && this.salePrice < this.price && this.price > 0) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }

  return 0;
});

productSchema.pre('validate', function (next) {
  if (this.salePrice === '') {
    this.salePrice = null;
  }

  if (this.salePrice !== null && this.salePrice !== undefined && this.salePrice >= this.price) {
    this.invalidate('salePrice', 'Sale price must be lower than regular price');
  }

  if (!this.primaryImage && Array.isArray(this.images) && this.images.length > 0) {
    this.primaryImage = this.images[0];
  }

  next();
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdBy: 1, isActive: 1 });

// Instance methods
productSchema.methods.getSafeData = function () {
  const { __v, ...safe } = this.toObject({ virtuals: true });

  const displayPrice =
    safe.salePrice !== null && safe.salePrice !== undefined && safe.salePrice < safe.price
      ? safe.salePrice
      : safe.price;

  return {
    ...safe,
    displayPrice,
    originalPrice: displayPrice < safe.price ? safe.price : null,
    rating: safe.ratings,
    reviewsCount: safe.numReviews
  };
};

// Static methods
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findInPriceRange = function (minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    isActive: true
  });
};

export default mongoose.model('Product', productSchema);
