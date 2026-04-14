import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password) {
      setErrorMessage("Please fill in all fields.");
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await API.post("/auth/register", form);

      setSuccessMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Registration failed. Please try again.";

      setErrorMessage(backendMessage);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Join Totos Bliss and start shopping for your baby.
        </p>

        {errorMessage && (
          <div className="form-message error">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="form-message success">{successMessage}</div>
        )}

        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;