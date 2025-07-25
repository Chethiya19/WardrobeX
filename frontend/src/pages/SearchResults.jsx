import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const styles = {
  container: {
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  box: {
    width: 'auto',
    height: '263px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#222',
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
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
  },
  cardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  },
  imgWrapper: {
    width: '100%',
    maxHeight: '300px',
    overflow: 'hidden',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    backgroundColor: '#f8f8f8',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    padding: '6px 14px',
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderBottomRightRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    zIndex: 2,
  },
  cardBody: {
    padding: '16px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  titleText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#222',
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
  heartIcon: {
    cursor: 'pointer',
    fontSize: '1.8rem',
    color: '#ccc',
    transition: 'color 0.3s',
    userSelect: 'none',
    marginLeft: '10px',
  },
  heartIconLiked: {
    color: 'red',
  },
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productRes = await axios.get(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
        setProducts(productRes.data);

        try {
          const wishlistRes = await axios.get('http://localhost:5000/api/wishlist', { withCredentials: true });
          setWishlist(wishlistRes.data.map(item => item.productId._id));
          setLoggedIn(true);
        } catch {
          setLoggedIn(false);
          setWishlist([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (query.trim() !== '') {
      fetchData();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const toggleWishlist = async (productId, liked) => {
    if (!loggedIn) {
      Swal.fire({
        title: 'Login Required',
        text: 'You must be logged in to add to your wishlist.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/customer-login');
        }
      });
      return;
    }

    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, { withCredentials: true });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(`http://localhost:5000/api/wishlist/add/${productId}`, {}, { withCredentials: true });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      Swal.fire('Error', 'Error updating wishlist. Please try again.', 'error');
    }
  };

  const handleCardClick = (product) => {
    const slug = slugify(product.name);
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return <p style={styles.loading}>Loading search results for "{query}"...</p>;
  }

  if (!query) {
    return <p style={styles.noProducts}>Please enter a search query.</p>;
  }

  if (products.length === 0) {
    return <div style={styles.box}><p style={styles.noProducts}>No results found for "{query}".</p></div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Results for "{query}"</h2>
      <div style={styles.grid}>
        {products.map(product => {
          const liked = wishlist.includes(product._id);
          const isHovered = hoveredCardId === product._id;
          const isOutOfStock = product.sizes
            ? product.sizes.reduce((acc, size) => acc + (size.stock || 0), 0) === 0
            : false;

          return (
            <div
              key={product._id}
              style={isHovered ? { ...styles.card, ...styles.cardHover } : styles.card}
              onClick={() => handleCardClick(product)}
              onMouseEnter={() => setHoveredCardId(product._id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div style={styles.imgWrapper}>
                <img
                  src={product.images?.[0] ? `http://localhost:5000/uploads/products/${product.images[0]}` : '/placeholder.png'}
                  alt={product.name}
                  style={styles.img}
                />
                {isOutOfStock && <div style={styles.outOfStockOverlay}>Out of Stock</div>}
              </div>
              <div style={styles.cardBody}>
                <div style={styles.titleRow}>
                  <div style={styles.titleText}>{product.name}</div>
                  <span
                    style={{ 
                      ...styles.heartIcon,
                      ...(liked ? styles.heartIconLiked : {})
                    }}
                    onClick={e => {
                      e.stopPropagation(); // Prevent card click navigation
                      toggleWishlist(product._id, liked);
                    }}
                    title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                    role="button"
                    aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    ♥
                  </span>
                </div>
                <div style={styles.description}>{product.description}</div>
                <div style={styles.price}>
                  LKR {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
