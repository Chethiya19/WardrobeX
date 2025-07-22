import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
        setCartItems(res.data);
        calculateTotal(res.data);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };
    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleProceedToPayment = () => {
    navigate('/checkout/payment', { state: { total } });
  };

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={styles.items}>
            {cartItems.map((item) => (
              <div style={styles.item} key={`${item.productId._id}-${item.size}`}>
                <img
                  src={`http://localhost:5000/uploads/products/${item.productId.images?.[0]}`}
                  alt={item.productId.name}
                  style={styles.img}
                />
                <div>
                  <h4>{item.productId.name}</h4>
                  <p>Size: {item.size}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: LKR {(item.productId.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h3>Total: LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</h3>
            <button onClick={handleProceedToPayment} style={styles.button}>
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;

const styles = {
  container: {
    maxWidth: '800px',
    margin: '10px auto',
    padding: '20px',
  },
  items: {
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  item: {
    display: 'flex',
    gap: '15px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '15px',
  },
  img: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    border: '1px solid #eee',
  },
  summary: {
    marginTop: '30px',
    textAlign: 'right',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    marginTop: '10px',
  },
};
