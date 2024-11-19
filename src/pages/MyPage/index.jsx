import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";
import "./styles.css";

const MyPage = () => {
    const user = useRecoilValue(userState); // Recoil 상태 읽기
    const [activeTab, setActiveTab] = useState("product"); // 활성 탭 ("product" 또는 "recipe")
    const [isSettingsVisible, setIsSettingsVisible] = useState(false); // 설정 화면 표시 상태

    // 사용자 정보
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
                <SettingsSection user={{ nickname }} />
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
    const setUser = useSetRecoilState(userState);

    const handleNicknameChange = (e) => {
        const newNickname = e.target.value;
        setUser((prevState) => ({
            ...prevState,
            user: { ...prevState.user, nickname: newNickname },
        }));
    };

    const handlePasswordChange = () => {
        alert("비밀번호 변경 로직 추가 예정");
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
                        defaultValue={user.nickname || ""}
                        onChange={handleNicknameChange}
                    />
                    <button>수정</button>
                </div>
            </div>
            <div className="settings-item">
                <label>비밀번호</label>
                <button onClick={handlePasswordChange}>비밀번호 수정</button>
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
