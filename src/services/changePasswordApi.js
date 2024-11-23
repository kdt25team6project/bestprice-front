import axios from "axios";

// 비밀번호 변경 API 함수
export async function changePassword(userId, password, confirmPassword) {
    try {
        const response = await axios.patch(
            `http://localhost:8001/user/password`,
            {
                userId,
                password,
                confirmPassword,
            }
        );
        return response.data.message;
    } catch (error) {
        throw new Error(error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
    }
}
