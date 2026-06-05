import {
  getDisplayPrice,
  getOriginalPrice,
  getProductRating,
  getReviewCount,
} from '../../utils/productUtils.js';

/**
 * Product Comparison Modal
 * Displays detailed side-by-side comparison of selected products
 * Shows specs, pricing, availability, ratings
 */
export const ProductComparisonModal = ({ products = [], isOpen, onClose }) => {
  const comparisonProducts = products.slice(0, 4);

  if (!isOpen || comparisonProducts.length === 0) {
    return null;
  }

  const specKeys = Array.from(
    new Set(
      comparisonProducts.flatMap((product) =>
        product.specs ? Object.keys(product.specs) : []
      )
    )
  );

  const getAttribute = (product, key) => product.specs?.[key] || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-black/50"
        onClick={onClose}
        aria-label="Close comparison"
      />

      <div className="relative flex max-h-[90vh] max-w-6xl flex-col overflow-hidden rounded-lg bg-base-100 shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-base-200 p-6">
          <div>
            <h2 className="text-2xl font-bold">Product Comparison</h2>
            <p className="mt-1 text-sm text-base-content/70">
              Comparing {comparisonProducts.length} products
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-lg"
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-base-200">
              <tr>
                <th className="w-32 border-r bg-base-200 p-4 text-left font-semibold">
                  Attribute
                </th>
                {comparisonProducts.map((product) => (
                  <th key={product._id} className="min-w-48 border-r p-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 h-24 w-24 overflow-hidden rounded bg-base-200">
                        <img
                          src={
                            product.images?.[0] ||
                            'https://via.placeholder.com/200x200?text=No+Image'
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="line-clamp-2 text-sm font-semibold">
                        {product.name}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Price</td>
                {comparisonProducts.map((product) => {
                  const displayPrice = getDisplayPrice(product);
                  const originalPrice = getOriginalPrice(product);

                  return (
                    <td key={`${product._id}-price`} className="border-r p-4 text-center">
                      <span className="text-2xl font-bold text-primary">
                        ${displayPrice.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <div className="text-sm text-base-content/60 line-through">
                          ${originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Rating</td>
                {comparisonProducts.map((product) => (
                  <td key={`${product._id}-rating`} className="border-r p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold">{getProductRating(product).toFixed(1)}</span>
                      <span className="text-base-content">★</span>
                      <span className="text-xs text-base-content/70">
                        ({getReviewCount(product)} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Stock</td>
                {comparisonProducts.map((product) => (
                  <td key={`${product._id}-stock`} className="border-r p-4 text-center">
                    <span className="rounded-full bg-base-200 px-3 py-1 text-sm font-semibold text-base-content">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Brand</td>
                {comparisonProducts.map((product) => (
                  <td key={`${product._id}-brand`} className="border-r p-4 text-center">
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Category</td>
                {comparisonProducts.map((product) => (
                  <td key={`${product._id}-category`} className="border-r p-4 text-center">
                    {product.category || 'N/A'}
                  </td>
                ))}
              </tr>

              {specKeys.map((specKey) => (
                <tr key={specKey} className="border-b hover:bg-base-200">
                  <td className="border-r bg-base-200 p-4 font-semibold capitalize">
                    {specKey}
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={`${product._id}-${specKey}`} className="border-r p-4 text-center">
                      {getAttribute(product, specKey)}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-b hover:bg-base-200">
                <td className="border-r bg-base-200 p-4 font-semibold">Description</td>
                {comparisonProducts.map((product) => (
                  <td key={`${product._id}-desc`} className="border-r p-4 text-center text-sm">
                    <div className="line-clamp-3">{product.description || 'N/A'}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t bg-base-200 p-4">
          <p className="text-sm text-base-content/70">Max 4 products can be compared at once</p>
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
