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
                  <span>Order ID: {order._id}</span>
                  <span>Status: {order.status}</span>
                  <span>Date: {new Date(order.placedAt).toLocaleDateString()}</span>
                  <span>Total: LKR {order.totalAmount.toFixed(2)}</span>
                </div>

                <div style={styles.items}>
                  {order.items.map((item, i) => (
                    <React.Fragment key={i}>
                      <div style={styles.itemRow}>
                        <img
                          src={`http://localhost:5000/uploads/products/${item.productId.images?.[0]}`}
                          alt={item.productId.name}
                          style={styles.image}
                        />
                        <div style={styles.itemDetails}>
                          <div style={styles.column}>{item.productId.name}</div>
                          <div style={styles.column}>
                            {item.size && <>Size: {item.size}<br /></>}
                            Qty: {item.quantity}
                          </div>
                          <div style={styles.column}>
                            LKR {item.productId.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {i !== order.items.length - 1 && <hr style={styles.hr} />}
                    </React.Fragment>
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
  page: {},
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  container: {
    maxWidth: '900px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '10px',
    height: 'calc(100vh - 120px)',
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
    color: '#000',
  },
  items: {
    borderTop: '2px solid #eee',
    paddingTop: '15px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px 0',
  },
  itemDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
  },
  column: {
    flex: 1,
    fontSize: '14px',
    padding: '0 10px',
  },
  image: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #ccc',
    margin: '0',
  },
};

export default Order;
