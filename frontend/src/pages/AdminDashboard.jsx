import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingBlock from "../components/LoadingBlock";
import Footer from "../components/Footer";
import API from "../services/api";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, deliveriesRes] = await Promise.all([
          API.get("/products/"),
          API.get("/orders/admin"),
          API.get("/delivery/admin"),
        ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setDeliveries(Array.isArray(deliveriesRes.data) ? deliveriesRes.data : []);
      } catch (err) {
        console.error("DASHBOARD FETCH ERROR:", err);
        console.log(err.response?.data);
        setProducts([]);
        setOrders([]);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <Navbar />
        <LoadingBlock text="Loading dashboard..." />
        <Footer />
      </div>
    );
  }

  const lowStockCount = products.filter((p) => Number(p.stock) <= 3).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length;

  return (
    <div className="admin-dashboard-page">
      <Navbar />

      <div className="admin-hero">
        <h1>Admin Dashboard</h1>
        <p>Manage products, monitor orders, and track deliveries from one place.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>

        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>

        <div className="stat-card">
          <h3>{pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card">
          <h3>{lowStockCount}</h3>
          <p>Low Stock Items</p>
        </div>

        <div className="stat-card">
          <h3>{deliveries.length}</h3>
          <p>Total Deliveries</p>
        </div>

        <div className="stat-card">
          <h3>{pendingDeliveries}</h3>
          <p>Pending Deliveries</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/products" className="admin-btn">Manage Products</Link>
        <Link to="/admin/orders" className="admin-btn">Manage Orders</Link>
        <Link to="/admin/deliveries" className="admin-btn">Manage Deliveries</Link>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;