# Rumor App UI Kit

This UI kit contains reusable components and styles from the Rumor App that you can use in other projects.

## Base Styles

Add these styles to your root CSS or index.html:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: white;
}

input, textarea, button {
  outline: none;
}
```

## Common Components

### 1. Circular Button (Home Page Style)
```jsx
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
  >
    {children}
  </button>
);
```

### 2. Rounded Input Field
```jsx
const RoundedInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      padding: '15px 20px',
      fontSize: '16px',
      borderRadius: '25px',
      border: 'none',
      backgroundColor: '#E6E6FA',
      color: '#333',
      width: '100%',
    }}
  />
);
```

### 3. Rounded Button
```jsx
const RoundedButton = ({ onClick, children, color = '#333', textColor = 'white' }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 30px',
      backgroundColor: color,
      color: textColor,
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
    }}
  >
    {children}
  </button>
);
```

### 4. Tag Component
```jsx
const Tag = ({ text, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '8px 16px',
      backgroundColor: '#E6E6FA',
      color: '#333',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'inline-block',
    }}
  >
    {text}
  </div>
);
```

### 5. Rounded Textarea
```jsx
const RoundedTextarea = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      height: '150px',
      padding: '20px',
      fontSize: '16px',
      borderRadius: '25px',
      border: 'none',
      backgroundColor: '#FFE4C4',
      color: '#333',
      resize: 'none',
    }}
  />
);
```

## Layout Components

### 1. Centered Container
```jsx
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
```

### 2. Header with Back Button
```jsx
const Header = ({ title, onBack }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20px',
    }}
  >
    <span
      style={{
        fontSize: '18px',
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: '8px 16px',
        borderRadius: '20px',
      }}
    >
      {title}
    </span>
    <RoundedButton onClick={onBack}>Back</RoundedButton>
  </div>
);
```

## Color Palette
```javascript
const colors = {
  primary: '#333',
  secondary: '#E6E6FA',
  accent1: '#ffd1dc',  // Pink
  accent2: '#87CEEB',  // Sky Blue
  accent3: '#FFE4C4',  // Peach
  text: '#333',
  lightGray: '#D3D3D3',
  error: '#dc3545',
};
```

## Usage Example

Here's how to use these components together:

```jsx
function YourNewPage() {
  return (
    <CenteredContainer>
      <Header title="Your Page" onBack={() => navigate('/')} />
      
      <RoundedInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter text"
      />
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Tag text="Tag 1" onClick={() => {}} />
        <Tag text="Tag 2" onClick={() => {}} />
      </div>
      
      <RoundedTextarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter longer text"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <RoundedButton onClick={() => {}}>Submit</RoundedButton>
      </div>
    </CenteredContainer>
  );
}
```

## Responsive Design Tips

1. Use maxWidth with percentage values for containers
2. Use rem/em units for font sizes
3. Use flexbox for layouts
4. Add media queries for mobile views:

```css
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .button {
    width: 100%;
  }
}
```

## Animation Styles

Add these classes to your CSS for hover effects:

```css
.button-hover {
  transition: transform 0.2s;
}

.button-hover:hover {
  transform: scale(1.05);
}

.button-hover:active {
  transform: scale(0.95);
}
``` 