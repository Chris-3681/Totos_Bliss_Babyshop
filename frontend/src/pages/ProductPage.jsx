import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import "./Products.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingBlock from "../components/LoadingBlock";
import { FaSlidersH } from "react-icons/fa";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    text: "",
  });

  const whatsappNumber = "254700000000";

  useEffect(() => {
    API.get("/products/")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("PRODUCTS ERROR:", err);
        setToast({
          show: true,
          type: "error",
          text: "Failed to load products.",
        });

        setTimeout(() => {
          setToast({ show: false, type: "", text: "" });
        }, 2500);
      })
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        product_id: productId,
        quantity: 1,
      });

      setToast({
        show: true,
        type: "success",
        text: "Item added to cart successfully.",
      });

      setTimeout(() => {
        setToast({ show: false, type: "", text: "" });
      }, 2500);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      console.log("ADD TO CART DATA:", err.response?.data);

      setToast({
        show: true,
        type: "error",
        text: "Failed to add item to cart.",
      });

      setTimeout(() => {
        setToast({ show: false, type: "", text: "" });
      }, 2500);
    }
  };

  const buildWhatsAppLink = (product) => {
    const message = `Hi, I am interested in this product:

${product.name}
Price: KSh ${Number(product.price).toLocaleString()}

Link: ${window.location.origin}/products`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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

      {toast.show && (
        <div className={`toast-message ${toast.type}`}>
          {toast.text}
        </div>
      )}

      <div className="store-hero">
        <div className="hero-content">
          <h1>Everything Your Baby Needs</h1>
          <p>
            Quality baby essentials, clothing, and accessories curated for comfort,
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

        <button
          className="filter-toggle-btn"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          <FaSlidersH />
          <span>Filter & Sort</span>
        </button>
      </header>

      <div className={`products-top-filters ${filtersOpen ? "open" : ""}`}>
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

        <label className="filter-block">
          <span>Sort by</span>
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

        <label className="checkbox-row top-checkbox">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span>Available only</span>
        </label>
      </div>

      <main className="products-main">
        <div className="products-toolbar">
          <div>
            <strong>{filteredProducts.length}</strong> products
          </div>
        </div>

        {loading ? (
          <LoadingBlock text="Loading products..." />
        ) : filteredProducts.length === 0 ? (
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
                      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={p.name}
                    className="product-image"
                  />
                </div>

                <div className="product-body">
                  <h3 className="product-title">{p.name}</h3>

                  <p className="product-description">
                    {p.description || "Comfortable, high-quality baby product"}
                  </p>

                  <div className="product-trust">
                    <span>✔ Quality checked</span>
                    <span>✔ Fast delivery available</span>
                  </div>

                  <p className="product-price">
                    KSh {Number(p.price).toLocaleString()}
                  </p>

                  <div className="product-meta">
                    {Number(p.stock) > 0 ? (
                      <span className="in-stock">Available</span>
                    ) : (
                      <span className="out-stock">Out of stock</span>
                    )}
                  </div>

                  <button
                    className="primary-btn"
                    onClick={() => addToCart(p.id)}
                    disabled={Number(p.stock) <= 0}
                  >
                    {Number(p.stock) > 0 ? "Add to Cart" : "Unavailable"}
                  </button>

                  <a
                    href={buildWhatsAppLink(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-inline"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProductPage;