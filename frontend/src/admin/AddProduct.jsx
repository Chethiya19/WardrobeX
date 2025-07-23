import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddProduct() {
  const navigate = useNavigate();

  const categories = ['Shirts', 'Pants', 'Frocks', 'Tops', 'Kids', 'Shoes', 'Bags', 'Accessories'];
  const genders = ['Men', 'Women', 'Kids', 'Unisex'];

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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    gender: '',
    brand: '',
    price: '',
    image: null,
  });

  // For sizes stock (array of { sizeLabel, stock })
  const [sizes, setSizes] = useState([]);

  // For Bags and Accessories single stock count
  const [singleStockCount, setSingleStockCount] = useState(0);

  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showMessageBox, setShowMessageBox] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'category') {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (value === 'Bags' || value === 'Accessories') {
        // Clear sizes and reset single stock count
        setSizes([]);
        setSingleStockCount(0);
      } else {
        // Setup sizes array based on category
        const selectedSizes = sizeOptions[value] || [];
        setSizes(selectedSizes.map(size => ({ sizeLabel: size, stock: 0 })));
        setSingleStockCount(0);
      }
    } else if (name === 'image') {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStockChange = (index, value) => {
    const updated = [...sizes];
    updated[index].stock = Number(value);
    setSizes(updated);
  };

  const handleSingleStockChange = (value) => {
    setSingleStockCount(Number(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      showMessage('Please upload a product image.', 'error');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'image') form.append(key, val);
    });
    form.append('image', formData.image);

    // Append sizes or single stock accordingly
    if (formData.category === 'Bags' || formData.category === 'Accessories') {
      form.append('stock', singleStockCount);
      form.append('sizes', JSON.stringify([])); // empty sizes
    } else {
      form.append('sizes', JSON.stringify(sizes));
    }

    try {
      await axios.post('http://localhost:5000/api/admin/products/add', form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Product added successfully!', 'success');

      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (err) {
      console.error(err);
      showMessage('Failed to add product. Please try again.', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setShowMessageBox(true);
    setTimeout(() => setShowMessageBox(false), 3000);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <h3 className="mb-4 text-center">Add New Product</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="2"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select gender group</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Size-wise stock inputs */}
        {(formData.category && formData.category !== 'Bags' && formData.category !== 'Accessories' && sizes.length > 0) && (
          <div className="mb-3">
            <label className="form-label">Set Stock per Size</label>
            <div className="row">
              {sizes.map((s, index) => (
                <div key={index} className="col-md-2 col-4 mb-2">
                  <div className="input-group">
                    <span className="input-group-text">{s.sizeLabel}</span>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={s.stock}
                      onChange={(e) => handleStockChange(index, e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single stock input for Bags and Accessories */}
        {(formData.category === 'Bags' || formData.category === 'Accessories') && (
          <div className="col-md-6">
            <label className="form-label">Stock Count</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={singleStockCount}
              onChange={(e) => handleSingleStockChange(e.target.value)}
              required
            />
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Price (Rs)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </div>
          {imagePreview && (
            <div className="col-md-6 d-flex align-items-center">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5">
            Add Product
          </button>
        </div>
      </form>

      {/* Stylish message box */}
      {showMessageBox && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            padding: "15px 25px",
            backgroundColor: messageType === 'success' ? "#4BB543" : "#dc3545",
            color: "#fff",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 1050,
            fontWeight: '500',
            fontSize: '16px'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
