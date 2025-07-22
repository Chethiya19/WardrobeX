import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [openBoxId, setOpenBoxId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/orders', { withCredentials: true })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unauthorized or failed to load orders');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;
    setUpdatingOrderId(orderId);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order status updated to ${newStatus}`);
    } catch {
      alert('Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year}    ${hours}.${minutes} ${ampm}`;
  };

  const toggleBox = (orderId) => {
    setOpenBoxId(prev => (prev === orderId ? null : orderId));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    const orderDate = new Date(order.placedAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesFromDate = !from || orderDate >= from;
    const matchesToDate = !to || orderDate <= to;

    return matchesSearch && matchesStatus && matchesFromDate && matchesToDate;
  });

  return (
    <>
      {/* Title and Filters Row */}
      <div className="container mb-4">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h2 className="mb-0">Manage Orders</h2>
          </div>
          <div className="col-md-8">
            <div className="row g-3 justify-content-end align-items-end">
              <div className="col-auto">
                <input
                  type="date"
                  id="fromDate"
                  className="form-control"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <input
                  type="date"
                  id="toDate"
                  className="form-control"
                  placeholder="To Date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-auto" style={{ minWidth: '200px' }}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by Order ID"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <section style={styles.contentArea}>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.stickyThead}>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Order Date &amp; Time</th>
                  <th style={styles.th}>Total Price (Rs.)</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Update Status</th>
                  <th style={styles.th}>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const totalPrice = order.items.reduce(
                    (acc, item) => acc + item.productId.price * item.quantity,
                    0
                  );

                  const isOpen = openBoxId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      <tr style={styles.tr}>
                        <th style={styles.td}>{index + 1}</th>
                        <td style={styles.td}>{order._id}</td>
                        <td style={styles.td}>
                          {order.customerId?.accountDetail
                            ? `${order.customerId.accountDetail.firstName} ${order.customerId.accountDetail.lastName}`
                            : 'Unknown'}
                        </td>
                        <td style={styles.td}>{formatDateTime(order.placedAt)}</td>
                        <td style={styles.td}>
                          {totalPrice.toLocaleString('en-LK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: 600,
                            color: getStatusColor(order.status),
                          }}
                        >
                          {order.status}
                        </td>
                        <td style={styles.td}>
                          <select
                            value={order.status}
                            onChange={e =>
                              handleStatusChange(order._id, e.target.value, order.status)
                            }
                            style={{
                              ...styles.statusSelect,
                              borderColor: getStatusColor(order.status),
                              backgroundColor: `${getStatusColor(order.status)}20`,
                              color: getStatusColor(order.status),
                            }}
                            disabled={updatingOrderId === order._id}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => toggleBox(order._id)}
                            style={styles.viewButton}
                            title={isOpen ? 'Hide Products' : 'View Products'}
                            aria-expanded={isOpen}
                            aria-controls={`products-${order._id}`}
                          >
                            {isOpen ? (
                              <FiChevronUp size={16} />
                            ) : (
                              <FiChevronDown size={16} />
                            )}
                          </button>
                        </td>

                      </tr>

                      <tr>
                        <td colSpan="8" style={{ padding: 0, border: 'none' }}>
                          <div
                            id={`products-${order._id}`}
                            style={{
                              ...styles.productBox,
                              maxHeight: isOpen ? '1000px' : '0',
                              opacity: isOpen ? 1 : 0,
                              padding: isOpen ? '12px 20px' : '0 20px',
                              overflow: 'hidden',
                              transition:
                                'max-height 0.5s ease, opacity 0.4s ease, padding 0.4s ease',
                            }}
                            aria-hidden={!isOpen}
                          >
                            {isOpen && (
                              <table style={styles.innerTable}>
                                <thead>
                                  <tr>
                                    <th style={styles.innerTh}>Product Name</th>
                                    <th style={styles.innerTh}>Price (Rs.)</th>
                                    <th style={styles.innerTh}>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map(item => (
                                    <tr key={item.productId._id}>
                                      <td style={styles.innerTd}>{item.productId.name}</td>
                                      <td style={styles.innerTd}>
                                        {item.productId.price.toFixed(2)}
                                      </td>
                                      <td style={styles.innerTd}>{item.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

// === Styles ===

const styles = {
  contentArea: {
    marginBottom: '0',
  },

  tableContainer: {
    maxHeight: '530px', // Set your desired max height
    overflowY: 'auto',
    overflowX: 'auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
    position: 'relative',
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: '800px',
  },

  stickyThead: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#d2d2d2',
    zIndex: 1,
  },

  th: {
    color: '#111',
    padding: '12px 20px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '1rem',
    userSelect: 'none',
    borderBottom: '3px solid #ccc',
  },

  tr: {
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    height: '30px',
  },

  td: {
    padding: '6px 12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    color: '#20252eff',
    verticalAlign: 'middle',
    textAlign: 'center',
    lineHeight: '1.2',
    whiteSpace: 'pre',
  },

  statusSelect: {
    padding: '6px 10px',
    fontSize: '0.95rem',
    borderRadius: '5px',
    border: '2px solid',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  viewButton: {
    marginLeft: '12px',
    padding: '6px 8px',
    fontSize: '1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    background: '#eaeaea',
    border: '1px solid #ccc',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },

  productBox: {
    backgroundColor: '#ebeceeff',
    borderRadius: '6px',
    margin: '10px 20px 5px 20px',
    // padding, opacity, maxHeight and overflow handled inline for animation
  },

  innerTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  innerTh: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ccc',
  },

  innerTd: {
    padding: '4px 8px',
    borderBottom: '1px solid #ddd',
  },
};

function getStatusColor(status) {
  switch (status) {
    case 'Pending':
      return '#ffc107';
    case 'Processing':
      return '#0d6efd';
    case 'Shipped':
      return '#17a2b8';
    case 'Delivered':
      return '#28a745';
    case 'Cancelled':
      return '#dc3545';
    default:
      return '#333';
  }
}
