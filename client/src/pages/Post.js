import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import RoundedInput from '../components/RoundedInput';
import RoundedButton from '../components/RoundedButton';
import Toast from '../components/Toast';
import './Post.css';

function Post() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [toast, setToast] = useState(null);

  const MAX_USERNAMES = 10;

  const handleVerify = async () => {
    if (!username.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/users/${username}/exists`);
      setIsVerified(true);
      setToast({
        message: response.data.exists ? 'Username exists in database' : 'New username',
        type: response.data.exists ? 'info' : 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error verifying username:', error);
      setToast({
        message: 'Failed to verify username',
        type: 'error'
      });
    }
  };

  const handleAddUsername = () => {
    if (username && isVerified && !usernames.includes(username)) {
      if (usernames.length >= MAX_USERNAMES) {
        setToast({
          message: 'Maximum 10 usernames allowed',
          type: 'error',
          duration: 2000
        });
        return;
      }
      
      setUsernames([...usernames, username]);
      setUsername('');
      setIsVerified(false);
      setToast({
        message: 'Username added successfully!',
        type: 'success',
        duration: 1500
      });
    }
  };

  const handleRemoveUsername = (usernameToRemove) => {
    setUsernames(usernames.filter(u => u !== usernameToRemove));
  };

  const handlePost = async () => {
    if ((isVerified || usernames.length > 0) && message) {
      try {
        const finalUsernames = isVerified ? [...usernames, username] : usernames;
        await axios.post('http://localhost:5000/api/rumors', {
          message,
          usernames: finalUsernames
        });
        setToast({
          message: 'Rumor posted successfully!',
          type: 'success'
        });
        setTimeout(() => navigate('/'), 1500);
      } catch (error) {
        console.error('Error posting rumor:', error);
        setToast({
          message: 'Failed to post rumor. Please try again.',
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="post-container">
      <BackButton />
      <div className="post-content">
        <div className="username-input-section">
          <RoundedInput
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsVerified(false);
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
          {isVerified && usernames.length < MAX_USERNAMES && (
            <button className="add-button" onClick={handleAddUsername}>
              +
            </button>
          )}
        </div>

        {usernames.length > 0 && (
          <div className="usernames-list">
            {usernames.map((name, index) => (
              <div
                key={index}
                className="username-tag"
                onClick={() => handleRemoveUsername(name)}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        {(isVerified || usernames.length > 0) && (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your rumor message"
            className="message-input"
          />
        )}

        {message.trim() && (isVerified || usernames.length > 0) && (
          <RoundedButton
            onClick={handlePost}
            color="var(--primary)"
          >
            Post
          </RoundedButton>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.duration}
        />
      )}
    </div>
  );
}

export default Post; 