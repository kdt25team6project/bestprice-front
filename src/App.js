import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeDetailPage from './components/RecipeDetailPage';
import SearchResultsPage from './components/SearchResultsPage';
import TipsPage from './components/TipsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchResultsPage />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        <Route path="/tips" element={<TipsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
