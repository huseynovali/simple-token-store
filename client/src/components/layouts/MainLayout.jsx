import { Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/style/layout.css";

function MainLayout() {
  const { initialized, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/login");
    }
    setLoading(false);
  }, [initialized, isAuthenticated, navigate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  if (!initialized) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return <div>Yetkisiz erişim. Lütfen giriş yapın.</div>;
  }

  return (
    <div>
      <div className="header">
        <ul>
          <li>
            <Link to="/">Ana Sayfa</Link>
          </li>
          <li>
            <Link to="/products">Ürünler</Link>
          </li>
          <li>
            <button onClick={() => navigate("/logout")} className="logout-btn">Çıkış Yap</button>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
