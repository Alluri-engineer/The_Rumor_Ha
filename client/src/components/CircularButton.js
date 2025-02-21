import React from 'react';

const CircularButton = ({ color, onClick, children }) => (
  <button
    style={{
      width: '150px',
      height: '150px',
      fontSize: '1.5rem',
      color: '#333',
      backgroundColor: color,
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }}
    onClick={onClick}
    className="button-hover"
  >
    {children}
  </button>
);

export default CircularButton; 