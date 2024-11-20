import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userState, LOCAL_STORAGE_KEY } from "../state/userState"; // Recoil 상태와 로컬 스토리지 키 가져오기

const useLogout = () => {
    const navigate = useNavigate();
    const [, setUser] = useRecoilState(userState);

    const logout = async () => {
        try {
            // 1. 백엔드 로그아웃 API 호출
            const token = localStorage.getItem("accessToken");
            if (token) {
                await axios.post(
                    "http://localhost:8001/user/logout", // 백엔드 로그아웃 엔드포인트
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // JWT 토큰 전달
                        },
                    }
                );
            }

            // 2. 클라이언트 상태 및 로컬 스토리지 초기화
            setUser({ user: null }); // Recoil 상태 초기화
            localStorage.removeItem(LOCAL_STORAGE_KEY); // 로컬 스토리지 데이터 제거
            localStorage.removeItem("accessToken"); // 액세스 토큰 제거

            // 3. 홈 화면으로 이동
            navigate("/");
        } catch (error) {
            console.error("로그아웃 실패:", error.message);

            // 백엔드 호출 실패 시에도 클라이언트 상태 초기화
            setUser({ user: null });
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            localStorage.removeItem("accessToken");

            // 에러 메시지 출력
            alert("로그아웃에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }
    };

    return logout;
};

export default useLogout;
