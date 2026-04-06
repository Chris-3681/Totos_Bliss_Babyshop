import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <div className="hero-card">
        <div className="hero-left">
          <p className="hero-kicker">Totos Bliss Baby Shop</p>
          <h1>Baby essentials, clothing and accessories in one place</h1>
          <p>
            Shop quality baby products, manage your cart easily, and complete your
            order in minutes.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-primary">Shop Now</Link>
            <Link to="/login" className="hero-secondary">Login</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel">
            <h3>Why shop with us?</h3>
            <p>Quality baby products</p>
            <p>Simple ordering process</p>
            <p>Admin-managed inventory</p>
            <p>VAT clearly included</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;