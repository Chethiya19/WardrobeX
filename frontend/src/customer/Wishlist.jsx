import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const styles = {
  container: {
    maxWidth: 1200,
    margin: 'auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
    backgroundColor: '#f8f8f8',
  },
  cardBody: {
    padding: '16px',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#222',
    marginBottom: '6px',
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
  noWishlist: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '40px',
    color: '#999',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: '1.8rem',
    color: 'red',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
};

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-');
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await axios.get('http://localhost:5000/api/wishlist', { withCredentials: true });
        setWishlistItems(res.data);
      } catch (err) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to view your wishlist.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
        }).then(result => {
          if (result.isConfirmed) {
            navigate('/customer-login');
          }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        withCredentials: true,
      });
      setWishlistItems(prev => prev.filter(item => item.productId._id !== productId));
    } catch (err) {
      Swal.fire('Error', 'Failed to remove from wishlist', 'error');
    }
  };

  if (loading) {
    return <p style={styles.loading}>Loading wishlist...</p>;
  }

  if (wishlistItems.length === 0) {
    return <p style={styles.noWishlist}>Your wishlist is empty.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Your Wishlist</h2>
      <div style={styles.grid}>
        {wishlistItems.map(item => {
          const product = item.productId;
          return (
            <div
              key={product._id}
              style={styles.card}
              onClick={() => navigate(`/product/${slugify(product.name)}`)}
            >
              <div style={styles.imgWrapper}>
                <img
                  src={`http://localhost:5000/uploads/products/${product.images?.[0]}`}
                  alt={product.name}
                  style={styles.img}
                />
              </div>
              <div style={styles.cardBody}>
                <div style={styles.title}>{product.name}</div>
                <div style={styles.description}>{product.description}</div>
                <div style={styles.price}>
                  LKR {Number(product.price).toLocaleString('en-LK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <button
                style={styles.heartButton}
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  removeFromWishlist(product._id);
                }}
                title="Remove from wishlist"
              >
                ♥
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
