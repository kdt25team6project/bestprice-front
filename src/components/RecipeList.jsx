import React from 'react';
import RecipeCard from './RecipeCard';
import '../css/RecipeList.css';

const RecipeList = ({ recipes, onBookmark, bookmarkedRecipes = [], layout }) => {
  const getColumnClass = () => {
    if (layout === 'one-column') return 'col-12';
    if (layout === 'two-column') return 'col-md-6';
    if (layout === 'three-column') return 'col-md-4';
    return 'col-md-4'; 
  };

  return (
    <div className="recipe-list">
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className={getColumnClass()}>
            <RecipeCard 
              recipe={recipe} 
              onBookmark={onBookmark} 
              bookmarkedRecipes={bookmarkedRecipes} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
