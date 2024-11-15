import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeDetailPage from './components/RecipeDetailPage';
import SearchResultsPage from './components/SearchResultsPage';
import TipsPage from './components/TipsPage';
import LoginPage from './components/LoginPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchResultsPage />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
