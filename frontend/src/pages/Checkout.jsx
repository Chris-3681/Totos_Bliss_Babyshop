import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Checkout.css";

function Checkout() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCheckout = async () => {
    if (!address || !phone) {
      alert("Please fill in all delivery details");
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage("");

      const orderRes = await API.post("/orders/create");
      const orderId = orderRes.data.order_id;

      await API.post("/delivery/add", {
        order_id: orderId,
        address,
        phone,
      });

      setSuccessMessage("Order placed successfully. Delivery details saved.");
      setAddress("");
      setPhone("");
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      console.log("CHECKOUT DATA:", err.response?.data);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-hero">
        <h1>Secure Checkout</h1>
        <p>Complete your order by entering your delivery details below.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h3>Delivery Information</h3>

          <label>Delivery Address</label>
          <input
            type="text"
            placeholder="Enter your full delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </div>

        <div className="checkout-info-card">
          <h3>Why shop with Totos Bliss?</h3>
          <ul>
            <li>Carefully selected baby products</li>
            <li>Simple and secure checkout flow</li>
            <li>Fast order processing</li>
            <li>VAT included in your final total</li>
          </ul>

          <div className="checkout-note">
            <p>
              Double-check your address and phone number to avoid delivery delays.
            </p>
          </div>

          <div className="checkout-links">
            <Link to="/cart">← Back to Cart</Link>
            <Link to="/products">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;