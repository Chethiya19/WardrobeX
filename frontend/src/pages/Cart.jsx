import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
// import './Header.css';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch cart items
    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
            setCartItems(res.data);
            calculateTotal(res.data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        }
    };

    // Calculate total price
    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
        setTotal(sum);
    };

    // Remove item from cart
    const handleRemove = async (productId, size) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
                withCredentials: true,
                params: { size },
            });

            const updatedItems = cartItems.filter(
                (item) => !(item.productId._id === productId && item.size === size)
            );
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
            await fetchCart(); 
        } catch (err) {
            console.error('Error removing item:', err);
            alert('Failed to remove item from cart');
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="cart-sidebar-header">
                <h3>Your Cart</h3>
                <span className="close-btn" onClick={onClose}>
                    <AiOutlineClose size={24} />
                </span>
            </div>

            <div className="cart-sidebar-content">
                {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Your cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <div className="cart-item" key={`${item.productId._id}-${item.size}`}>
                            <div className="cart-item-left">
                                <img
                                    src={`http://localhost:5000/uploads/products/${item.productId.images?.[0]}`}
                                    alt={item.productId.name}
                                    className="cart-item-img"
                                />
                                <div className="cart-item-details">
                                    <span>{item.productId.name}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                            <div className="cart-item-right">
                                <span>LKR {(item.productId.price * item.quantity).toFixed(2)}</span>
                                <br />
                                <button
                                    onClick={() => handleRemove(item.productId._id, item.size)}
                                    className="remove-btn"
                                    aria-label="Remove item"
                                >
                                    <MdDelete size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-sidebar-footer">
                <div className="total">
                    <strong>Total</strong>
                    <span className="total-amount">
                        {`LKR ${total.toLocaleString('en-LK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                    </span>
                </div>
                <div className="cart-buttons">
                    <button onClick={onClose} className="btn-secondary">
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => {
                            navigate('/checkout');
                            onClose();
                        }}
                        className="btn-primary"
                        disabled={cartItems.length === 0}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
