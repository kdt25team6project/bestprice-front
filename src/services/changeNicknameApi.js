import axios from "axios";

export async function changeNickname(userId, newNickname) {
    try {
        const response = await axios.patch(`http://localhost:8001/user/nickname`, {
            userId,
            newNickname,
        });
        return response.data; // Assuming response contains the success message
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다."
        );
    }
}