import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userState } from "../../state/userState";
import { useRecoilValue } from "recoil";
import axios from "axios";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, bookmarkedRecipes, onBookmarkUpdate = () => {} }) => {
    const [isRecommended, setIsRecommended] = useState(false);
    const [recommendCount, setRecommendCount] = useState(recipe?.RCMM_CNT || 0);
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
        if (!checkUserId() || !recipe?.id) return;
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
        if (!checkUserId() || !recipe?.id) return;
        try {
            const { data } = await axios.get(
                `http://localhost:8001/api/recipe/${recipe.id}/bookmark`,
                { params: { userId } }
            );
            setIsBookmarked(data);
        } catch (error) {
            console.error("찜 상태 확인 실패:", error);
        }
    };

    const toggleRecommend = async () => {
        if (!checkUserId() || isLoading || !recipe?.id) return;

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
        if (!checkUserId() || isLoading || !recipe?.id) return;

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
            if (!recipe?.id) {
                console.warn("Recipe ID is missing. Cannot navigate to details.");
                return;
            }
            await axios.post(`http://localhost:8001/api/recipe/${recipe.id}/view`);
            navigate(`/recipe/${recipe.id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("레시피 클릭 처리 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        if (recipe?.id) {
            checkRecommendation();
            checkBookmark();
        }
    }, [recipe?.id, userId]);

    return (
        <div className="recipe-card">
            {/* 이미지 렌더링 */}
            <img
                src={recipe.image_URL || recipe.mainThumb || "default-image.jpg"} 
                alt={recipe.rcp_TTL || recipe.name || "레시피"} 
                className="recipe-card-image"
                onClick={handleRecipeClick}
            />
    
            {/* 레시피 제목 */}
            <button className="recipe-title" onClick={handleRecipeClick}>
                {recipe.rcp_TTL || recipe.name || "레시피 이름"}
            </button>
    
            {/* 작성자 정보 */}
            <p className="recipe-info">
                작성자: {recipe.rgtr_NM || recipe.RGTR_NM || "알 수 없음"} ({recipe.rgtr_ID || recipe.RGTR_ID || "알 수 없음"})
            </p>
    
            {/* 추가 정보 */}
            <p className="recipe-info">조회수: {recipe.inq_CNT || recipe.INQ_CNT || 0}</p>
            <p className="recipe-info">추천수: {recommendCount}</p>
            <p className="recipe-info">난이도: {recipe.ckg_DODF_NM || recipe.CKG_DODF_NM || "알 수 없음"}</p>
    
            {/* 찜 및 추천 버튼 */}
            <div className="button-group">
                <button
                    className={`btn ${isBookmarked ? "btn-warning" : "btn-success"} btn-sm`}
                    onClick={toggleBookmark}
                    disabled={isLoading}
                >
                    {isBookmarked ? "찜 해제" : "찜하기"}
                </button>
                <button
                    className={`btn ${isRecommended ? "btn-danger" : "btn-primary"} btn-sm`}
                    onClick={toggleRecommend}
                    disabled={isLoading}
                >
                    {isRecommended ? "추천 취소" : "추천하기"}
                </button>
            </div>
        </div>
    );
    
};

export default RecipeCard;

