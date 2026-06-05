import { useContext } from 'react';
import { CartContext } from '../../context/CartContextObject.js';
import {
  getDisplayPrice,
  getDiscountPercentage,
  getOriginalPrice,
  getProductRating,
  getReviewCount,
} from '../../utils/productUtils.js';

/**
 * Product List Card Component
 * Displays product information in a horizontal list format
 * Alternative to grid view for comparison
 */
export const ProductListCard = ({
  product,
  onQuickView,
  onCompare,
  onAddToCart
}) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      onAddToCart?.();
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  // Determine stock status
  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        text: 'Out of Stock',
        color: 'badge-error'
      };
    } else if (product.stock < 5) {
      return {
        text: `Only ${product.stock} left`,
        color: 'badge-warning'
      };
    } else {
      return {
        text: 'In Stock',
        color: 'badge-success'
      };
    }
  };

  const stockStatus = getStockStatus();

  const displayPrice = getDisplayPrice(product);
  const originalPrice = getOriginalPrice(product);
  const discount = getDiscountPercentage(product);
  const rating = getProductRating(product);
  const reviewCount = getReviewCount(product);

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-md transition duration-300 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Image Section */}
          <div className="relative h-40 w-full sm:h-auto sm:w-48">
          <img
            src={
              product.images?.[0] ||
              'https://via.placeholder.com/300x200?text=No+Image'
            }
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          {discount > 0 && (
            <div className="absolute right-2 top-2 rounded bg-error px-2 py-1 text-sm font-bold text-error-content">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {product.brand && (
                <span className="badge badge-outline text-xs">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="badge badge-primary text-xs">
                  {product.category}
                </span>
              )}
              <span className={`badge ${stockStatus.color} text-xs`}>
                {stockStatus.text}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold line-clamp-2 mb-1">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
                <p className="mb-2 line-clamp-2 text-sm text-base-content/70">
                {product.description}
              </p>
            )}

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-base-content">
                    {'★'.repeat(Math.floor(rating))}
                  </span>
                </div>
                <span className="text-xs text-base-content/70">
                  ({reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${displayPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-base-content/50 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary btn-sm flex-1 sm:flex-none"
              >
                🛒 Add
              </button>
              <button
                onClick={() => onQuickView?.(product)}
                className="btn btn-outline btn-sm flex-1 sm:flex-none"
              >
                👁️ Quick View
              </button>
              <button
                onClick={() => onCompare?.(product)}
                className="btn btn-outline btn-sm flex-1 sm:flex-none"
                title="Add to comparison"
              >
                ⚖️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
