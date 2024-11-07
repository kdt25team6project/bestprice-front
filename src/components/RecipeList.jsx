import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, onBookmark, bookmarkedRecipes, layout }) => {
  return (
    <div className={`recipe-list ${layout}`}>
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onBookmark={onBookmark} 
          bookmarkedRecipes={bookmarkedRecipes} 
        />
      ))}
    </div>
  );
};

export default RecipeList;