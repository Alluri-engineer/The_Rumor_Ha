import React from 'react';

function RoundedInput({ value, onChange, placeholder, onKeyPress }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      style={{
        padding: '0 24px',
        height: '56px',
        fontSize: '18px',
        borderRadius: '28px',
        border: '2px solid var(--border)',
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        width: '100%',
        transition: 'all 0.2s ease',
      }}
    />
  );
}

export default RoundedInput;