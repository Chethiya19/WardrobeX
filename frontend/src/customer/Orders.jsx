import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        withCredentials: true,
      });
      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>My Orders</h2>
      <div style={styles.container}>
        {orders.length === 0 ? (
          <p style={styles.empty}>You haven't placed any orders yet.</p>
        ) : (
          <div style={styles.scrollContainer}>
            {orders.map((order, index) => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span><strong>Order #{index + 1}</strong></span>
                  <span>Status: {order.status}</span>
                  <span>Date: {new Date(order.placedAt).toLocaleDateString()}</span>
                  <span>Total: LKR {order.totalAmount.toFixed(2)}</span>
                </div>

                <div style={styles.items}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.item}>
                      <img
                        src={`http://localhost:5000/uploads/products/${item.productId.images?.[0]}`}
                        alt={item.productId.name}
                        style={styles.image}
                      />
                      <div>
                        <div>{item.productId.name}</div>
                        {item.size && <div>Size: {item.size}</div>}
                        <div>Qty: {item.quantity}</div>
                        <div>Price: LKR {item.productId.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    // paddingTop: '20px',
  },
  heading: {
    textAlign: 'center',
    // marginBottom: '10px',
    color: '#333',
  },
  container: {
    maxWidth: '900px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '10px',
    height: 'calc(100vh - 120px)', // Adjust height as needed
    overflowY: 'auto',
  },
  scrollContainer: {
    paddingRight: '10px',
  },
  empty: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '25px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    fontSize: '14px',
    marginBottom: '15px',
    gap: '10px',
  },
  items: {
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  item: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    alignItems: 'center',
  },
  image: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
};

export default Order;
