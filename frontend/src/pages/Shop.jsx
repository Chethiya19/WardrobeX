import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  },
  imgWrapper: {
    width: '100%',
    maxHeight: '300px',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    backgroundColor: '#f8f8f8',
  },
  cardBody: {
    padding: '16px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#222',
    marginBottom: '6px',
  },
  brand: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '4px',
  },
  category: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '8px',
  },
  description: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '12px',
    lineHeight: 1.4,
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#28a745',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '40px',
    color: '#666',
  },
  noProducts: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '40px',
    color: '#999',
  },
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      {loading ? (
        <p style={styles.loading}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={styles.noProducts}>No products available.</p>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const [hover, setHover] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    const slug = slugify(product.name);
    navigate(`/product/${slug}`);
  };

  const heartStyle = {
    cursor: 'pointer',
    fontSize: '1.8rem',
    color: liked ? 'red' : '#ccc',
    transition: 'color 0.3s',
    marginLeft: '10px',
  };

  const titleRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  };

  return (
    <div
      style={hover ? { ...styles.card, ...styles.cardHover } : styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleCardClick}
    >
      <div style={styles.imgWrapper}>
        <img
          src={`http://localhost:5000/uploads/products/${product.images?.[0]}`}
          alt={product.name}
          style={styles.img}
        />
      </div>
      <div style={styles.cardBody}>
        <div>
          <div style={titleRowStyle}>
            <div style={styles.title}>{product.name}</div>
            <span
              style={heartStyle}
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                setLiked(!liked);
              }}
              title={liked ? "Remove from wishlist" : "Add to wishlist"}
            >
              ♥
            </span>
          </div>
          <div style={styles.description}>{product.description}</div>
        </div>
        <div style={styles.price}>
          LKR {Number(Number(product.price).toFixed(2)).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}