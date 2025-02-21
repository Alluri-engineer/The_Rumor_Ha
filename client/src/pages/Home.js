import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularButton from '../components/CircularButton';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Rumor</h1>
      <div className="home-buttons">
        <CircularButton
          color="#ffd1dc"
          onClick={() => navigate('/search')}
        >
          Search
        </CircularButton>
        <CircularButton
          color="#87CEEB"
          onClick={() => navigate('/post')}
        >
          Post
        </CircularButton>
      </div>
    </div>
  );
}

export default Home; 