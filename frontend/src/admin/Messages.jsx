import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OutOfStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/products/out-of-stock');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStock();
  }, []);

  if (loading) return <p>Loading out-of-stock products...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>No out-of-stock products found.</p>;

  return (
    <div>
      <h2>Out of Stock Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>{product.name}</strong> - Category: {product.category}, Brand: {product.brand}
            <ul>
              {product.sizes.length === 0 ? (
                <li>No sizes available</li>
              ) : (
                product.sizes.map((size, idx) => (
                  <li key={idx}>
                    Size: {size.sizeLabel} - Stock: {size.stock}
                  </li>
                ))
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
