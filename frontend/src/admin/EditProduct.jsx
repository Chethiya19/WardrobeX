// src/admin/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    gender: '',
    brand: '',
    price: '',
    image: null,
  });

  const [sizes, setSizes] = useState([]);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['Shirts', 'Pants', 'Frocks', 'Tops', 'Kids', 'Shoes', 'Bags', 'Accessories'];
  const genders = ['Men', 'Women', 'Kids', 'Unisex'];

  const sizeOptions = {
    Shirts: ['S', 'M', 'L', 'XL'],
    Pants: ['28', '30', '32', '34', '36', '38'],
    Frocks: ['S', 'M', 'L', 'XL'],
    Kids: ['XS', 'S'],
    Shoes: ['6', '7', '8', '9', '10'],
    Bags: [],
    Accessories: [],
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/products/${id}`, {
          withCredentials: true,
        });
        const prod = res.data;
        setFormData({
          name: prod.name || '',
          description: prod.description || '',
          category: prod.category || '',
          gender: prod.gender || '',
          brand: prod.brand || '',
          price: prod.price !== undefined ? prod.price : '',
          image: null,
        });

        // If category changed, sizes reset to default sizes for that category if none saved
        if (prod.sizes && prod.sizes.length > 0) {
          setSizes(prod.sizes);
        } else {
          const defaultSizes = sizeOptions[prod.category] || [];
          setSizes(defaultSizes.map(size => ({ sizeLabel: size, stock: 0 })));
        }

        setExistingImage(prod.images?.[0] || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'category') {
      setFormData(prev => ({ ...prev, [name]: value }));
      const selectedSizes = sizeOptions[value] || [];
      setSizes(selectedSizes.map(size => ({ sizeLabel: size, stock: 0 })));
    } else if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStockChange = (index, stockValue) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].stock = Number(stockValue);
    setSizes(updatedSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image') form.append(key, value);
    });

    if (formData.image) {
      form.append('image', formData.image);
    }
    form.append('sizes', JSON.stringify(sizes));

    try {
      await axios.put(`http://localhost:5000/api/admin/products/update/${id}`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Product updated successfully!');
      setShowMessageBox(true);

      setTimeout(() => {
        setShowMessageBox(false);
        navigate('/admin/products');
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '1000px' }}>
      <h3 className="mb-4 text-center">Edit Product</h3>
      <form onSubmit={handleSubmit}>

        {/* Product Name & Description */}
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

        {/* Category & Gender */}
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

        {/* Sizes & Stock */}
        {sizes.length > 0 && (
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
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand & Price */}
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

        {/* Image Upload */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Product Image (Optional)</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

          {existingImage && !formData.image && (
            <div className="col-md-6">
              <label className="form-label">Current Image</label>
              <div>
                <img
                  src={`http://localhost:5000/uploads/products/${existingImage}`}
                  alt="Current"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                />
              </div>
            </div>
          )}

          {formData.image && (
            <div className="col-md-6">
              <label className="form-label">New Image Preview</label>
              <div>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-success px-4">
            Update Product
          </button>
        </div>
      </form>

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
    </div>
  );
}
