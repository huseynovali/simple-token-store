import React, { useState } from "react";
import "../assets/style/login.css";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../service/AuthService";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Login Data:", formData);
      AuthService.login(formData.email, formData.password).then((response) => {
        if (response.data.success) {
          console.log("Login successful:", response.data);
          navigate("/dashboard");
        } else {
          console.error("Login failed:", response.data.message);
          alert(response.data.message);
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Şifre:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
