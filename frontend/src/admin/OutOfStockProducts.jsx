import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';

export default function OutOfStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Animation state for modal content
  const [modalAnimateIn, setModalAnimateIn] = useState(false);

  // Success message box state
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/products/out-of-stock', {
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching out-of-stock products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStock();
  }, []);

  // Open modal with animation
  const openManageStockModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    // Trigger animation after small delay so CSS transition works
    setTimeout(() => {
      setModalAnimateIn(true);
    }, 10);
  };

  // Close modal and reset animation state
  const closeModal = () => {
    setModalAnimateIn(false);
    // Wait for animation to finish before fully closing modal
    setTimeout(() => {
      setModalOpen(false);
      setSelectedProduct(null);
    }, 300); // match CSS transition duration
  };

  const handleStockChange = (sizeLabel, newStock) => {
    if (!selectedProduct) return;

    setSelectedProduct(prev => {
      const newSizes = prev.outOfStockSizes.map(size =>
        size.sizeLabel === sizeLabel ? { ...size, stock: newStock } : size
      );
      return { ...prev, outOfStockSizes: newSizes };
    });
  };

  const saveStockChanges = async () => {
    if (!selectedProduct) return;

    try {
      const updatedSizes = selectedProduct.outOfStockSizes.map(({ sizeLabel, stock }) => ({
        sizeLabel,
        stock,
      }));

      await axios.patch(
        `http://localhost:5000/api/admin/products/update-stock/${selectedProduct._id}`,
        { sizes: updatedSizes },
        { withCredentials: true }
      );

      // Show success message box instead of alert
      setSuccessMessage('Stock updated successfully.');
      setShowMessageBox(true);

      closeModal();

      // Refresh list
      const res = await axios.get('http://localhost:5000/api/admin/products/out-of-stock', {
        withCredentials: true,
      });
      setProducts(res.data);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowMessageBox(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Failed to update stock.'); // Keep alert for errors or replace similarly
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <header style={headerStyle}>
        <h2 style={{ margin: 0 }}>Out of Stock Products</h2>
      </header>

      <section style={contentAreaStyle}>
        {products.length === 0 ? (
          <p>No out-of-stock items found.</p>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead style={stickyTheadStyle}>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Brand</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price (Rs.)</th>
                  <th style={thStyle}>Out of Stock Sizes</th>
                  <th style={thStyle}>Manage Stocks</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.productId} style={trStyle}>
                    <td style={tdStyle}>{prod.productId}</td>
                    <td style={tdStyle}>
                      {prod.image ? (
                        <img
                          src={`http://localhost:5000/uploads/products/${prod.image}`}
                          alt={prod.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td style={tdStyle}>{prod.name}</td>
                    <td style={tdStyle}>{prod.brand}</td>
                    <td style={tdStyle}>{prod.category}</td>
                    <td style={tdStyle}>
                      {prod.price != null
                        ? Number(prod.price).toLocaleString('en-LK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        : 'N/A'}
                    </td>
                    <td style={tdStyle}>
                      {prod.outOfStockSizes.map((size, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            marginRight: '5px',
                            padding: '2px 8px',
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            borderRadius: '15px',
                            fontSize: '0.85rem',
                          }}
                        >
                          {size.sizeLabel}
                        </span>
                      ))}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => openManageStockModal(prod)}
                        style={iconButtonStyle}
                        title="Manage Stocks"
                        aria-label="Manage Stocks"
                      >
                        <FiEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal */}
      {modalOpen && selectedProduct && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div
            style={{
              ...modalContentStyle,
              opacity: modalAnimateIn ? 1 : 0,
              transform: modalAnimateIn ? 'scale(1)' : 'scale(0.9)',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-stock-title"
          >
            <h3 id="manage-stock-title" style={{ marginBottom: '1rem' }}>
              Manage Stocks for "{selectedProduct.name}"
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th style={modalThStyle}>Size</th>
                  <th style={modalThStyle}>Current Stock</th>
                  <th style={modalThStyle}>Update Stock</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.outOfStockSizes.map((size, idx) => (
                  <tr key={idx}>
                    <td style={modalTdStyle}>{size.sizeLabel}</td>
                    <td style={modalTdStyle}>{size.stock}</td>
                    <td style={modalTdStyle}>
                      <input
                        type="number"
                        min="0"
                        defaultValue={size.stock}
                        onChange={(e) =>
                          handleStockChange(size.sizeLabel, Number(e.target.value))
                        }
                        style={{ width: '80px', padding: '4px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right' }}>
              <button style={modalBtnCancel} onClick={closeModal}>
                Cancel
              </button>
              <button style={modalBtnSave} onClick={saveStockChanges}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Box */}
      {showMessageBox && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '15px 25px',
            backgroundColor: '#4BB543',
            color: '#fff',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 1050,
            fontWeight: '500',
            fontSize: '16px',
          }}
        >
          {successMessage}
        </div>
      )}
    </>
  );
}

// Styles

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 20px 0',
};

const contentAreaStyle = {
  marginBottom: '0',
};

const tableContainerStyle = {
  maxHeight: '530px',
  overflowY: 'auto',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  minWidth: '750px',
};

const stickyTheadStyle = {
  position: 'sticky',
  top: 0,
  backgroundColor: '#d2d2d2',
  zIndex: 1,
};

const thStyle = {
  color: '#111',
  padding: '12px 20px',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '1rem',
  userSelect: 'none',
  borderBottom: '3px solid #ccc',
};

const trStyle = {
  transition: 'background-color 0.3s ease',
  cursor: 'default',
};

const tdStyle = {
  padding: '14px 20px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.95rem',
  color: '#20252eff',
  verticalAlign: 'middle',
  textAlign: 'center',
};

const iconButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#0d6efd',
  padding: '6px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px 30px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
};

const modalThStyle = {
  borderBottom: '2px solid #ddd',
  padding: '8px',
  textAlign: 'center',
  fontWeight: '600',
};

const modalTdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'middle',
  textAlign: 'center',
};

const modalBtnCancel = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  marginRight: '10px',
  cursor: 'pointer',
};

const modalBtnSave = {
  backgroundColor: '#198754',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: 'pointer',
};
