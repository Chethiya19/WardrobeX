import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/products/all', {
          withCredentials: true
        });
        setAllProducts(res.data);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`, {
        withCredentials: true
      });

      const updatedAllProducts = allProducts.filter(p => p._id !== id);
      setAllProducts(updatedAllProducts);
      setProducts(updatedAllProducts);

      setDeleteMessage('Product deleted successfully!');
      setShowDeleteMessage(true);

      setTimeout(() => {
        setShowDeleteMessage(false);
      }, 2500);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword === '') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(prod =>
        prod.name.toLowerCase().includes(keyword) ||
        prod.category.toLowerCase().includes(keyword) ||
        prod.gender.toLowerCase().includes(keyword)
      );
      setProducts(filtered);
    }
  };

  return (
    <>
      <header style={headerStyle}>
        <h2 style={{ margin: 0 }}>Manage Products</h2>
        <div style={headerRight}>
          <input
            type="text"
            placeholder="Search products..."
            style={searchInputStyle}
            onChange={handleSearch}
          />
          <button style={addBtnStyle} onClick={() => navigate('/admin/product/add')}>
            Add Product
          </button>
        </div>
      </header>

      <section style={contentAreaStyle}>
        {products.length === 0 ? (
          <p>No products found.</p>
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
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Price (Rs.)</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={trStyle}>
                    <td style={tdStyle}>{prod.productId}</td>
                    <td style={tdStyle}>
                      {prod.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/uploads/products/${prod.images[0]}`}
                          alt={prod.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td style={tdStyle}>{prod.name}</td>
                    <td style={tdStyle}>{prod.brand}</td>
                    <td style={tdStyle}>{prod.category}</td>
                    <td style={tdStyle}>{prod.gender}</td>
                    <td style={tdStyle}>
                      {Number(prod.price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={btnEdit}
                        onClick={() => navigate(`/admin/product/edit/${prod._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        style={btnDelete}
                        onClick={() => handleDelete(prod._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showDeleteMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              padding: '15px 25px',
              backgroundColor: '#dc3545',
              color: '#fff',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              zIndex: 1050,
              fontWeight: '500',
              fontSize: '16px',
            }}
          >
            {deleteMessage}
          </div>
        )}
      </section>
    </>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 20px 0',
};

const headerRight = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const searchInputStyle = {
  padding: '6px 12px',
  fontSize: '0.95rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
  width: '200px',
};

const addBtnStyle = {
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  fontSize: '0.95rem',
  borderRadius: '5px',
  cursor: 'pointer',
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
  minWidth: '400px',
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

const btnEdit = {
  marginRight: '10px',
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

const btnDelete = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '0.85rem',
  cursor: 'pointer',
};
