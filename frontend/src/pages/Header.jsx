import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaShoppingCart, FaUserShield, FaRegUser } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import './Header.css';
import Cart from './Cart';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customer/me', { withCredentials: true })
      .then(res => {
        if (res.data?.username) setUsername(res.data.username);
      })
      .catch(() => setUsername(''));

    // Fetch cart count
    axios.get('http://localhost:5000/api/cart', { withCredentials: true })
      .then(res => {
        setCartCount(res.data.length);
      })
      .catch(err => {
        console.error('Failed to fetch cart:', err);
        setCartCount(0);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/customer/logout', {}, { withCredentials: true });
      setUsername('');
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCart = () => setCartSidebarOpen(!cartSidebarOpen);

  const handleNavigate = (category, gender) => {
    navigate(`/${gender.toLowerCase()}/${category.toLowerCase()}`);
    closeSidebar();
  };

  return (
    <>
      <header className="header">
        <div className="left-section">
          <div className="menu-icon" onClick={toggleSidebar}>☰</div>
          <div className="logo" onClick={() => navigate('/')}>WardrobeX</div>
        </div>

        <div className="center-section">
          <div className="search-container">
            <input type="text" placeholder="Search Products" className="search-bar" />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <nav className="nav-links">
          <div className="cart-icon-wrapper" onClick={toggleCart}>
            <FaShoppingCart className="cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>

          <div className="dropdown">
            <button className="dropbtn">Brands <IoMdArrowDropdown /></button>
            <div className="dropdown-content">
              <span>Nike</span><span>Adidas</span><span>Carnage</span><span>Moose</span><span>ODEL</span>
            </div>
          </div>

          <button className="nav-button" onClick={() => navigate('/shop')}>Shop</button>

          <div className="dropdown">
            <button className="dropbtn">
              <FaRegUser /> {username ? username : 'Welcome !'} <IoMdArrowDropdown />
            </button>
            <div className="dropdown-content">
              {username ? (
                <>
                  <span onClick={() => navigate('/customer/dashboard')}>Profile</span>
                  <span onClick={handleLogout}>Logout</span>
                </>
              ) : (
                <>
                  <span onClick={() => navigate('/customer-login')}>Login</span>
                  <span onClick={() => navigate('/customer-register')}>Sign Up</span>
                </>
              )}
            </div>
          </div>
        </nav>

        <FaUserShield className="admin-icon" onClick={() => navigate('/admin-login')} />
      </header>

      {(sidebarOpen || cartSidebarOpen) && (
        <div className="overlay" onClick={() => { setSidebarOpen(false); setCartSidebarOpen(false); }}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <span className="close-btn" onClick={closeSidebar}>×</span>
        </div>
        <div className="sidebar-heading"><h4>Shop By Category</h4></div>
        <div className="sidebar-links">
          <span onClick={() => { navigate('/shop'); closeSidebar(); }}>All</span>
          <div className="sidebar-dropdown-group">
            <span className="sidebar-link" onClick={() => { navigate('/men'); closeSidebar(); }}>
              Men ▾
            </span>
            <div className="sidebar-dropdown-content">
              <span onClick={() => handleNavigate('Shirts', 'Men')}>Shirts</span>
              <span onClick={() => handleNavigate('Pants', 'Men')}>Pants</span>
              <span onClick={() => handleNavigate('Shoes', 'Men')}>Shoes</span>
            </div>
          </div>
          <div className="sidebar-dropdown-group">
            <span className="sidebar-link" onClick={() => { navigate('/women'); closeSidebar(); }}>
              Women ▾
            </span>
            <div className="sidebar-dropdown-content">
              <span onClick={() => handleNavigate('Frocks', 'Women')}>Frocks</span>
              <span onClick={() => handleNavigate('Tops', 'Women')}>Tops</span>
              <span onClick={() => handleNavigate('Shoes', 'Women')}>Shoes</span>
            </div>
          </div>
          <span onClick={() => { navigate('/kids'); closeSidebar(); }}>Kids</span>
          <span onClick={() => { navigate('/category/bags'); closeSidebar(); }}>Bags</span>
          <span onClick={() => { navigate('/category/accessories'); closeSidebar(); }}>Accessories</span>
        </div>
      </div>

      {/* Cart Sidebar */}
      <Cart isOpen={cartSidebarOpen} onClose={toggleCart} />
    </>
  );
};

export default Header;
