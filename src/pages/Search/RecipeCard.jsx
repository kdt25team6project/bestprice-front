import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, onBookmark, bookmarkedRecipes }) => {
	const isBookmarked = bookmarkedRecipes.some((r) => r.id === recipe.id);
	const navigate = useNavigate();

	const handleRecipeClick = () => {
		navigate(`/recipe/${recipe.id}`);
	};

	return (
		<div className="recipe-card">
			<img
				src={`/images/${recipe.name}.jpg`}
				alt={recipe.name}
				className="recipe-card-image"
				onClick={handleRecipeClick}
			/>
			<button className="recipe-title" onClick={handleRecipeClick}>
				{recipe.name}
			</button>

			{/* 작성자, 조회수, 추천수, 난이도 출력 */}
			<p className="recipe-info">
				작성자: {recipe.RGTR_NM} ({recipe.RGTR_ID})
			</p>
			<p className="recipe-info">조회수: {recipe.INQ_CNT}</p>
			<p className="recipe-info">추천수: {recipe.RCMM_CNT}</p>
			<p className="recipe-info">난이도: {recipe.CKG_DODF_NM}</p>

			<button
				className={`btn ${isBookmarked ? "btn-warning" : "btn-success"} btn-sm`}
				onClick={() => onBookmark(recipe)}
				style={{ float: "right" }}
			>
				{isBookmarked ? "찜 해제" : "찜하기"}
			</button>
		</div>
	);
};

export default RecipeCard;
