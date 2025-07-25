import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const buttonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 1000,
    backgroundColor: '#f9a826',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '15px',
    cursor: 'pointer',
    fontSize: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'opacity 0.3s ease, transform 0.3s ease'
  };

  const hoverStyle = {
    transform: 'scale(1.1)',
    backgroundColor: '#eb9203ff'
  };

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        style={{ ...buttonStyle, ...(hovered ? hoverStyle : {}) }}
        onClick={scrollToTop}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTopButton;
