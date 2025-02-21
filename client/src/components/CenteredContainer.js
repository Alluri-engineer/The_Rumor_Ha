import React from 'react';

const CenteredContainer = ({ children }) => (
  <div
    style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}
  >
    {children}
  </div>
);

export default CenteredContainer; 