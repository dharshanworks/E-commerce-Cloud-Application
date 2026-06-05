import { useEffect, useState, useCallback, useRef } from 'react';
import { productService } from '../../services/productService.js';
import { ProductCard } from '../../components/product/ProductCard.jsx';
import { ProductListCard } from '../../components/product/ProductListCard.jsx';
import { ProductGridSkeleton } from '../../components/product/ProductSkeleton.jsx';
import { AdvancedFilters } from '../../components/product/AdvancedFilters.jsx';
import { ProductSort } from '../../components/product/ProductSort.jsx';
import { ProductQuickViewModal } from '../../components/product/ProductQuickViewModal.jsx';
import { ProductComparisonModal } from '../../components/product/ProductComparisonModal.jsx';
import { Breadcrumb } from '../../components/common/Breadcrumb.jsx';
import { getDisplayPrice, getProductRating, getReviewCount } from '../../utils/productUtils.js';

const DEFAULT_LIMIT = 12;

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const applyAdvancedFilters = useCallback(
    (productList) => {
      return productList.filter((product) => {
        const displayPrice = getDisplayPrice(product);
        const rating = getProductRating(product);

        if (advancedFilters.priceRange) {
          const [minPrice, maxPrice] = advancedFilters.priceRange;
          if (displayPrice < minPrice || displayPrice > maxPrice) {
            return false;
          }
        }

        if (advancedFilters.minRating && rating < advancedFilters.minRating) {
          return false;
        }

        if (advancedFilters.inStockOnly && product.stock === 0) {
          return false;
        }

        return true;
      });
    },
    [advancedFilters]
  );

  const sortProducts = useCallback(
    (productList) => {
      const sorted = [...productList];
      switch (sortBy) {
        case 'price-low':
          return sorted.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        case 'price-high':
          return sorted.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        case 'rating':
          return sorted.sort((a, b) => getProductRating(b) - getProductRating(a));
        case 'newest':
          return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        case 'popularity':
          return sorted.sort((a, b) => getReviewCount(b) - getReviewCount(a));
        default:
          return sorted;
      }
    },
    [sortBy]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (search && selectedCategory) {
        response = await productService.searchAndFilter(search, selectedCategory, page, DEFAULT_LIMIT);
      } else if (selectedCategory) {
        response = await productService.filterByCategory(selectedCategory, page, DEFAULT_LIMIT);
      } else if (search) {
        response = await productService.search(search, page, DEFAULT_LIMIT);
      } else {
        response = await productService.getAll(page, DEFAULT_LIMIT);
      }

      if (response.success) {
        const filteredProducts = applyAdvancedFilters(response.data.products || []);
        const sortedProducts = sortProducts(filteredProducts);
        setProducts(sortedProducts);
        setTotal(response.data.total || sortedProducts.length);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Product fetch error:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, page, applyAdvancedFilters, sortProducts]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchCategories, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchCategories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchProducts, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, 300);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleFiltersChange = useCallback((nextFilters) => {
    setAdvancedFilters(nextFilters);
    setPage(1);
  }, []);

  const handleSortChange = (nextSort) => {
    setSortBy(nextSort);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchInput('');
    setSelectedCategory('');
    setAdvancedFilters({});
    setPage(1);
  };

  const handleCompare = (product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      if (prev.length < 4) {
        return [...prev, product];
      }
      alert('You can only compare up to 4 products');
      return prev;
    });
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters =
    search || selectedCategory || Object.keys(advancedFilters).some((key) => advancedFilters[key]);

  return (
    <div className="min-h-screen bg-transparent">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v0-fade-up { animation: fadeUp 0.5s ease-out both; }
      `}</style>

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="v0-fade-up mb-8">
          <h1 className="mb-2 bg-linear-to-r from-base-content via-base-content/80 to-base-content bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Shop Products
          </h1>
          <p className="text-base-content/70">Browse our collection of {total} products</p>
        </div>

        <div className="v0-fade-up mb-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search Products</span>
              </label>
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                className="input input-bordered w-full transition-all duration-200 focus:scale-[1.01] focus:input-primary"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {search && (
                <p className="mt-1 text-xs text-base-content/60">
                  Searching for: <span className="font-semibold">&quot;{search}&quot;</span>
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full transition-all duration-200 focus:select-primary"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-base-300 pt-4">
              <div className="flex flex-wrap gap-2">
                {search && <div className="badge badge-lg badge-accent">Search: {search}</div>}
                {selectedCategory && <div className="badge badge-lg badge-info">Category: {selectedCategory}</div>}
                {advancedFilters.priceRange && (
                  <div className="badge badge-lg badge-warning">
                    Price: ${advancedFilters.priceRange[0]} - ${advancedFilters.priceRange[1]}
                  </div>
                )}
                {advancedFilters.minRating > 0 && (
                  <div className="badge badge-lg badge-secondary">
                    Rating: {advancedFilters.minRating}★+
                  </div>
                )}
                {advancedFilters.inStockOnly && <div className="badge badge-lg badge-success">In stock</div>}
              </div>
              <button onClick={handleClearFilters} className="btn btn-sm btn-ghost">
                Clear all
              </button>
            </div>
          )}
        </div>

        {!loading && products.length > 0 && (
          <div className="mb-6 text-sm text-base-content/70">
            Showing {(page - 1) * DEFAULT_LIMIT + 1} to {Math.min(page * DEFAULT_LIMIT, total)} of {total} products
          </div>
        )}

        {!loading && products.length > 0 && (
          <ProductSort
            currentSort={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <button
              onClick={() => setFiltersOpen((open) => !open)}
              className="btn btn-outline mb-4 w-full transition-all duration-200 hover:scale-[1.02] lg:hidden"
            >
              🎚️ Filters {compareProducts.length > 0 && `(${compareProducts.length})`}
            </button>

            <div className="hidden lg:block">
              <AdvancedFilters
                filters={advancedFilters}
                onFiltersChange={handleFiltersChange}
                totalProducts={total}
                isOpen={true}
              />

              {compareProducts.length > 0 && (
                <div className="v0-fade-up mt-6 rounded-2xl border border-info/30 bg-info/10 p-4 shadow-sm">
                  <p className="mb-3 font-semibold">Comparing ({compareProducts.length}/4)</p>
                  <div className="mb-3 space-y-2">
                    {compareProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between rounded-lg bg-base-100 p-2 transition-shadow duration-200 hover:shadow-md">
                        <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                        <button onClick={() => handleCompare(product)} className="btn btn-xs btn-ghost">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowComparison(true)} className="btn btn-primary btn-sm w-full transition-all duration-200 hover:scale-[1.02]">
                    Compare ({compareProducts.length})
                  </button>
                </div>
              )}
            </div>

            {filtersOpen && (
              <div className="lg:hidden">
                <AdvancedFilters
                  filters={advancedFilters}
                  onFiltersChange={handleFiltersChange}
                  totalProducts={total}
                  onClose={() => setFiltersOpen(false)}
                  isOpen={filtersOpen}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="alert alert-error mb-6 shadow-lg">
                <span>{error}</span>
                <button onClick={fetchProducts} className="btn btn-sm btn-outline">
                  Retry
                </button>
              </div>
            )}

            {loading && <ProductGridSkeleton count={DEFAULT_LIMIT} />}

            {!loading && products.length > 0 && (
              viewMode === 'grid' ? (
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product, index) => (
                    <div key={product._id} className="v0-fade-up" style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}>
                      <ProductCard product={product} onQuickView={setQuickViewProduct} onCompare={handleCompare} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8 space-y-4">
                  {products.map((product, index) => (
                    <div key={product._id} className="v0-fade-up" style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}>
                      <ProductListCard product={product} onQuickView={setQuickViewProduct} onCompare={handleCompare} />
                    </div>
                  ))}
                </div>
              )
            )}

            {!loading && products.length === 0 && !error && (
              <div className="v0-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100/50 py-16">
                <div className="text-center">
                  <div className="mb-4 text-5xl">📦</div>
                  <h3 className="mt-2 text-lg font-medium text-base-content">No products found</h3>
                  <p className="mt-1 text-sm text-base-content/60">
                    {search || selectedCategory ? 'Try adjusting your search or filter criteria' : 'No products available at the moment'}
                  </p>
                  {hasActiveFilters && (
                    <button onClick={handleClearFilters} className="btn btn-primary btn-sm mt-4 transition-all duration-200 hover:scale-105">
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-6 border-t border-base-300 py-8">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button className="btn btn-outline transition-all duration-200 hover:scale-105 disabled:hover:scale-100" disabled={page === 1} onClick={() => changePage(page - 1)}>
                    ← Previous
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (page <= 3) {
                        pageNum = index + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = page - 2 + index;
                      }

                      return (
                        <button key={pageNum} className={`btn btn-sm transition-all duration-200 hover:scale-105 ${page === pageNum ? 'btn-primary' : 'btn-outline'}`} onClick={() => changePage(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button className="btn btn-outline transition-all duration-200 hover:scale-105 disabled:hover:scale-100" disabled={page === totalPages} onClick={() => changePage(page + 1)}>
                    Next →
                  </button>
                </div>

                <p className="text-sm text-base-content/70">Page {page} of {totalPages}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductQuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <ProductComparisonModal products={compareProducts} isOpen={showComparison} onClose={() => setShowComparison(false)} />
    </div>
  );
};

export default Products;
