import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FETCH PRODUCTS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      await API.post("/products/", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: form.image_url,
      });

      alert("Product created successfully");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
      });

      fetchProducts();
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      console.log("CREATE PRODUCT DATA:", err.response?.data);
      alert("Failed to create product");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Admin Products</h2>

      <h3>Add Product</h3>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <br />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <br />

      <input
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />
      <br />

      <input
        placeholder="Image URL"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
      />
      <br />

      <button onClick={handleCreateProduct}>Create Product</button>

      <hr />

      <h3>All Products</h3>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <p><strong>{product.name}</strong></p>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default AdminProducts;