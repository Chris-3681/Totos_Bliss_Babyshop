import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrustStrip from "../components/TrustStrip";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <div className="hero-card">
        <div className="hero-left">
          <p className="hero-kicker">Totos Bliss Baby Shop</p>
          <h1>Quality Baby Products Parents Trust</h1>
          <p>
           Shop affordable baby essentials, clothing, and accessories with fast order
           processing and reliable delivery.
          </p>

          <Link to="/products" className="hero-primary">
            Shop Best Sellers
          </Link>
        </div>
      </div>

      <TrustStrip />
      <Categories />
      <BestSellers />

      <Footer />
      
    </div>
  );
}

export default Home;