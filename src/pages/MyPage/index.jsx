import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";
import { changeNickname } from "../../services/changeNicknameApi"; // 닉네임 변경 API 호출
import { changePassword } from "../../services/changePasswordApi"; // 비밀번호 변경 API 호출
import "./styles.css";

const MyPage = () => {
    const user = useRecoilValue(userState); // Recoil 상태 읽기 (현재 로그인한 사용자 정보 가져오기)
    const [activeTab, setActiveTab] = useState("product"); // 활성 탭 상태 관리 ("product" 또는 "recipe")
    const [isSettingsVisible, setIsSettingsVisible] = useState(false); // 설정 화면 표시 상태

    // 사용자 정보에서 닉네임 추출
    const { nickname } = user?.user || {};

    return (
        <div className="mypage-container">
            {/* 사용자 정보 섹션 */}
            <div className="user-info">
                <div className="user-avatar-details">
                    <div className="user-avatar">
                        <span role="img" aria-label="avatar">
                            😊
                        </span>
                    </div>
                    <div className="user-details">
                        <h2>{nickname || "닉네임"}</h2>
                    </div>
                </div>
                <div
                    className="settings-icon"
                    onClick={() => setIsSettingsVisible(!isSettingsVisible)}
                    title="설정"
                >
                    ⚙️
                </div>
            </div>

            {/* 설정 섹션 */}
            {isSettingsVisible ? (
                <SettingsSection user={user} />
            ) : (
                <DefaultSection activeTab={activeTab} setActiveTab={setActiveTab} />
            )}

            {/* 관심 상품/레시피 섹션 */}
            {!isSettingsVisible && <ScrapSection activeTab={activeTab} />}
        </div>
    );
};

// 기본 섹션 (마이페이지 초기 화면)
const DefaultSection = ({ activeTab, setActiveTab }) => (
    <div>
        <hr className="divider" />
        <div className="user-actions">
            <div
                className={`action-item ${activeTab === "product" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("product")}
            >
                <i className="bi bi-bookmark"></i>
                <p>관심 상품</p>
            </div>
            <div
                className={`action-item ${activeTab === "recipe" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("recipe")}
            >
                <i className="bi bi-cart"></i>
                <p>관심 레시피</p>
            </div>
        </div>
    </div>
);

// 설정 섹션
const SettingsSection = ({ user }) => {
    const setUser = useSetRecoilState(userState); // Recoil 상태를 업데이트하기 위해 사용
    const [nickname, setNickname] = useState(user?.user?.nickname || ""); // 닉네임을 상태로 관리
    const [password, setPassword] = useState(""); // 비밀번호를 상태로 관리
    const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태 관리
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [error, setError] = useState(null); // 오류 메시지 관리

    // 닉네임 변경 요청 처리 함수
    const handleNicknameUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            // 사용자 ID 가져오기
            const userId = user?.user?.userId;
            if (!userId) {
                throw new Error("사용자 ID를 찾을 수 없습니다.");
            }

            // 닉네임 변경 API 호출
            await changeNickname(userId, nickname);
            setUser((prevState) => ({
                ...prevState,
                user: { ...prevState.user, nickname },
            }));
            alert("닉네임이 성공적으로 변경되었습니다.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 변경 요청 처리 함수
    const handlePasswordChange = async () => {
        setLoading(true);
        setError(null);
        try {
            // 비밀번호 확인 검증
            if (password !== confirmPassword) {
                throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            }

            // 사용자 ID 가져오기
            const userId = user?.user?.userId;
            if (!userId) {
                throw new Error("사용자 ID를 찾을 수 없습니다.");
            }

            // 비밀번호 변경 API 호출
            await changePassword(userId, password, confirmPassword);
            alert("비밀번호가 성공적으로 변경되었습니다.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountDelete = () => {
        if (window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
            alert("회원 탈퇴 로직 추가 예정");
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-item">
                <label>닉네임</label>
                <div className="nickname-section">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        disabled={loading} // 로딩 중에는 입력 비활성화
                    />
                    <button onClick={handleNicknameUpdate} disabled={loading}>
                        {loading ? "업데이트 중..." : "수정"}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>} {/* 오류 메시지 출력 */}
            </div>
            <div className="settings-item">
                <label>비밀번호</label>
                <div className="password-section-vertical">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading} // 로딩 중에는 입력 비활성화
                        className="password-input"
                        placeholder="새 비밀번호"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading} // 로딩 중에는 입력 비활성화
                        className="password-input"
                        placeholder="비밀번호 확인"
                    />
                    <button onClick={handlePasswordChange} disabled={loading}>
                        {loading ? "업데이트 중..." : "수정"}
                    </button>
                </div>
            </div>
            <div className="settings-item">
                <label>회원탈퇴</label>
                <button className="danger" onClick={handleAccountDelete}>
                    회원탈퇴
                </button>
            </div>
        </div>
    );
};

// 관심 상품/레시피 섹션
const ScrapSection = ({ activeTab }) => {
    const scraps = {
        product: [], // 관심 상품 데이터
        recipe: [],  // 관심 레시피 데이터
    };

    const items = scraps[activeTab];

    return (
        <div className="scrap-section">
            <hr className="divider" />
            {items.length > 0 ? (
                <div className="scrap-list">
                    {items.map((item, index) => (
                        <div key={index} className="scrap-item">
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-scraps">
                    <p>스크랩한 {activeTab === "product" ? "상품이" : "레시피가"} 없습니다.</p>
                    <button
                        onClick={() => alert("추천 항목 보러가기 로직 추가 예정")}
                        className="recommend-btn"
                    >
                        추천 {activeTab === "product" ? "상품" : "레시피"} 보러가기
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyPage;
