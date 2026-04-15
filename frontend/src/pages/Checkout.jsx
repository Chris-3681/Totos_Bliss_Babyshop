import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Checkout.css";
import Footer from "../components/Footer";

function Checkout() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    if (!address || !phone) {
      setErrorMessage("Please fill in all delivery details.");
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const orderRes = await API.post("/orders/create");
      const orderId = orderRes.data.order_id;

      await API.post("/delivery/add", {
        order_id: orderId,
        address,
        phone,
      });

      setSuccessMessage("Your order has been placed successfully.");
      setAddress("");
      setPhone("");
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      console.log("CHECKOUT DATA:", err.response?.data);
      setErrorMessage("Checkout failed. Please try again.");
      setSuccessMessage("");
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

      <div className="checkout-reassurance">
        <span>✔ Secure checkout</span>
        <span>✔ Fast delivery within Nairobi</span>
        <span>✔ M-Pesa / bank options available</span>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h3>Delivery Information</h3>

          {errorMessage && <div className="checkout-message error">{errorMessage}</div>}
          {successMessage && <div className="checkout-message success">{successMessage}</div>}

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
            {loading ? "Processing..." : "Secure Your Order"}
          </button>

          <a
            href="https://wa.me/254793838957?text=Hi%20I%20need%20help%20with%20checkout"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-inline checkout-whatsapp"
          >
            Need help? Chat on WhatsApp
          </a>
        </div>

        <div className="checkout-info-card">
          <h3>Why shop with Totos Bliss?</h3>
          <ul>
            <li>Carefully selected baby products</li>
            <li>Simple and secure ordering process</li>
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

      <Footer />
    </div>
  );
}

export default Checkout;