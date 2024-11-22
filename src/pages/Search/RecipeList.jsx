import React from "react";
import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes, onBookmark, bookmarkedRecipes, layout }) => {
  return (
    <div className={`recipe-list ${layout}`}>
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id || `recipe-${index}`} // Fallback to index if recipe.id is undefined
          recipe={recipe}
          onBookmark={onBookmark}
          bookmarkedRecipes={bookmarkedRecipes}
        />
      ))}
    </div>
  );
};

export default RecipeList;
