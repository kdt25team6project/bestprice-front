import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";
import { changeNickname } from "../../services/changeNicknameApi";
import { changePassword } from "../../services/changePasswordApi";
import { deleteUser } from "../../services/deleteUserApi";
import useLogout from "../../hooks/useLogout";
import RecipeList from "../Search/RecipeList";
import axios from "axios";
import "./styles.css";

const MyPage = () => {
    const user = useRecoilValue(userState); // 사용자 상태
    const [activeTab, setActiveTab] = useState("preference"); // 기본 활성 탭
    const [isSettingsVisible, setIsSettingsVisible] = useState(false); // 설정 화면 표시 여부
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]); // 북마크된 레시피
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const { nickname, preferences, userId } = user?.user || {};

    useEffect(() => {
        if (activeTab === "recipe" && userId) {
            fetchBookmarkedRecipes();
        }
    }, [activeTab, userId]);

    const fetchBookmarkedRecipes = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get("http://localhost:8001/api/recipe/bookmarks", {
                params: { userId },
            });
            setBookmarkedRecipes(data);
        } catch (error) {
            console.error("북마크된 레시피를 가져오는 중 오류 발생:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                <PreferencesAndScrapSection
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    preferences={preferences}
                    bookmarkedRecipes={bookmarkedRecipes}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

const SettingsSection = ({ user }) => {
    const setUser = useSetRecoilState(userState);
    const [nickname, setNickname] = useState(user?.user?.nickname || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const logout = useLogout();

    const handleNicknameUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = user?.user?.userId;
            if (!userId) {
                throw new Error("사용자 ID를 찾을 수 없습니다.");
            }
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

    const handlePasswordChange = async () => {
        setLoading(true);
        setError(null);
        try {
            if (password !== confirmPassword) {
                throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            }
            const userId = user?.user?.userId;
            if (!userId) {
                throw new Error("사용자 ID를 찾을 수 없습니다.");
            }
            await changePassword(userId, password, confirmPassword);
            alert("비밀번호가 성공적으로 변경되었습니다.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountDelete = async () => {
        if (!window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) return;

        try {
            setLoading(true);
            const userId = user?.user?.userId;
            if (!userId) {
                throw new Error("사용자 정보를 찾을 수 없습니다.");
            }
            await deleteUser(userId);
            alert("회원 탈퇴가 완료되었습니다.");
            logout();
        } catch (error) {
            console.error("회원 탈퇴 중 오류:", error);
            alert(error.message);
        } finally {
            setLoading(false);
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
                        disabled={loading}
                    />
                    <button onClick={handleNicknameUpdate} disabled={loading}>
                        {loading ? "업데이트 중..." : "수정"}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="settings-item">
                <label>비밀번호</label>
                <div className="password-section-vertical">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="password-input"
                        placeholder="새 비밀번호"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
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

const PreferencesAndScrapSection = ({
    activeTab,
    setActiveTab,
    preferences,
    bookmarkedRecipes,
    isLoading,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPreferences, setUpdatedPreferences] = useState(preferences || {});

    const handleInputChange = (key, value) => {
        setUpdatedPreferences((prev) => ({ ...prev, [key]: value }));
    };

    const savePreferences = () => {
        alert("선호도가 저장되었습니다.");
        setIsEditing(false);
        // API 호출 로직 또는 상태 업데이트를 추가할 수 있습니다.
        // 예: savePreferencesToAPI(updatedPreferences);
    };

    return (
        <div>
            <div className="user-actions">
                <div
                    className={`action-item ${activeTab === "preference" ? "active-tab" : ""}`}
                    onClick={() => setActiveTab("preference")}
                >
                    <i className="bi bi-heart"></i>
                    <p>나의 선호도</p>
                </div>
                <div
                    className={`action-item ${activeTab === "recipe" ? "active-tab" : ""}`}
                    onClick={() => setActiveTab("recipe")}
                >
                    <i className="bi bi-bookmark"></i>
                    <p>관심 레시피</p>
                </div>
            </div>

            {activeTab === "preference" ? (
                <div className="preferences-section">
                    {/* 난이도 */}
                    <div className="preferences-item">
                        <label>난이도:</label>
                        {isEditing ? (
                            <select
                                value={updatedPreferences.difficulty || ""}
                                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                            >
                                <option value="">선택</option>
                                <option value="아무나">아무나</option>
                                <option value="초급">초급</option>
                                <option value="중급">중급</option>
                                <option value="고급">고급</option>
                            </select>
                        ) : (
                            <span>{updatedPreferences.difficulty || "설정되지 않음"}</span>
                        )}
                    </div>

                    {/* 인분 */}
                    <div className="preferences-item">
                        <label>인분:</label>
                        {isEditing ? (
                            <select
                                value={updatedPreferences.portion || ""}
                                onChange={(e) => handleInputChange("portion", e.target.value)}
                            >
                                <option value="">선택</option>
                                <option value="1인분">1인분</option>
                                <option value="2인분">2인분</option>
                                <option value="3인분">3인분</option>
                                <option value="4인분">4인분</option>
                                <option value="6인분 이상">6인분 이상</option>
                            </select>
                        ) : (
                            <span>{updatedPreferences.portion || "설정되지 않음"}</span>
                        )}
                    </div>

                    {/* 분류 (종류별) */}
                    <div className="preferences-item">
                        <label>분류:</label>
                        {isEditing ? (
                            <select
                                value={updatedPreferences.category || ""}
                                onChange={(e) => handleInputChange("category", e.target.value)}
                            >
                                <option value="">선택</option>
                                <option value="밑반찬">밑반찬</option>
                                <option value="메인반찬">메인반찬</option>
                                <option value="국/탕">국/탕</option>
                                <option value="찌개">찌개</option>
                                <option value="디저트">디저트</option>
                                <option value="퓨전">퓨전</option>
                                <option value="기타">기타</option>
                            </select>
                        ) : (
                            <span>{updatedPreferences.category || "설정되지 않음"}</span>
                        )}
                    </div>

                    {/* 조리방식 */}
                    <div className="preferences-item">
                        <label>조리방식:</label>
                        {isEditing ? (
                            <select
                                value={updatedPreferences.method || ""}
                                onChange={(e) => handleInputChange("method", e.target.value)}
                            >
                                <option value="">선택</option>
                                <option value="볶음">볶음</option>
                                <option value="끓이기">끓이기</option>
                                <option value="부침">부침</option>
                                <option value="찜">찜</option>
                                <option value="조림">조림</option>
                                <option value="무침">무침</option>
                                <option value="기타">기타</option>
                            </select>
                        ) : (
                            <span>{updatedPreferences.method || "설정되지 않음"}</span>
                        )}
                    </div>

                    {/* 수정 및 저장 버튼 */}
                    <button onClick={isEditing ? savePreferences : () => setIsEditing(true)}>
                        {isEditing ? "저장" : "수정"}
                    </button>
                </div>
            ) : (
                <div className="scrap-section">
                    {isLoading ? (
                        <p>로딩 중...</p>
                    ) : bookmarkedRecipes.length > 0 ? (
                        <RecipeList recipes={bookmarkedRecipes} layout="grid" />
                    ) : (
                        <p>스크랩된 레시피가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};


export default MyPage;
