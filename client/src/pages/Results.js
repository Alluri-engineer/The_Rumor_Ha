import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import axios from 'axios';
import './Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rumors, setRumors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username, type } = location.state || {};

  useEffect(() => {
    if (!username || !type) {
      navigate('/search');
      return;
    }

    const fetchRumors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rumors/${username}/${type}`
        );
        setRumors(response.data.rumors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rumors:', error);
        setError('Failed to fetch rumors. Please try again.');
        setLoading(false);
      }
    };

    fetchRumors();
  }, [username, type, navigate]);

  if (loading) {
    return <div className="results-loading">Loading...</div>;
  }

  if (error) {
    return <div className="results-error">{error}</div>;
  }

  return (
    <div className="results-container">
      <BackButton />
      <h2 className="results-title">
        {type === 'about' ? 'Rumors about' : 'Rumors with'} {username}
      </h2>

      {rumors.length === 0 ? (
        <div className="no-results">No rumors found</div>
      ) : (
        <div className="rumors-list">
          {rumors.map((rumor, index) => (
            <div key={index} className="rumor-card">
              <p className="rumor-message">{rumor.message}</p>
              <div className="rumor-usernames">
                {rumor.usernames.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results; 