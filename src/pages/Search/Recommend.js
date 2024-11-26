import axios from "axios";

export const checkRecommendation = async (recipeId, userId) => {
    try {
        const { data } = await axios.get(`http://localhost:8001/api/recipe/${recipeId}/recommend`, {
            params: { userId },
        });
        return data;
    } catch (error) {
        console.error("추천 여부 확인 실패:", error);
        throw error;
    }
};

export const toggleRecommend = async (recipeId, userId, isRecommended) => {
    try {
        if (isRecommended) {
            await axios.delete(`http://localhost:8001/api/recipe/${recipeId}/recommend`, { params: { userId } });
            alert("추천 취소 완료!");
            return false; // 추천 취소 상태
        } else {
            await axios.post(`http://localhost:8001/api/recipe/${recipeId}/recommend`, null, { params: { userId } });
            alert("추천 완료!");
            return true; // 추천 상태
        }
    } catch (error) {
        console.error("추천 상태 업데이트 실패:", error);
        throw error;
    }
};
