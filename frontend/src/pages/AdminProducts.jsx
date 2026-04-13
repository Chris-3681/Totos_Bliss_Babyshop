import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingBlock from "../components/LoadingBlock";
import Footer from "../components/Footer";
import API from "../services/api";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FETCH PRODUCTS ERROR:", err);
      console.log(err.response?.data);
      setProducts([]);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPreviewImage("");
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setForm({ ...form, image: file });

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      setErrorMessage("Name, price, and stock are required.");
      setSuccessMessage("");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Product updated successfully.");
      } else {
        await API.post("/products/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Product created successfully.");
      }

      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2500);

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("PRODUCT SUBMIT ERROR:", err);
      console.log(err.response?.data);
      setErrorMessage("Failed to save product.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 2500);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setPreviewImage(product.image_url || "");
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    try {
      await API.delete(`/products/${productId}`);
      setSuccessMessage("Product deleted successfully.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2500);
      await fetchProducts();
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      console.log(err.response?.data);
      setErrorMessage("Failed to delete product.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 2500);
    }
  };

  if (loading) {
    return (
      <div className="admin-products-page">
        <Navbar />
        <LoadingBlock text="Loading inventory..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <Navbar />

      <div className="inventory-hero">
        <div>
          <p className="inventory-kicker">Admin Panel</p>
          <h1>Inventory Management</h1>
          <p className="inventory-subtitle">
            Add new products, update existing ones, and keep your catalog clean.
          </p>
        </div>
        <div className="inventory-summary-box">
          <span className="inventory-summary-label">Total Products</span>
          <strong>{products.length}</strong>
        </div>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}
      {successMessage && <div className="admin-message success">{successMessage}</div>}

      <div className="inventory-layout">
        <div className="inventory-form-card">
          <div className="section-head">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
            <p>
              {editingId
                ? "Update the selected product details."
                : "Create a new product for the storefront."}
            </p>
          </div>

          <div className="form-grid">
            <div className="form-field full">
              <label>Product Name</label>
              <input
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-field full">
              <label>Description</label>
              <textarea
                placeholder="Write a short product description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-field">
              <label>Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Stock</label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            <div className="form-field full">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {previewImage && (
            <div className="image-preview-box">
              <img src={previewImage} alt="Preview" className="image-preview" />
            </div>
          )}

          <div className="form-actions">
            <button className="primary-action-btn" onClick={handleSubmit}>
              {editingId ? "Update Product" : "Create Product"}
            </button>

            {editingId && (
              <button className="secondary-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div className="inventory-list-card">
          <div className="section-head">
            <h2>Inventory List</h2>
            <p>Manage all products currently visible in the store.</p>
          </div>

          {products.length === 0 ? (
            <div className="empty-inventory">
              <p>No products found.</p>
            </div>
          ) : (
            <div className="inventory-grid">
              {products.map((product) => (
                <div className="inventory-product-card" key={product.id}>
                  <div className="inventory-image-wrap">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="inventory-product-image"
                      />
                    ) : (
                      <div className="inventory-image-placeholder">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="inventory-product-body">
                    <h3>{product.name}</h3>
                    <p className="inventory-description">
                      {product.description || "No description added."}
                    </p>

                    <div className="inventory-meta">
                      <span>KSh {Number(product.price).toLocaleString()}</span>
                      <span>Stock: {product.stock}</span>
                    </div>

                    <div className="inventory-card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminProducts;