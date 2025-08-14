import { useState, useEffect } from "react";
import "../assets/style/login.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, initialized, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [redirecting, setRedirecting] = useState(false); // Yönlendirme sırasında loading

  useEffect(() => {
    if (initialized && isAuthenticated) {
      // Yönlendirme yapılacağı için loading göster
      setRedirecting(true);
      navigate("/");
    }
  }, [initialized, isAuthenticated, navigate]);

  if (!initialized || redirecting) {
    return <div className="loading">Yükleniyor...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData.email, formData.password);
      if (res.data.success) {
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Giriş başarısız");
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
