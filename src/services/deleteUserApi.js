import axios from "axios";

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete("http://localhost:8001/user", {
            data: { userId }, // 요청 본문에 userId 전달
        });
        return response.data; // 성공 메시지 반환
    } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        throw new Error(
            error.response?.data?.message || "회원 탈퇴 요청 중 오류가 발생했습니다."
        );
    }
};
