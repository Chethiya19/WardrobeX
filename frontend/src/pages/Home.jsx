import React from 'react';
import { FaTshirt, FaShoppingBag, FaTags, FaUserFriends } from 'react-icons/fa';
import './Home.css'; // Link to your CSS

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-hero">
        <h1>Welcome to <span className="brand-name">WardrobeX</span></h1>
        <p>Your ultimate destination for fashion & apparel</p>
      </header>

      <section className="features">
        <div className="feature-card">
          <FaTshirt className="feature-icon" />
          <h3>Trendy Outfits</h3>
          <p>Explore the latest fashion styles and stay ahead.</p>
        </div>
        <div className="feature-card">
          <FaShoppingBag className="feature-icon" />
          <h3>Easy Shopping</h3>
          <p>Seamless browsing and secure checkout experience.</p>
        </div>
        <div className="feature-card">
          <FaTags className="feature-icon" />
          <h3>Best Deals</h3>
          <p>Get discounts, combos, and seasonal offers every day.</p>
        </div>
        <div className="feature-card">
          <FaUserFriends className="feature-icon" />
          <h3>Customer Support</h3>
          <p>Friendly and fast support to assist your fashion journey.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
