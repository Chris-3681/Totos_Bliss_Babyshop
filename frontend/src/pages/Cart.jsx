import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Cart.css";
import Footer from "../components/Footer";

function Cart() {
  const [cartData, setCartData] = useState({
    items: [],
    subtotal: 0,
    vat: 0,
    total: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart/");

        const safeData = {
          items: Array.isArray(res.data?.items) ? res.data.items : [],
          subtotal: Number(res.data?.subtotal || 0),
          vat: Number(res.data?.vat || 0),
          total: Number(res.data?.total || 0),
        };

        setCartData(safeData);
        setErrorMessage("");
      } catch (err) {
        console.error("CART FETCH ERROR:", err);
        setCartData({ items: [], subtotal: 0, vat: 0, total: 0 });
        setErrorMessage("Unable to load your cart right now.");
      }
    };

    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`);

      setCartData((prev) => {
        const updatedItems = prev.items.filter(
          (item) => item.product_id !== productId
        );

        const subtotal = updatedItems.reduce(
          (sum, item) => sum + Number(item.subtotal),
          0
        );
        const vat = subtotal * 0.16;
        const total = subtotal + vat;

        return {
          items: updatedItems,
          subtotal,
          vat,
          total,
        };
      });

      setSuccessMessage("Item removed from cart.");
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("REMOVE ITEM ERROR:", err);
      setErrorMessage("Failed to remove item from cart.");
      setSuccessMessage("");

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-hero">
        <h1>Your Shopping Cart</h1>
        <p>Review your selected baby products before placing your order.</p>
      </div>

      {errorMessage && <div className="cart-message error">{errorMessage}</div>}
      {successMessage && <div className="cart-message success">{successMessage}</div>}

      {cartData.items.length === 0 ? (
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
          <p>Add a few lovely baby products and come back here.</p>
          <Link to="/products" className="cart-primary-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartData.items.map((item, index) => (
              <div className="cart-card" key={index}>
                <div className="cart-image-wrap">
                  <img
                    src={
                      item.image_url ||
                      "https://via.placeholder.com/220x220?text=Totos+Bliss"
                    }
                    alt={item.name}
                    className="cart-product-image"
                  />
                </div>

                <div className="cart-card-content">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: KSh {Number(item.price).toLocaleString()}</p>
                  <p className="cart-subtotal">
                    Item Total: KSh {Number(item.subtotal).toLocaleString()}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>KSh {cartData.subtotal.toLocaleString()}</strong>
            </div>

            <div className="summary-row">
              <span>VAT (16%)</span>
              <strong>KSh {cartData.vat.toLocaleString()}</strong>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <strong>KSh {cartData.total.toLocaleString()}</strong>
            </div>

            <Link to="/checkout" className="cart-primary-btn">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="cart-secondary-link">
              ← Back to Products
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Cart;