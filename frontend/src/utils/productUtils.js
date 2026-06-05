export const getDisplayPrice = (product = {}) => {
  const salePrice = Number(product.salePrice);
  const basePrice = Number(product.price);

  if (Number.isFinite(salePrice) && salePrice > 0 && salePrice < basePrice) {
    return salePrice;
  }

  return Number.isFinite(basePrice) ? basePrice : 0;
};

export const getOriginalPrice = (product = {}) => {
  const displayPrice = getDisplayPrice(product);
  const basePrice = Number(product.price);

  if (Number.isFinite(basePrice) && basePrice > displayPrice) {
    return basePrice;
  }

  const originalPrice = Number(product.originalPrice);
  if (Number.isFinite(originalPrice) && originalPrice > displayPrice) {
    return originalPrice;
  }

  return null;
};

export const getDiscountPercentage = (product = {}) => {
  const originalPrice = getOriginalPrice(product);
  const displayPrice = getDisplayPrice(product);

  if (!originalPrice || originalPrice <= displayPrice) {
    return 0;
  }

  return Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
};

export const getProductRating = (product = {}) => {
  const rating = Number(product.ratings ?? product.rating ?? 0);
  return Number.isFinite(rating) ? rating : 0;
};

export const getReviewCount = (product = {}) => {
  if (Array.isArray(product.reviews)) {
    return product.reviews.length;
  }

  const count = Number(product.numReviews ?? product.reviewsCount ?? 0);
  return Number.isFinite(count) ? count : 0;
};

export const getCartItemUnitPrice = (item = {}) => {
  const storedPrice = Number(item.price);
  if (Number.isFinite(storedPrice) && storedPrice >= 0) {
    return storedPrice;
  }

  return getDisplayPrice(item.product);
};
