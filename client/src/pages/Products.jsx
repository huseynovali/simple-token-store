import React, { useState, useEffect } from 'react'
import { ProductService } from '../service/ProductService'
import '../assets/style/products.css'

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProducts();
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        }
        setError(null);
      } catch (err) {
        console.error("Ürünleri getirirken hata:", err);
        setError("Ürünleri yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Ürünler yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-container">
      <h1>Ürünlerimiz</h1>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price} TL</p>
                <button className="add-to-cart">Sepete Ekle</button>
              </div>
            </div>
          ))
        ) : (
          <p>Ürün bulunamadı</p>
        )}
      </div>
    </div>
  );
}

export default Products