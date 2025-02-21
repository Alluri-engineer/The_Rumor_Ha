import React from 'react';

const RoundedInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      padding: '0 24px',
      height: '56px',
      fontSize: '18px',
      borderRadius: '28px',
      border: '2px solid var(--border)',
      backgroundColor: '#E6E6FA',
      color: '#333',
      width: '100%',
      transition: 'all 0.2s ease',
    }}
  />
);

export default RoundedInput; 