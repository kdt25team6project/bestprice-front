import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import axios from "axios";
import "./styles.css";

const PreferencesModal = ({ show, onClose }) => {
	const user = useRecoilValue(userState);
	const [preferences, setPreferences] = useState({
		difficulty: "",
		portion: "",
		category: "",
		method: "",
	});

	const handleInputChange = (key, value) => {
		setPreferences((prev) => ({ ...prev, [key]: value }));
	};

	const savePreferences = async () => {
		try {
			const userId = user?.user?.userId;
			if (!userId) throw new Error("사용자 정보를 찾을 수 없습니다.");

			await axios.post("http://localhost:8001/api/preferences", {
				userId,
				difficulty: preferences.difficulty,
				portion: preferences.portion,
				category: preferences.category,
				method: preferences.method,
			});

			alert("선호도가 저장되었습니다.");
			onClose(); // Close the modal
		} catch (error) {
			console.error("선호도 저장 실패:", error);
			alert("선호도 저장에 실패했습니다. 다시 시도해주세요.");
		}
	};

	return (
		<Modal show={show} onHide={onClose} centered>
			<Modal.Header closeButton>
				<Modal.Title className="modal-title">나의 선호도 설정</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="preferences-section">
					{/* 난이도 */}
					<div className="preferences-item">
						<label>난이도:</label>
						<select
							value={preferences.difficulty}
							onChange={(e) => handleInputChange("difficulty", e.target.value)}
						>
							<option value="">선택</option>
							<option value="아무나">아무나</option>
							<option value="초급">초급</option>
							<option value="중급">중급</option>
							<option value="고급">고급</option>
						</select>
					</div>

					{/* 인분 */}
					<div className="preferences-item">
						<label>인분:</label>
						<select
							value={preferences.portion}
							onChange={(e) => handleInputChange("portion", e.target.value)}
						>
							<option value="">선택</option>
							<option value="1인분">1인분</option>
							<option value="2인분">2인분</option>
							<option value="3인분">3인분</option>
							<option value="4인분">4인분</option>
							<option value="6인분이상">6인분 이상</option>
						</select>
					</div>

					{/* 분류 */}
					<div className="preferences-item">
						<label>분류:</label>
						<select
							value={preferences.category}
							onChange={(e) => handleInputChange("category", e.target.value)}
						>
							<option value="">선택</option>
							<option value="밑반찬">밑반찬</option>
							<option value="메인반찬">메인반찬</option>
							<option value="국/탕">국/탕</option>
							<option value="찌개">찌개</option>
							<option value="디저트">디저트</option>
							<option value="퓨전">퓨전</option>
							<option value="김치/젓갈/장류">김치/젓갈/장류</option>
							<option value="양식">양식</option>
							<option value="샐러드">샐러드</option>
							<option value="스프">스프</option>
							<option value="차/음료/술">차/음료/술</option>
							<option value="기타">기타</option>
						</select>
					</div>

					{/* 조리방식 */}
					<div className="preferences-item">
						<label>조리방식:</label>
						<select
							value={preferences.method}
							onChange={(e) => handleInputChange("method", e.target.value)}
						>
							<option value="">선택</option>
							<option value="볶음">볶음</option>
							<option value="끓이기">끓이기</option>
							<option value="부침">부침</option>
							<option value="찜">찜</option>
							<option value="조림">조림</option>
							<option value="무침">무침</option>
							<option value="비빔">비빔</option>
							<option value="절임">절임</option>
							<option value="튀김">튀김</option>
							<option value="삶기">삶기</option>
							<option value="굽기">굽기</option>
							<option value="데치기">데치기</option>
							<option value="회">회</option>
							<option value="기타">기타</option>
						</select>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					닫기
				</Button>
				<Button
					variant="primary"
					onClick={savePreferences}
					style={{ backgroundColor: "#ff5833", borderColor: "#ff5833" }}
				>
					저장
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PreferencesModal;
