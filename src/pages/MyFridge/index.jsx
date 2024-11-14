import React, { useState, useEffect } from 'react';
import "./styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from 'axios';

const MyFridge = () => {
	// 냉장고 상태 관련 useState
	const [isTopDoorOpen, setIsTopDoorOpen] = useState(false);
	const [isBottomDoorOpen, setIsBottomDoorOpen] = useState(false);
	const [isLeftCanvasOpen, setIsLeftCanvasOpen] = useState(false);
	const [isRightCanvasOpen, setIsRightCanvasOpen] = useState(false);

	// 식료품 관련 useState
	const [selectedCategory, setSelectedCategory] = useState('');
	const [foodName, setFoodName] = useState('');
	const [quantity, setQuantity] = useState('');
	const [expirationDate, setExpirationDate] = useState(new Date());
	const [frozen, setFrozen] = useState('냉장');
	const [selectedEmoji, setSelectedEmoji] = useState(null);
	const [foodItems, setFoodItems] = useState([]); // 서버에서 가져온 식료품 목록

	// 상단 냉장고 문 열기/닫기 함수
	const toggleTopDoor = () => {
		setIsTopDoorOpen(!isTopDoorOpen);
	};
	// 하단 냉장고 문 열기/닫기 함수
	const toggleBottomDoor = () => {
		setIsBottomDoorOpen(!isBottomDoorOpen);
	};
	// 왼쪽 패널 열기/닫기 함수
	const toggleLeftCanvas = () => {
		setIsLeftCanvasOpen(!isLeftCanvasOpen);
	};
	// 오른쪽 패널 열기/닫기 함수
	const toggleRightCanvas = () => {
		setIsRightCanvasOpen(!isRightCanvasOpen);
	};

	//카테고리 선택 함수
	const handleCategorySelect = (category) => {
		if (selectedCategory === category) {
			setSelectedCategory(""); // 같은 버튼 클릭 시 해제
		} else {
			setSelectedCategory(category); // 새로운 카테고리 선택 시 선택 상태로
		}
	};
	// 날짜 조정 함수
	const addDays = (days) => {
		const newDate = new Date(expirationDate);
		newDate.setDate(newDate.getDate() + days);
		setExpirationDate(newDate);
	};

	const addWeeks = () => addDays(7); // 1주일 추가
	const addMonths = () => {
		const newDate = new Date(expirationDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setExpirationDate(newDate);
	};

    // API 엔드포인트 설정
	const API_URL = 'http://localhost:8001/refrigerator';

	// 데이터 로드
	useEffect(() => {
		fetchFoodItems();
	}, []);
	
	const fetchFoodItems = async () => {
		try {
			const response = await axios.get(API_URL);
			setFoodItems(response.data);
			console.log('데이터 로드:', response.data);
		} catch (error) {
			console.error('데이터 로드 실패:', error);
		}
	};
	
	// 저장 버튼 클릭 시 실행되는 함수
	const handleSave = async () => {
		const newFoodItem = {
			category: selectedCategory,
			emoji: selectedEmoji,
			name: foodName,
			quantity: parseInt(quantity, 10),
			expirationDate: expirationDate.toISOString().split('T')[0],
			frozen: frozen === '냉동',
		};
	
		try {
			await axios.post(API_URL, newFoodItem); // POST 요청으로 새 항목을 서버에 저장
			console.log('데이터베이스에 저장:', newFoodItem);
			fetchFoodItems(); // 새로고침하여 추가된 데이터를 반영
			resetForm(); // 입력 필드 초기화
		} catch (error) {
			console.error('저장 실패:', error);
		}
	};
	
	// 입력 필드 초기화 함수
	const resetForm = () => {
		setSelectedCategory('');
		setFoodName('');
		setQuantity('');
		setExpirationDate(new Date());
		setFrozen('냉장');
		setSelectedEmoji(null);
	};

	// 이모티콘 선택 처리 함수
	const handleEmojiSelect = (emoji) => {
		setSelectedEmoji(emoji.native); // 선택한 이모티콘의 유니코드 저장
		console.log("선택된 이모지:", emoji.native);
	};

	return (
		<div className="fridge-container">
			{" "}
			{/* 냉장고 컴포넌트의 메인 컨테이너 */}
			{/* 왼쪽 패널을 여는 버튼 - 식료품 추가하기 */}
			<button className="add-button" onClick={toggleLeftCanvas}>
				추가하기
			</button>
			<div className="fridge">
				{" "}
				{/* 냉장고를 나타내는 컨테이너 */}
				<div className="fridge-body">
					{" "}
					{/* 냉장고의 본체 */}
					{/* 상단 냉장고 문 - 클릭하여 열거나 닫기 */}
					<div
						className={`fridge-door fridge-door-top ${
							isTopDoorOpen ? "door-open" : ""
						}`}
						onClick={toggleTopDoor}
					>
						{/* 문이 닫혀 있을 때 손잡이를 표시 */}
						{!isTopDoorOpen && (
							<div className="door-handle door-handle-top"></div>
						)}
						{/* 문이 열렸을 때 내부 문을 표시 */}
						{isTopDoorOpen && (
							<div className="fridge-compartment-door fridge-compartment-door-top"></div>
						)}
					</div>
					{/* 상단 냉장고 칸 - 문이 열렸을 때 보임 */}
					<div
						className={`fridge-compartment fridge-compartment-top ${
							isTopDoorOpen ? "visible" : ""
						}`}
					></div>
					{/* 하단 냉장고 문 - 클릭하여 열거나 닫기 */}
					<div
						className={`fridge-door fridge-door-bottom ${
							isBottomDoorOpen ? "door-open" : ""
						}`}
						onClick={toggleBottomDoor}
					>
						{/* 문이 닫혀 있을 때 손잡이를 표시 */}
						{!isBottomDoorOpen && (
							<div className="door-handle door-handle-bottom"></div>
						)}
						{/* 문이 열렸을 때 내부 문을 표시 */}
						{isBottomDoorOpen && (
							<div className="fridge-compartment-door fridge-compartment-door-bottom"></div>
						)}
					</div>
					{/* 하단 냉장고 칸 - 문이 열렸을 때 보임 */}
					<div
						className={`fridge-compartment fridge-compartment-bottom ${
							isBottomDoorOpen ? "visible" : ""
						}`}
					></div>
				</div>
			</div>
			{/* 오른쪽 패널을 여는 버튼 - 더보기 */}
			<button className="more-button" onClick={toggleRightCanvas}>
				더보기
			</button>
			{/* 왼쪽 패널 (식료품 추가 패널) */}
			<div
				className={`off-canvas left-canvas ${isLeftCanvasOpen ? "open" : ""}`}
			>
				<button className="close-button" onClick={toggleLeftCanvas}>
					닫기
				</button>
				<div className="left-canvas-content">
					{" "}
					{/* 왼쪽 패널 내용 */}
					<h2>식료품 입력하기</h2>
					{/* 카테고리 선택 버튼 */}
					<div className="category-buttons">
						{[
							"채소",
							"과일",
							"고기",
							"수산물",
							"유제품",
							"음료",
							"주류",
							"잡곡",
						].map((category) => (
							<button
								key={category}
								className={`category-button ${
									selectedCategory === category ? "selected" : ""
								}`}
								onClick={() => handleCategorySelect(category)}
							>
								{category}
							</button>
						))}
					</div>
					<div className="selected-category">
						{" "}
						{/* 선택된 카테고리 */}
						{/* Emoji 선택기 추가 */}
						<div className="emoji-picker">
							<h3>아이콘을 선택해주세요!</h3>
							<Picker
								data={data}
								onEmojiSelect={handleEmojiSelect}
								theme="auto"
							/>
						</div>
						{selectedEmoji && (
							<div className="selectedEmoji">
								{selectedEmoji} {/* 선택된 이모지 표시 */}
							</div>
						)}
					</div>
					<div className="input-section">
						<p className="input-prompt">식료품 이름을 적어주세요</p>
						<input
							type="text"
							className="input-field"
							value={foodName}
							onChange={(e) => setFoodName(e.target.value)}
						/>
						<p className="input-prompt">식료품 수량을 적어주세요</p>
						<input
							type="text"
							className="input-field"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
						/>
			        	<p className="input-prompt">식료품의 냉동 여부를 선택해주세요</p>
                        <select className="input-field" value={frozen} onChange={(e) => setFrozen(e.target.value)}>
                            <option value="냉장">냉장</option>
                            <option value="냉동">냉동</option>
                        </select>
						<p className="input-prompt">식료품 유통기한을 적어주세요</p>
						<DatePicker
							selected={expirationDate}
							onChange={(date) => setExpirationDate(date)}
							dateFormat="yyyy/MM/dd"
							className="input-field"
						/>
						{/* 날짜 추가 버튼 */}
						<div className="date-buttons">
							<button onClick={() => addDays(1)}>+1일</button>
							<button onClick={addWeeks}>+1주</button>
							<button onClick={addMonths}>+1달</button>
						</div>
						<div className="save-buttons">
							<button className="save-button" onClick={handleSave}>
								저장
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* 오른쪽 패널 (유통기한 알림 패널) */}
			<div
				className={`off-canvas right-canvas ${isRightCanvasOpen ? "open" : ""}`}
			>
				<button className="close-button" onClick={toggleRightCanvas}>
					닫기
				</button>
				<div className="right-canvas-content">
					{" "}
					{/* 오른쪽 패널 내용 */}
					<h2>유통기한 알림</h2>
					{[1, 2, 3, 4, 5].map((item, index) => (
						<div key={index} className="expiration-item">
							{" "}
							{/* 유통기한이 다가오는 항목 */}
							<div className="icon-placeholder">아이콘</div> {/* 아이콘 자리 */}
							<div className="expiration-details">
								{" "}
								{/* 유통기한 정보 */}
								<p className="expiration-date">남은 유통기한</p>
								<p className="food-name">식료품 이름</p>
							</div>
						</div>
					))}
					{/* 페이지네이션 버튼 */}
					<div className="pagination">
						<button>1</button>
						<button>2</button>
						<button>3</button>
					</div>
					{/* 레시피 링크 */}
					<div className="recipe-links">
						{[1, 2, 3, 4, 5].map((item, index) => (
							<div key={index} className="recipe-item">
								{" "}
								{/* 레시피 항목 */}
								<p className="recipe-link">레시피 링크</p>
								<p className="recipe-name">식료품 이름</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyFridge;
