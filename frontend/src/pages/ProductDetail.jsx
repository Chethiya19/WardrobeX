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

    const sizeOptions = {
        Shirts: ['S', 'M', 'L', 'XL'],
        Pants: ['28', '30', '32', '34', '36', '38'],
        Frocks: ['S', 'M', 'L', 'XL'],
        Tops: ['S', 'M', 'L', 'XL'],
        Kids: ['XS', 'S'],
        Shoes: ['6', '7', '8', '9', '10'],
        Bags: [],
        Accessories: []
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/name/${slug}`)
            .then(res => setProduct(res.data))
            .catch(() => setProduct(null));
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

            Swal.fire('Success', res.data.message || 'Product added to cart!', 'success');
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
        const sizes = sizeOptions[product.category] || [];
        if (!sizes.length) return null;

        return (
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem', whiteSpace: 'nowrap' }}>Select Size:</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(prev => (prev === size ? '' : size))}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: selectedSize === size ? '2px solid #28a745' : '1px solid #ccc',
                                backgroundColor: selectedSize === size ? '#e6f9ed' : '#fff',
                                cursor: 'pointer',
                                fontWeight: '600',
                                minWidth: '48px',
                            }}
                        >
                            {size}
                        </button>
                    ))}
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
                    <h2>{product.name}</h2>
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
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        style={{ width: '70px', padding: '6px', fontSize: '1rem' }}
                    />
                    <button
                        onClick={handleAddToCart}
                        style={{
                            padding: '10px 25px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginLeft: '120px',
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
