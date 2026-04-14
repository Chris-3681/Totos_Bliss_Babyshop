import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      await API.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });

      setSuccessMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);
      setErrorMessage(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your new password below.
        </p>

        {errorMessage && <div className="form-message error">{errorMessage}</div>}
        {successMessage && <div className="form-message success">{successMessage}</div>}

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
  );
}

export default ResetPassword;