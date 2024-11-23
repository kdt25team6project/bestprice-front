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
	const [preferences, setPreferences] = useState(null); // 사용자 선호도
	const [isLoading, setIsLoading] = useState(false); // 로딩 상태

	const { nickname, userId } = user?.user || {};

	useEffect(() => {
		if (activeTab === "preference" && userId) {
			fetchPreferences();
		} else if (activeTab === "recipe" && userId) {
			fetchBookmarkedRecipes();
		}
	}, [activeTab, userId]);

	const fetchPreferences = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:8001/api/preferences/${userId}`
			);
			// 키 매핑: API 응답 키 -> 프론트엔드 키
			const mappedPreferences = {
				difficulty: data.ckg_DODF_NM,
				portion: data.ckg_INBUN_NM,
				category: data.ckg_KND_ACTO_NM,
				method: data.ckg_MTH_ACTO_NM,
			};
			setPreferences(mappedPreferences);
		} catch (error) {
			console.error("사용자 선호도를 불러오는 중 오류 발생:", error);
		}
	};

	const fetchBookmarkedRecipes = async () => {
		setIsLoading(true); // 로딩 상태 활성화
		try {
			// 1단계: 북마크된 레시피 ID 가져오기
			const { data: bookmarkedIds } = await axios.get(
				"http://localhost:8001/api/recipe/bookmarks",
				{ params: { userId } }
			);
			console.log("북마크된 레시피 ID:", bookmarkedIds);

			// 2단계: 각 레시피 ID로 상세 정보 요청
			const recipeDetails = await Promise.all(
				bookmarkedIds.map(async (id) => {
					const { data: recipe } = await axios.get(
						`http://localhost:8001/api/recipe/${id}`
					);
					return { ...recipe, id }; // 레시피에 ID 추가
				})
			);
			console.log("변환된 데이터 (레시피 상세):", recipeDetails);

			// 북마크된 레시피 상태 업데이트
			setBookmarkedRecipes(recipeDetails);
		} catch (error) {
			console.error("북마크된 레시피를 가져오는 중 오류 발생:", error);
		} finally {
			setIsLoading(false); // 로딩 상태 해제
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
					setPreferences={setPreferences}
					bookmarkedRecipes={bookmarkedRecipes}
					isLoading={isLoading}
                    userId={userId}
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
	setPreferences,
	bookmarkedRecipes,
	isLoading,
    userId,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [updatedPreferences, setUpdatedPreferences] = useState(
		preferences || {}
	);

	useEffect(() => {
        if (preferences) {
            setUpdatedPreferences({
                difficulty: preferences.difficulty || "",
                portion: preferences.portion || "",
                category: preferences.category || "",
                method: preferences.method || "",
            });
        }
    }, [preferences]);

	const handleInputChange = (key, value) => {
		setUpdatedPreferences((prev) => ({ ...prev, [key]: value }));
	};

	const savePreferences = async () => {
		try {
			// 프론트엔드 키 -> API 키로 매핑
			const apiPreferences = {
				userId, // 사용자 ID
				difficulty: updatedPreferences.difficulty,
				portion: updatedPreferences.portion,
				category: updatedPreferences.category,
				method: updatedPreferences.method,
			};

			// 디버깅: 서버로 보낼 데이터 확인
			console.log("전송될 데이터:", apiPreferences);

			await axios.put(`http://localhost:8001/api/preferences`, apiPreferences);
			setPreferences(updatedPreferences);
			setIsEditing(false);
			alert("선호도가 저장되었습니다.");
		} catch (error) {
			console.error("선호도 저장 실패:", error);
			alert("선호도 저장에 실패했습니다.");
		}
	};

	return (
		<div>
			<div className="user-actions">
				<div
					className={`action-item ${
						activeTab === "preference" ? "active-tab" : ""
					}`}
					onClick={() => setActiveTab("preference")}
				>
					<i className="bi bi-heart"></i>
					<p>나의 선호도</p>
				</div>
				<div
					className={`action-item ${
						activeTab === "recipe" ? "active-tab" : ""
					}`}
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
								onChange={(e) =>
									handleInputChange("difficulty", e.target.value)
								}
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
					<button
						onClick={isEditing ? savePreferences : () => setIsEditing(true)}
					>
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
						<div className="no-scraps">
							<p>스크랩한 레시피가 없습니다.</p>
							<button className="recommend-btn">추천 레시피 보러가기</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default MyPage;
