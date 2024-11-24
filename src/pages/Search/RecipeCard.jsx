import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { userState } from '../../state/userState';
import { checkBookmark, toggleBookmark } from "./Bookmark";
import { checkRecommendation, toggleRecommend } from "./Recommend";
import axios from "axios";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const { user } = useRecoilValue(userState);
    const userId = user?.userId;

    const handleRecipeClick = async () => {
        try {
            await axios.post(`http://localhost:8001/api/recipe/${recipe.id}/view`);
            navigate(`/recipe/${recipe.id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("레시피 클릭 처리 중 오류 발생:", error);
        }
    };

    const handleRecommendClick = async () => {
        try {
            const isRecommended = await checkRecommendation(recipe.id, userId); // 추천 여부 확인
            await toggleRecommend(recipe.id, userId, isRecommended); // 추천 상태 토글
            alert(isRecommended ? "추천이 취소되었습니다." : "추천이 완료되었습니다.");
        } catch (error) {
            console.error("추천 처리 중 오류 발생:", error);
        }
    };

    const handleBookmarkClick = async () => {
        try {
            const isBookmarked = await checkBookmark(recipe.id, userId); // 찜 여부 확인
            await toggleBookmark(recipe.id, userId, isBookmarked); // 찜 상태 토글
            alert(isBookmarked ? "찜이 해제되었습니다." : "찜이 완료되었습니다.");
        } catch (error) {
            console.error("찜 처리 중 오류 발생:", error);
        }
    };

    return (
        <div className="recipe-card">
            <img
                src={`${recipe.mainThumb}`}
                alt={recipe.name}
                className="recipe-card-image"
                onClick={handleRecipeClick}
            />
            <button className="recipe-title" onClick={handleRecipeClick}>
                {recipe.name}
            </button>

            <p className="recipe-info">작성자: {recipe.RGTR_NM} ({recipe.RGTR_ID})</p>
            <p className="recipe-info">조회수: {recipe.INQ_CNT}</p>
            <p className="recipe-info">난이도: {recipe.CKG_DODF_NM}</p>

            <div className="recipe-buttons">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRecommendClick}
                >
                    추천하기
                </button>
                <button
                    className="btn btn-success btn-sm"
                    onClick={handleBookmarkClick}
                >
                    찜하기
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;

