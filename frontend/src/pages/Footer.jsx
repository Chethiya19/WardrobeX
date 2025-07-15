import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Customer Service */}
        <div className="footer-column">
          <h5>Customer Service</h5>
          <ul>
            <li>Contact Us</li>
            <li>Sell With Us</li>
            <li>Shipping</li>
          </ul>
        </div>

        {/* Links */}
        <div className="footer-column">
          <h5>Links</h5>
          <ul>
            <li>Contact Us</li>
            <li>Sell With Us</li>
            <li>Shipping</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-column">
          <h5>Newsletter</h5>
          <p>Sign Up for Our Newsletter</p>
          <div className="newsletter-input-group">
            <input type="email" placeholder="Please Enter Your Email" className="email-input" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
          <FaFacebookF className="icon facebook" />
          <FaInstagram className="icon instagram" />
          <FaTwitter className="icon twitter" />
          <FaYoutube className="icon youtube" />
        </div>
        <p>© 2025 WardrobeX</p>
        {/* <p>Devloped By Chethiya Senadheera</p> */}
        {/* <p>Made with ❤️ for fashion lovers</p> */}
      </div>
    </footer>
  );
};

export default Footer;
