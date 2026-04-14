import { useEffect, useState } from "react";
import API from "../services/api";
import "./BestSellers.css";

function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products/")
      .then(res => {
        setProducts(res.data.slice(0, 4)); // top 4 only
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="best-sellers">
      <h2>Best Sellers</h2>

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h4>{p.name}</h4>
            <p>KES {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestSellers;