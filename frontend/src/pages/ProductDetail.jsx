import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const navigate = useNavigate();

    const [sizeStock, setSizeStock] = useState({});

    const sizeOptions = {
        Shirts: ['S', 'M', 'L', 'XL'],
        Pants: ['28', '30', '32', '34', '36', '38'],
        Frocks: ['S', 'M', 'L', 'XL'],
        Tops: ['S', 'M', 'L', 'XL'],
        Kids: ['XS', 'S'],
        Shoes: ['5', '6', '7', '8', '9', '10'],
        Bags: [],
        Accessories: []
    };

    useEffect(() => {
        const fetchProductAndStock = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/name/${slug}`);
                setProduct(res.data);

                const stockRes = await axios.get(`http://localhost:5000/api/products/stock/${res.data._id}`);
                setSizeStock(stockRes.data); // e.g. { S: 10, M: 0, L: 5 }
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchProductAndStock();
    }, [slug]);

    if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading or Product Not Found</div>;

    const handleAddToCart = async () => {
        if (sizeOptions[product.category]?.length > 0 && !selectedSize) {
            Swal.fire('Select Size', 'Please select a size before adding to cart.', 'warning');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/cart/add', {
                productId: product._id,
                size: selectedSize,
                quantity,
            }, { withCredentials: true });

            Swal.fire('Success', res.data.message || 'Product added to cart!', 'success')
                .then(() => {
                    window.location.reload();
                });
        } catch (err) {
            if (err.response?.status === 401) {
                Swal.fire({
                    title: 'Login Required',
                    text: 'Please login to add to cart.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Login',
                    cancelButtonText: 'Cancel',
                }).then(result => {
                    if (result.isConfirmed) {
                        navigate('/customer-login');
                    }
                });
            } else {
                Swal.fire('Error', 'Failed to add to cart', 'error');
            }
        }
    };

    const renderSizeButtons = () => {
        if (!sizeOptions[product.category] || sizeOptions[product.category].length === 0) return null;

        return (
            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Select Size:
                </span>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}>
                    {product?.sizes.map(({ sizeLabel }) => {
                        const isAvailable = sizeStock[sizeLabel] > 0;
                        const isSelected = selectedSize === sizeLabel;

                        return (
                            <button
                                key={sizeLabel}
                                onClick={() => {
                                    if (isAvailable) {
                                        setSelectedSize(prev => prev === sizeLabel ? '' : sizeLabel);
                                    }
                                }}
                                disabled={!isAvailable}
                                title={!isAvailable ? 'Out of Stock' : ''}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '2px solid',
                                    borderColor: isSelected
                                        ? '#28a745'
                                        : isAvailable
                                            ? '#999'
                                            : '#999',
                                    borderStyle: isAvailable
                                        ? 'solid'
                                        : 'dashed',
                                    backgroundColor: isSelected ? '#e6f9ed' : '#fff',
                                    color: isAvailable ? '#000' : '#999',
                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                    opacity: isAvailable ? 1 : 0.6,
                                    fontWeight: '600',
                                    minWidth: '48px',
                                }}
                            >
                                {sizeLabel}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            maxWidth: '900px',
            margin: '40px auto',
            padding: '20px',
            display: 'flex',
            gap: '40px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}>
            <div style={{
                flex: '1 1 40%',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img
                    src={`http://localhost:5000/uploads/products/${product.images?.[0]}`}
                    alt={product.name}
                    style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                    }}
                />
            </div>

            <div style={{
                flex: '1 1 60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                padding: '30px 25px',
                color: '#333',
            }}>
                <div>
                    <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{product.name}</span>
                        {Object.values(sizeStock).every(count => count === 0) && (
                            <div style={{
                                // border: '2px solid rgba(220, 53, 69, 0.7)',
                                color: '#fff',
                                backgroundColor: 'rgba(220, 53, 69, 0.8)',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                display: 'inline-block',
                            }}>
                                Out of Stock
                            </div>
                        )}
                    </h2>
                    <p>{product.description}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p>{product.gender}</p>
                    <p style={{
                        color: '#28a745',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '20px 0',
                    }}>
                        LKR {Number(product.price).toFixed(2).toLocaleString('en-LK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>

                    {renderSizeButtons()}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', gap: '10px' }}>
                    <label htmlFor="quantity" style={{ fontWeight: '600', fontSize: '1rem' }}>
                        Quantity:
                    </label>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        height: '40px',
                    }}>
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: 'none',
                                padding: '0 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#333',
                                height: '100%',
                            }}
                        >
                            –
                        </button>

                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                    setQuantity(value);
                                }
                            }}
                            style={{
                                width: '60px',
                                textAlign: 'center',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                height: '100%',
                            }}
                        />

                        <button
                            onClick={() => setQuantity(prev => prev + 1)}
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: 'none',
                                padding: '0 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#333',
                                height: '100%',
                            }}
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={Object.values(sizeStock).every(count => count === 0)}
                        style={{
                            padding: '10px 25px',
                            backgroundColor: Object.values(sizeStock).every(count => count === 0) ? '#ccc' : '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: Object.values(sizeStock).every(count => count === 0) ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            marginLeft: 'auto',
                            fontWeight: 600,
                        }}
                    >
                        {Object.values(sizeStock).every(count => count === 0) ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
