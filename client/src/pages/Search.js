import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import Toast from '../components/Toast';
import './Search.css';

function Search() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showRumorTypes, setShowRumorTypes] = useState(false);
  const [toast, setToast] = useState(null);

  const handleVerify = async () => {
    if (!username.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/users/${username}/exists`);
      
      if (response.data.exists) {
        setIsVerified(true);
        setToast({
          message: 'Username found!',
          type: 'success'
        });
      } else {
        setIsVerified(false);
        setToast({
          message: response.data.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error verifying username:', error);
      setToast({
        message: 'Failed to verify username',
        type: 'error'
      });
    }
  };

  const handleSearch = () => {
    if (username && isVerified) {
      setShowRumorTypes(true);
    }
  };

  const handleRumorTypeSelect = (type) => {
    navigate('/results', {
      state: {
        username,
        type,
      }
    });
  };

  const getButtonText = () => {
    if (!username.trim()) return 'Rumor about them';
    return `Rumor about ${username}`;
  };

  return (
    <div className="search-container">
      <BackButton />
      <div className="search-content">
        <div className="search-input-section">
          <RoundedInput
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsVerified(false);
              setShowRumorTypes(false);
            }}
            placeholder="Enter username"
          />
          <RoundedButton
            onClick={handleVerify}
            color={isVerified ? "#10B981" : "var(--surface)"}
            textColor={isVerified ? "white" : "var(--text)"}
          >
            Verify
          </RoundedButton>
        </div>

        {isVerified && !showRumorTypes && (
          <RoundedButton
            onClick={handleSearch}
            color="var(--primary)"
            className="search-button"
          >
            Search
          </RoundedButton>
        )}

        {showRumorTypes && (
          <div className="rumor-type-buttons">
            <button
              onClick={() => handleRumorTypeSelect('about')}
              className="rumor-type-button"
            >
              {getButtonText()}
            </button>
            
            <button
              onClick={() => handleRumorTypeSelect('with-others')}
              className="rumor-type-button"
            >
              Rumor with other
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Search; 