import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userState } from '../../state/userState';
import { useRecoilValue } from 'recoil';
import axios from "axios";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, bookmarkedRecipes, onBookmarkUpdate = () => {} }) => {
    const [isRecommended, setIsRecommended] = useState(false);
    const [recommendCount, setRecommendCount] = useState(recipe.RCMM_CNT);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { user } = useRecoilValue(userState);
    const userId = user?.userId;

    const checkUserId = () => {
        if (!userId) {
            console.warn("User ID가 전달되지 않았습니다.");
            return false;
        }
        return true;
    };

    const checkRecommendation = async () => {
        if (!checkUserId()) return;
        try {
            const { data } = await axios.get(
                `http://localhost:8001/api/recipe/${recipe.id}/recommend`,
                { params: { userId } }
            );
            setIsRecommended(data);
        } catch (error) {
            console.error("추천 여부 확인 실패:", error);
        }
    };

    const checkBookmark = async () => {
        if (!checkUserId()) return;
        try {
            const { data } = await axios.get(`http://localhost:8001/api/recipe/${recipe.id}/bookmark`, {
                params: { userId },
            });
            setIsBookmarked(data);
        } catch (error) {
            console.error("찜 상태 확인 실패:", error);
        }
    };

    const toggleRecommend = async () => {
        if (!checkUserId() || isLoading) return;

        setIsLoading(true);
        try {
            if (isRecommended) {
                await axios.delete(`http://localhost:8001/api/recipe/${recipe.id}/recommend`, {
                    params: { userId },
                });
                setRecommendCount((prev) => prev - 1);
                setIsRecommended(false);
                alert("추천 취소 완료!");
            } else {
                await axios.post(`http://localhost:8001/api/recipe/${recipe.id}/recommend`, null, {
                    params: { userId },
                });
                setRecommendCount((prev) => prev + 1);
                setIsRecommended(true);
                alert("추천 완료!");
            }
        } catch (error) {
            console.error("추천 상태 업데이트 실패:", error);
            alert("추천 상태 변경 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBookmark = async () => {
        if (!checkUserId() || isLoading) return;

        setIsLoading(true);
        try {
            if (isBookmarked) {
                await axios.delete(`http://localhost:8001/api/recipe/${recipe.id}/bookmark`, {
                    params: { userId },
                });
                setIsBookmarked(false);
                alert("찜 해제 완료!");
            } else {
                await axios.post(`http://localhost:8001/api/recipe/${recipe.id}/bookmark`, null, {
                    params: { userId },
                });
                setIsBookmarked(true);
                alert("찜 추가 완료!");
            }

            // onBookmarkUpdate가 함수인지 확인 후 호출
            if (typeof onBookmarkUpdate === "function") {
                onBookmarkUpdate(recipe);
            } else {
                console.warn("onBookmarkUpdate가 함수가 아닙니다.");
            }
        } catch (error) {
            console.error("찜 상태 업데이트 실패:", error);
            alert("찜 상태 변경 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecipeClick = async () => {
        try {
            await axios.post(`http://localhost:8001/api/recipe/${recipe.id}/view`);
            navigate(`/recipe/${recipe.id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("레시피 클릭 처리 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        checkRecommendation();
        checkBookmark();
    }, [userId]);

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
            <p className="recipe-info">추천수: {recommendCount}</p>
            <p className="recipe-info">난이도: {recipe.CKG_DODF_NM}</p>

            <button
                className={`btn ${isBookmarked ? "btn-warning" : "btn-success"} btn-sm`}
                onClick={toggleBookmark}
                style={{ float: "right" }}
                disabled={isLoading}
            >
                {isBookmarked ? "찜 해제" : "찜하기"}
            </button>

            <button
                className={`btn ${isRecommended ? "btn-danger" : "btn-primary"} btn-sm`}
                onClick={toggleRecommend}
                style={{ float: "left", marginTop: "10px" }}
                disabled={isLoading}
            >
                {isRecommended ? "추천 취소" : "추천하기"}
            </button>
        </div>
    );
};

export default RecipeCard;
