import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import './RumorType.css';

function RumorType() {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleRumorTypeSelect = async (type) => {
    navigate('/results', {
      state: {
        username,
        type,
      }
    });
  };

  return (
    <div className="rumor-type-container">
      <BackButton />
      <div className="username-display">
        Showing rumors for: {username}
      </div>
      
      <div className="type-buttons">
        <button
          onClick={() => handleRumorTypeSelect('about')}
          className="type-button about-button"
        >
          Rumor about him
        </button>
        
        <button
          onClick={() => handleRumorTypeSelect('with-others')}
          className="type-button with-others-button"
        >
          Rumor with other
        </button>
      </div>
    </div>
  );
}

export default RumorType; 