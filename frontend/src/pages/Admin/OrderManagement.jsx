import { useEffect, useState, useCallback } from 'react';
import { orderService } from '../../services/orderService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { useToast } from '../../hooks/useToast.js';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const OrderManagement = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchOrders, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchOrders]);

  const startEditing = (order) => {
    setSelectedOrderId(order._id);
    setNewStatus(order.orderStatus);
  };

  const handleStatusUpdate = async (orderId) => {
    if (!newStatus) {
      toast.warning('Please select a status');
      return;
    }

    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      setSelectedOrderId(null);
      setNewStatus('');
      await fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Order Management</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order #</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="font-mono text-sm">{order.orderNumber}</td>
                <td>{order.user?.name || 'Unknown user'}</td>
                <td className="font-bold">${(order.pricing?.total || 0).toFixed(2)}</td>
                <td>
                  <span className="badge badge-lg">{order.orderStatus}</span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {selectedOrderId === order._id ? (
                    <div className="flex gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="select select-bordered select-sm"
                      >
                        <option value="">Select</option>
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleStatusUpdate(order._id)} className="btn btn-sm btn-primary">
                        Save
                      </button>
                      <button onClick={() => setSelectedOrderId(null)} className="btn btn-sm btn-ghost">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEditing(order)} className="btn btn-sm btn-outline">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
