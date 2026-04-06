import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/admin")
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("FETCH ORDERS ERROR:", err);
        console.log("FETCH ORDERS DATA:", err.response?.data);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Admin Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <p><strong>Order #{order.id}</strong></p>
            <p>User ID: {order.user_id}</p>
            <p>Total: {order.total_amount}</p>
            <p>Status: {order.status}</p>
            <p>Created At: {order.created_at}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;