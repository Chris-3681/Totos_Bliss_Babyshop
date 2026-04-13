import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Login failed. Please try again.";

      setErrorMessage(backendMessage);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Totos Bliss</h1>
        <p className="auth-subtitle">
          Welcome back. Log in to continue shopping for your baby.
        </p>

        {errorMessage && (
          <div className="form-message error">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="form-message success">{successMessage}</div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;