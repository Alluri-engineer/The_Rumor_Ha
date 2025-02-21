import React from 'react';

const RoundedButton = ({ onClick, children, color = '#333', textColor = 'white', className = '' }) => (
  <button
    onClick={onClick}
    style={{
      height: '56px',
      padding: '0 32px',
      backgroundColor: color,
      color: textColor,
      border: 'none',
      borderRadius: '28px',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    }}
    className={`button-hover ${className}`}
  >
    {children}
  </button>
);

export default RoundedButton; 