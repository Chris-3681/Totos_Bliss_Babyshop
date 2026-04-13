import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Navbar.css";
import { FaShoppingCart } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const res = await API.get("/cart/");
        const items = Array.isArray(res.data?.items) ? res.data.items : [];

        const totalItems = items.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );

        setCartCount(totalItems);
      } catch (err) {
        console.error("NAVBAR CART COUNT ERROR:", err);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [token, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCartCount(0);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">Totos Bliss</Link>
        <span className="brand-tag">Baby Shop</span>
      </div>

      <nav className="navbar-links">
        <Link className={isActive("/products")} to="/products">
          Products
        </Link>

        {token && (
          <>
           <Link className={`cart-link ${isActive("/cart")}`} to="/cart">
             <FaShoppingCart className="cart-icon" />
             <span className="cart-count">{cartCount}</span>
           </Link>

            <Link className={isActive("/checkout")} to="/checkout">
              Checkout
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link className={isActive("/admin")} to="/admin">
              Dashboard
            </Link>
            <Link className={isActive("/admin/products")} to="/admin/products">
              Inventory
            </Link>
            <Link className={isActive("/admin/orders")} to="/admin/orders">
              Orders
            </Link>
            <Link
              className={isActive("/admin/deliveries")}
              to="/admin/deliveries"
            >
              Deliveries
            </Link>
          </>
        )}

        {!token ? (
          <>
            <Link className={isActive("/login")} to="/login">
              Login
            </Link>
            <Link className={isActive("/register")} to="/register">
              Register
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;