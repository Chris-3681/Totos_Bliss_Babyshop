import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingBlock from "../components/LoadingBlock";
import Footer from "../components/Footer";
import API from "../services/api";
import "./AdminOrders.css";

function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDeliveries = async () => {
    try {
      const res = await API.get("/delivery/admin");
      setDeliveries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FETCH DELIVERIES ERROR:", err);
      console.log(err.response?.data);
      setDeliveries([]);
    }
  };

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        await fetchDeliveries();
      } finally {
        setLoading(false);
      }
    };

    loadDeliveries();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    try {
      await API.put(`/delivery/admin/${deliveryId}/status`, { status });
      setSuccessMessage("Delivery status updated.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2500);
      await fetchDeliveries();
    } catch (err) {
      console.error("UPDATE DELIVERY STATUS ERROR:", err);
      console.log(err.response?.data);
      setErrorMessage("Failed to update delivery status.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 2500);
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <Navbar />
        <LoadingBlock text="Loading deliveries..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <Navbar />

      <div className="admin-page-header">
        <h1>Deliveries</h1>
        <p>Track delivery progress and update fulfillment status.</p>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}
      {successMessage && <div className="admin-message success">{successMessage}</div>}

      <div className="admin-list-card">
        {deliveries.length === 0 ? (
          <p>No deliveries found</p>
        ) : (
          deliveries.map((delivery) => (
            <div className="admin-item-card" key={delivery.id}>
              <div>
                <p><strong>Delivery #{delivery.id}</strong></p>
                <p>Order ID: {delivery.order_id}</p>
                <p>Address: {delivery.address}</p>
                <p>Phone: {delivery.phone}</p>
                <p>Status: {delivery.status}</p>
              </div>

              <select
                value={delivery.status}
                onChange={(e) => updateStatus(delivery.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminDeliveries;