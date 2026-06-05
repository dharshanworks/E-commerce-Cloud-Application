import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService.js';
import { useToast } from '../../hooks/useToast.js';
import { OrderManagement } from './OrderManagement.jsx';
import { ProductManagement } from './ProductManagement.jsx';

export const AdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getDashboardStats();

      if (response.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to fetch dashboard stats');
        toast.error('Failed to load dashboard statistics');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch dashboard stats';
      setError(message);
      toast.error(message);
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchDashboardStats, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse bg-base-200">
              <div className="card-body">
                <div className="h-4 w-2/3 rounded bg-base-300"></div>
                <div className="mt-2 h-8 w-1/2 rounded bg-base-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="alert alert-error">
          <span>{error || 'Failed to load dashboard'}</span>
          <button type="button" onClick={fetchDashboardStats} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inTransit = Math.max((stats?.totalOrders || 0) - (stats?.completedOrders || 0), 0);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="card bg-primary text-white shadow transition-shadow hover:shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold">{(stats?.totalOrders || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-success text-white shadow transition-shadow hover:shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Delivered</h3>
            <p className="text-3xl font-bold">{(stats?.completedOrders || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-warning text-white shadow transition-shadow hover:shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-semibold">In Transit</h3>
            <p className="text-3xl font-bold">{inTransit.toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-info text-white shadow transition-shadow hover:shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold">
              ${(stats?.totalRevenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <ProductManagement />
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <OrderManagement />
        </div>
      </div>
    </div>
  );
};
