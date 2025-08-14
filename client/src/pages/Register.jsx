import React, { useState } from "react";
import "../assets/style/register.css";
import { AuthService } from "../service/AuthService";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!');
      return;
    }

    AuthService
      .register(formData.email, formData.password, formData.name)
      .then((response) => {
        if (response.data.success) {
          console.log("Registration successful:", response.data);
     
          alert("Kayıt başarılı! Giriş yapabilirsiniz.");
          navigate("/login");
        } else {
          console.error("Registration failed:", response.data.message);
          alert(response.data.message);
        }
      }).catch((error) => {
        console.error("Registration request error:", error);
        alert('Kayıt sırasında bir hata oluştu');
      });
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
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
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Şifre Tekrar:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="register-button">
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
