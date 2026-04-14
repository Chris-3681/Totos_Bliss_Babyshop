import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingBlock from "../components/LoadingBlock";
import Footer from "../components/Footer";
import API from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
      console.log(err.response?.data);
      setOrders([]);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders();
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/admin/${orderId}/status`, { status });
      setSuccessMessage("Order status updated.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2500);
      await fetchOrders();
    } catch (err) {
      console.error("UPDATE ORDER STATUS ERROR:", err);
      console.log(err.response?.data);
      setErrorMessage("Failed to update order status.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 2500);
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <Navbar />
        <LoadingBlock text="Loading orders..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <Navbar />

      <div className="admin-page-header">
        <h1>Orders</h1>
        <p>Track customer orders and update order progress.</p>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}
      {successMessage && <div className="admin-message success">{successMessage}</div>}

      <div className="admin-list-card">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div className="admin-item-card" key={order.id}>
              <div>
                <p><strong>Order #{order.id}</strong></p>
                <p>User ID: {order.user_id}</p>
                <p>Total: KSh {Number(order.total_amount).toLocaleString()}</p>
                <p>Status: {order.status}</p>
                <p>Created At: {order.created_at}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminOrders;