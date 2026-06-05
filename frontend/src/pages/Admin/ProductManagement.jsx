import { useEffect, useState, useCallback } from 'react';
import { productService } from '../../services/productService.js';
import { SectionTitle } from '../../components/ui/SectionTitle.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getDisplayPrice } from '../../utils/productUtils.js';

const emptyForm = {
  name: '',
  description: '',
  brand: '',
  category: 'Electronics',
  price: '',
  salePrice: '',
  stock: '',
  images: '',
};

const fallbackCategories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Food & Groceries',
  'Other',
];

const buildPayload = (form) => ({
  name: form.name.trim(),
  description: form.description.trim(),
  brand: form.brand.trim(),
  category: form.category,
  price: Number(form.price),
  salePrice: form.salePrice === '' ? null : Number(form.salePrice),
  stock: Number(form.stock),
  images: form.images
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean),
});

export const ProductManagement = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(1, 100);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();
      if (response.success && response.data.categories?.length) {
        setCategories(response.data.categories);
      }
    } catch {
      setCategories(fallbackCategories);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProducts();
      fetchCategories();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts, fetchCategories]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      category: product.category || 'Electronics',
      price: product.price?.toString() || '',
      salePrice: product.salePrice?.toString() || '',
      stock: product.stock?.toString() || '',
      images: (product.images || []).join('\n'),
    });
  };

  const validateForm = () => {
    const payload = buildPayload(form);

    if (!payload.name || !payload.description || !payload.brand || !payload.category) {
      toast.error('Please fill all required product fields');
      return null;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      toast.error('Price must be a valid positive number');
      return null;
    }

    if (payload.salePrice !== null && (!Number.isFinite(payload.salePrice) || payload.salePrice >= payload.price)) {
      toast.error('Sale price must be lower than the regular price');
      return null;
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      toast.error('Stock must be a valid non-negative integer');
      return null;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    setSaving(true);
    try {
      if (editingId) {
        await productService.update(editingId, payload);
        toast.success('Product updated');
      } else {
        await productService.create(payload);
        toast.success('Product created');
      }
      resetForm();
      await fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      await productService.remove(product._id);
      toast.success('Product deleted');
      await fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Product Management" subtitle="Create, update, and remove products" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-base-300 bg-base-100 p-4 md:grid-cols-2">
        <input name="name" value={form.name} onChange={handleChange} className="input input-bordered" placeholder="Product name" required />
        <input name="brand" value={form.brand} onChange={handleChange} className="input input-bordered" placeholder="Brand" required />
        <select name="category" value={form.category} onChange={handleChange} className="select select-bordered" required>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} className="input input-bordered" placeholder="Stock" required />
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="input input-bordered" placeholder="Regular price" required />
        <input name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} className="input input-bordered" placeholder="Sale price (optional)" />
        <textarea name="description" value={form.description} onChange={handleChange} className="textarea textarea-bordered md:col-span-2" placeholder="Description" required rows={3} />
        <textarea name="images" value={form.images} onChange={handleChange} className="textarea textarea-bordered md:col-span-2" placeholder="Image URLs, one per line. Leave empty to auto-fetch a product image." rows={3} />
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn btn-ghost">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading loading-spinner loading-lg" />
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.primaryImage || product.images?.[0] || 'https://via.placeholder.com/64?text=Product'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-base-content/60">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${getDisplayPrice(product).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(product)} className="btn btn-xs btn-outline">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(product)} className="btn btn-xs btn-error">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
