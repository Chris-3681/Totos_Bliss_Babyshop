import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Cart.css";

function Cart() {
  const [cartData, setCartData] = useState({
    items: [],
    subtotal: 0,
    vat: 0,
    total: 0,
  });

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
      } catch (err) {
        console.error("CART FETCH ERROR:", err);
        setCartData({ items: [], subtotal: 0, vat: 0, total: 0 });
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-hero">
        <h1>Your Shopping Cart</h1>
        <p>Review your selected baby products before placing your order.</p>
      </div>

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
                <div className="cart-image-placeholder">Baby Item</div>

                <div className="cart-card-content">
                  <h3>Selected Product</h3>
                  <p>Product ID: {item.product_id}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Unit Price: KSh {Number(item.price).toLocaleString()}</p>
                  <p className="cart-subtotal">
                    Item Total: KSh {Number(item.subtotal).toLocaleString()}
                  </p>
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
    </div>
  );
}

export default Cart;