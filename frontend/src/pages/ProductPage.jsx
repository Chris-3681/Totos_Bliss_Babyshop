import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Products.css";
import Navbar from "../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("PRODUCTS ERROR:", err);
      });
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        product_id: productId,
        quantity: 1,
      });
      alert("Item added to cart");
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      console.log("ADD TO CART DATA:", err.response?.data);
      alert("Failed to add to cart");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (maxPrice) {
      result = result.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (inStockOnly) {
      result = result.filter((p) => Number(p.stock) > 0);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, sortBy, maxPrice, inStockOnly]);

  return (
    
    <div className="products-page">
      <Navbar />
      <div className="store-hero">
      <div className="hero-content">
        <h1>Everything Your Baby Needs, In One Place</h1>
        <p>
          Quality baby clothing, essentials, and accessories curated for comfort,
          safety, and style.
        </p>
      </div>
    </div>

  <div className="trust-strip">
    <div>✔ Quality Checked Products</div>
    <div>✔ Affordable Prices</div>
    <div>✔ Fast Order Processing</div>
    <div>✔ Trusted by Parents</div>
  </div>
      <header className="store-topbar">
        <div>
          <h1>Totos Bliss</h1>
          <p className="muted">Baby essentials, clothing and accessories</p>
        </div>

        
        
      </header>

      <div className="products-layout">
        <aside className="filter-sidebar">
          <h3>Filters</h3>

          <label className="filter-block">
            <span>Search products</span>
            <input
              type="text"
              placeholder="Search baby products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label className="filter-block">
            <span>Max price</span>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <div>
              <strong>{filteredProducts.length}</strong> products
            </div>

            <div className="toolbar-controls">
              <label>
                Sort by:
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products found.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div className="product-card" key={p.id}>
                  <div className="product-image-wrap">
                    <img
                      src={
                        p.image_url ||
                        "https://via.placeholder.com/320x220?text=Totos+Bliss"
                      }
                      alt={p.name}
                      className="product-image"
                    />
                    <span className="quick-tag">Quick View</span>
                  </div>

                  <div className="product-body">
                    <h3 className="product-title">{p.name}</h3>
                      <p className="product-description">
                        {p.description || "Comfortable, high-quality baby product"}
                      </p>
x
                    <p className="product-price">KSh {Number(p.price).toLocaleString()}</p>

                    <div className="product-meta">
                      <span className={Number(p.stock) > 0 ? "in-stock" : "out-stock"}>
                        {Number(p.stock) > 0 ? `In stock: ${p.stock}` : "Out of stock"}
                      </span>
                    </div>

                    <button
                      className="primary-btn"
                      onClick={() => addToCart(p.id)}
                      disabled={Number(p.stock) <= 0}
                    >
                      {Number(p.stock) > 0 ? "Add to Cart" : "Unavailable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;