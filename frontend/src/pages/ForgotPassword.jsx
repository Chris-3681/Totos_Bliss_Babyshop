import { useState } from "react";
import API from "../services/api";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      await API.post("/auth/forgot-password", { email });

      setSuccessMessage(
        "If the account exists, a password reset link has been sent to the email address."
      );
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);
      setErrorMessage(
        err.response?.data?.error || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email address to receive a password reset link.
        </p>

        {errorMessage && <div className="form-message error">{errorMessage}</div>}
        {successMessage && <div className="form-message success">{successMessage}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleForgotPassword} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;