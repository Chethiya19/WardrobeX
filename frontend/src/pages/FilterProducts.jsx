import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const styles = {
    container: {
        maxWidth: 1200,
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '30px',
        textTransform: 'capitalize',
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
        maxHeight: 300,
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
        padding: 16,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#222',
        marginBottom: 6,
    },
    description: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: 12,
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
        padding: 40,
        color: '#666',
    },
    noProducts: {
        textAlign: 'center',
        fontSize: '1.2rem',
        padding: 40,
        color: '#999',
    },
};

function slugify(text) {
    return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-');
}

export default function FilterProducts() {
    const { gender, category } = useParams();
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

    const heading = gender
        ? capitalize(gender) + (category ? ` / ${capitalize(category)}` : '')
        : category
            ? capitalize(category)
            : 'All Products';

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let url = '';
                if (gender && category) {
                    url = `http://localhost:5000/api/products/category/${category}/gender/${gender}`;
                } else if (category) {
                    url = `http://localhost:5000/api/products/category/${category}`;
                } else if (gender) {
                    url = `http://localhost:5000/api/products/gender/${gender}`;
                } else {
                    url = `http://localhost:5000/api/products`;
                }

                const productRes = await axios.get(url);
                setProducts(productRes.data);

                try {
                    const wishlistRes = await axios.get('http://localhost:5000/api/wishlist', { withCredentials: true });
                    setWishlist(wishlistRes.data.map(item => item.productId._id));
                    setLoggedIn(true);
                } catch {
                    setLoggedIn(false);
                }

            } catch (err) {
                setProducts([]);
                setWishlist([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [gender, category]);

    const toggleWishlist = async (productId, liked) => {
        if (!loggedIn) {
            Swal.fire({
                title: 'Login Required',
                text: 'You must be logged in to add to your wishlist.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel',
            }).then((result) => {
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

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{heading}</h2>
            {loading ? (
                <p style={styles.loading}>Loading products...</p>
            ) : products.length === 0 ? (
                <p style={styles.noProducts}>No products found.</p>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            liked={wishlist.includes(product._id)}
                            toggleWishlist={toggleWishlist}
                            navigate={navigate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ProductCard({ product, liked, toggleWishlist, navigate }) {
    const [hover, setHover] = useState(false);

    const handleCardClick = () => {
        const slug = slugify(product.name);
        navigate(`/product/${slug}`);
    };

    const heartStyle = {
        cursor: 'pointer',
        fontSize: '1.8rem',
        color: liked ? 'red' : '#ccc',
        transition: 'color 0.3s',
        marginLeft: 10,
    };

    const titleRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
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
                                e.stopPropagation();
                                toggleWishlist(product._id, liked);
                            }}
                            title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            ♥
                        </span>
                    </div>
                    <div style={styles.description}>{product.description}</div>
                </div>
                <div style={styles.price}>
                    LKR {Number(Number(product.price).toFixed(2)).toLocaleString('en-LK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            </div>
        </div>
    );
}
