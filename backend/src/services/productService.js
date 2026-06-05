import Product from '../models/Product.js';
import { AppError } from '../middleware/errorMiddleware.js';
import APIFeatures from '../utils/apiFeatures.js';
import { fetchProductImageFromPexels } from '../utils/pexelsService.js';

/**
 * Product Service
 * Handles all product business logic
 */

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeImages = (images = []) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => String(image).trim()).filter(Boolean);
};

const normalizeNullableNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const createProduct = async (productData, adminId) => {
  const {
    name,
    description,
    brand,
    category,
    price,
    stock,
    salePrice
  } = productData;

  const trimmedName = String(name).trim();
  const trimmedBrand = String(brand).trim();

  // Check for duplicate product name by brand combo
  const existingProduct = await Product.findOne({
    name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: 'i' },
    brand: { $regex: `^${escapeRegex(trimmedBrand)}$`, $options: 'i' }
  });

  if (existingProduct) {
    throw new AppError('Product with this name and brand already exists', 409);
  }

  // Auto-fetch image from Pexels if not provided
  let productImages = normalizeImages(productData.images);

  if (productImages.length === 0) {
    const searchTerm = `${trimmedBrand} ${trimmedName}`;

    console.log(`🔍 Fetching image from Pexels for: "${searchTerm}"`);

    const pexelsImage = await fetchProductImageFromPexels(searchTerm);

    if (pexelsImage) {
      productImages = [pexelsImage];
      console.log(`✅ Auto-fetched image from Pexels for "${searchTerm}"`);
    } else {
      console.warn(`⚠️ Using placeholder image for "${searchTerm}"`);

      productImages = [
        `https://via.placeholder.com/500?text=${encodeURIComponent(trimmedName)}`
      ];
    }
  }

  const parsedPrice = normalizeNumber(price);
  const parsedSalePrice = normalizeNullableNumber(salePrice);

  // Create product with admin ID
  const product = await Product.create({
    name: trimmedName,
    description,
    brand: trimmedBrand,
    category,
    price: parsedPrice,
    salePrice: parsedSalePrice,
    stock: parseInt(stock, 10),
    images: productImages,
    primaryImage: productImages[0] || null,
    createdBy: adminId
  });

  return product.getSafeData();
};

export const getAllProducts = async (queryString) => {
  const features = new APIFeatures(Product.find({ isActive: true }), queryString);
  features.search().filter().sort();

  const total = await features.getTotal();
  await features.paginate();

  const products = await features.query;

  if (!products || products.length === 0) {
    return {
      products: [],
      total,
      page: parseInt(queryString.page, 10) || 1,
      limit: parseInt(queryString.limit, 10) || 10,
      totalPages: Math.ceil(total / (parseInt(queryString.limit, 10) || 10))
    };
  }

  const limit = parseInt(queryString.limit, 10) || 10;

  return {
    products: products.map((p) => p.getSafeData()),
    total,
    page: parseInt(queryString.page, 10) || 1,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('createdBy', 'name email');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!product.isActive) {
    throw new AppError('Product not available', 404);
  }

  return product.getSafeData();
};

export const updateProduct = async (productId, updateData, adminId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check admin ownership
  if (product.createdBy.toString() !== adminId.toString()) {
    throw new AppError('You do not have permission to update this product', 403);
  }

  // Check for duplicate if updating name/brand
  if (updateData.name || updateData.brand) {
    const name = updateData.name || product.name;
    const brand = updateData.brand || product.brand;

    const duplicate = await Product.findOne({
      _id: { $ne: productId },
      name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' },
      brand: { $regex: `^${escapeRegex(brand)}$`, $options: 'i' }
    });

    if (duplicate) {
      throw new AppError('Product with this name and brand already exists', 409);
    }
  }

  // Update allowed fields only
  const allowedFields = [
    'name',
    'description',
    'brand',
    'category',
    'price',
    'salePrice',
    'stock',
    'images',
    'ratings',
    'numReviews'
  ];

  Object.keys(updateData).forEach((key) => {
    if (!allowedFields.includes(key)) {
      return;
    }

    if (key === 'price' || key === 'ratings') {
      product[key] = normalizeNumber(updateData[key], product[key]);
    } else if (key === 'salePrice') {
      product[key] = normalizeNullableNumber(updateData[key]);
    } else if (key === 'stock' || key === 'numReviews') {
      product[key] = parseInt(updateData[key], 10);
    } else if (key === 'images') {
      const images = normalizeImages(updateData.images);
      if (images.length > 0) {
        product.images = images;
        product.primaryImage = images[0];
      }
    } else if (typeof updateData[key] === 'string') {
      product[key] = updateData[key].trim();
    } else {
      product[key] = updateData[key];
    }
  });

  await product.save();
  return product.getSafeData();
};

export const deleteProduct = async (productId, adminId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check admin ownership
  if (product.createdBy.toString() !== adminId.toString()) {
    throw new AppError('You do not have permission to delete this product', 403);
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  return { message: 'Product deleted successfully' };
};

export const searchProducts = async (queryString) => {
  const features = new APIFeatures(Product.find({ isActive: true }), queryString);
  features.search().sort();

  const total = await features.getTotal();
  features.paginate();
  const products = await features.query;
  const limit = parseInt(queryString.limit, 10) || 10;

  return {
    products: products.map((p) => p.getSafeData()),
    total,
    query: queryString.search || '',
    page: parseInt(queryString.page, 10) || 1,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const filterProductsByCategory = async (category, queryString) => {
  const features = new APIFeatures(Product.find({ category, isActive: true }), queryString);
  features.filter().sort();

  const total = await features.getTotal();
  features.paginate();
  const products = await features.query;
  const limit = parseInt(queryString.limit, 10) || 10;

  return {
    products: products.map((p) => p.getSafeData()),
    total,
    category,
    page: parseInt(queryString.page, 10) || 1,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
