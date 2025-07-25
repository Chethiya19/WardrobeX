import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaShoppingBag, FaTags, FaUserFriends } from 'react-icons/fa';
import { Carousel } from 'bootstrap';
import './Home.css';

import sliderImg1 from '../assets/images/slider1.jpg';
import sliderImg2 from '../assets/images/slider2.jpg';
import sliderImg3 from '../assets/images/slider3.jpg';

const sliderImages = [
  {
    src: sliderImg1,
    alt: 'Latest Fashion Trends',
    caption: 'Trendy Outfits',
    text: 'Explore the latest fashion styles and stay ahead.',
    link: '/shop',
  },
  {
    src: sliderImg2,
    alt: 'Shop with Ease',
    caption: 'Easy Shopping',
    text: 'Seamless browsing and secure checkout experience.',
    link: '/shop',
  },
  {
    src: sliderImg3,
    alt: 'Best Deals & Offers',
    caption: 'Best Deals',
    text: 'Get discounts, combos, and seasonal offers every day.',
    link: '/customer-login',
  },
];

const Home = () => {
  useEffect(() => {
    const carouselElement = document.getElementById('wardrobeCarousel');
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3500,
        ride: 'carousel',
        pause: false,
      });
    }
  }, []);

  return (
    <div className="home-container">

      {/* Bootstrap Carousel */}
      <div
        id="wardrobeCarousel"
        className="carousel slide carousel-fade mb-5"
        data-bs-ride="carousel"
        data-bs-interval="3500"
      >
        <div className="carousel-inner">
          {sliderImages.map((item, index) => (
            <div key={index} className={`carousel-item${index === 0 ? ' active' : ''}`}>
              <img
                src={item.src}
                className="d-block w-100"
                alt={item.alt}
                style={{ maxHeight: '430px', objectFit: 'cover' }}
              />
              <div className="carousel-caption">
                <h3>{item.caption}</h3>
                <p>{item.text}</p>
                <Link to={item.link} className="btn btn-warning">
                  Explore <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#wardrobeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#wardrobeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Hero Section */}
      <header className="home-hero">
        <h1>
          Welcome to <span className="brand-name">WardrobeX</span>
        </h1>
        <p>Your ultimate destination for fashion & apparel</p>
      </header>

      {/* Features Grid */}
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
