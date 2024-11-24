import axios from "axios";

export const checkBookmark = async (recipeId, userId) => {
    try {
        const { data } = await axios.get(`http://localhost:8001/api/recipe/${recipeId}/bookmark`, {
            params: { userId },
        });
        return data;
    } catch (error) {
        console.error("찜 여부 확인 실패:", error);
        throw error;
    }
};

export const toggleBookmark = async (recipeId, userId, isBookmarked) => {
    try {
        if (isBookmarked) {
            await axios.delete(`http://localhost:8001/api/recipe/${recipeId}/bookmark`, { params: { userId } });
            return false; // 찜 해제 상태
        } else {
            await axios.post(`http://localhost:8001/api/recipe/${recipeId}/bookmark`, null, { params: { userId } });
            return true; // 찜 추가 상태
        }
    } catch (error) {
        console.error("찜 상태 업데이트 실패:", error);
        throw error;
    }
};
