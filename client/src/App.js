import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
import Search from './pages/Search';
import RumorType from './pages/RumorType';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/search" element={<Search />} />
        <Route path="/rumor-type/:username" element={<RumorType />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App; 