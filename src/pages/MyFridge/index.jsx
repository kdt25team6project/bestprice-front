import React, { useState, useEffect } from 'react';
import "./styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';
import { Modal, Button } from 'react-bootstrap';

const MyFridge = () => {
    // 냉장고 문 상태
    const [isTopDoorOpen, setIsTopDoorOpen] = useState(false);
    const [isBottomDoorOpen, setIsBottomDoorOpen] = useState(false);

    // 좌우 패널 상태
    const [isLeftCanvasOpen, setIsLeftCanvasOpen] = useState(false);
    const [isRightCanvasOpen, setIsRightCanvasOpen] = useState(false);

    // 식료품 입력 및 상태
    const [selectedCategory, setSelectedCategory] = useState('');
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState(new Date());
    const [frozen, setFrozen] = useState('냉장');
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [foodItems, setFoodItems] = useState([]); // 서버에서 가져온 식료품 목록

    // 냉동, 냉장 아이템 구분
    const frozenItems = foodItems.filter(item => item.is_frozen === 1);
    const chilledItems = foodItems.filter(item => item.is_frozen === 0);
    
    // API URL 설정
    const API_URL = 'http://localhost:8001/refrigerator';

    // 데이터 로드 (페이지 최초 렌더링 시 실행)
    useEffect(() => {
        fetchFoodItems();
    }, []);

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

    // 카테고리 선택 함수
    const handleCategorySelect = (category) => {
        if (selectedCategory === category) {
            setSelectedCategory(""); // 같은 버튼 클릭 시 선택 해제
        } else {
            setSelectedCategory(category); // 새로운 카테고리 선택 시 선택 상태로 전환
        }
    };

    // 유통기한 조정 함수
    const addDays = (days) => {
        const newDate = new Date(expirationDate);
        newDate.setDate(newDate.getDate() + days);
        setExpirationDate(newDate);
    };
    const addWeeks = () => addDays(7); // 유통기한 1주일 추가
    const addMonths = () => {
        const newDate = new Date(expirationDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setExpirationDate(newDate);
    };

    // 서버에서 식료품 목록 가져오는 함수
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
        if (!selectedCategory || !foodName || !quantity || !selectedEmoji) {
            console.error('저장 실패: 모든 필드를 채워주세요.');
            alert('저장 실패: 모든 필드를 채워주세요.');
            return;
        }

        const newFoodItem = {
            category: selectedCategory,
            emoji: selectedEmoji,
            name: foodName,
            quantity: parseInt(quantity, 10),
            expiration_date: expirationDate.toISOString().split('T')[0],
            is_frozen: frozen === '냉동' ? 1 : 0,
        };

        try {
            await axios.post(API_URL, newFoodItem);
            console.log('데이터베이스에 저장:', newFoodItem);
            fetchFoodItems();
            resetForm();
        } catch (error) {
            console.error('저장 실패:', error.message);
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

    // 삭제 함수
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`); // ID를 사용해 데이터 삭제
            fetchFoodItems(); // 데이터 새로고침
            handleCloseModal(); // 모달 닫기
        } catch (error) {
            console.error('삭제 실패:', error);
        }
    };
    
    // 페이지네이션 상태
    const [frozenPage, setFrozenPage] = useState(1);
    const [chilledPage, setChilledPage] = useState(1);
    const frozenItemsPerPage = 28;
    const chilledItemsPerPage = 42;

    // 총 페이지 계산
    const totalFrozenPages = Math.ceil(frozenItems.length / frozenItemsPerPage);
    const totalChilledPages = Math.ceil(chilledItems.length / chilledItemsPerPage);

    // 페이지네이션 로직
    const paginate = (items, currentPage, perPage) => {
        const startIndex = (currentPage - 1) * perPage;
        return items.slice(startIndex, startIndex + perPage);
    };

    // 현재 페이지의 냉동/냉장 데이터
    const frozenCurrentItems = paginate(frozenItems, frozenPage, frozenItemsPerPage);
    const chilledCurrentItems = paginate(chilledItems, chilledPage, chilledItemsPerPage);

    // 아이템 분배 로직
    const distributeItemsForPage = (items, limit) => {
        const compartmentItems = items.slice(0, limit);
        const doorItems = items.slice(limit);
        return { compartmentItems, doorItems };
    };

    // 각 페이지의 데이터 분배
    const frozenItemDistribution = distributeItemsForPage(frozenCurrentItems, 12);
    const chilledItemDistribution = distributeItemsForPage(chilledCurrentItems, 18);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    // 모달 열기
    const handleShowModal = (food) => {
        setSelectedFood(food); 
        setShowModal(true); 
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFood(null);
    };

    return (
        <div className="fridge-container">

            <button className="add-button" onClick={() => setIsLeftCanvasOpen(!isLeftCanvasOpen)}>추가하기</button>

            <div className="fridge">
                <div className="fridge-body">
                    {/* 상단 냉장고 문 (냉동) */}
                    <div className={`fridge-door fridge-door-top ${isTopDoorOpen ? "door-open" : ""}`}
                         onClick={toggleTopDoor}>
                        {!isTopDoorOpen && <div className="door-handle door-handle-top"></div>}
                        {isTopDoorOpen && (
                            <div className="fridge-compartment-door fridge-compartment-door-top">
                                {frozenItemDistribution.doorItems.map((item, index) => (
                                    <div key={index} className="food-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowModal(item);
                                    }}
                                >
                                        <span className="food-emoji">{item.emoji}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* 상단 냉장고 칸 (냉동) */}
                    <div className={`fridge-compartment fridge-compartment-top ${isTopDoorOpen ? "visible" : ""}`}>
                        {frozenItemDistribution.compartmentItems.map((item, index) => (
                            <div key={index} className="food-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(item);
                            }}
                        >
                                <span className="food-emoji">{item.emoji}</span>
                            </div>
                        ))}
                    </div>


                    {/* 하단 냉장고 문 (냉장) */}
                    <div className={`fridge-door fridge-door-bottom ${isBottomDoorOpen ? "door-open" : ""}`}
                         onClick={toggleBottomDoor}>                        
                        {!isBottomDoorOpen && <div className="door-handle door-handle-bottom"></div>}
                        {isBottomDoorOpen && (
                            <div className="fridge-compartment-door fridge-compartment-door-bottom">
                                {chilledItemDistribution.doorItems.map((item, index) => (
                                    <div key={index} className="food-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowModal(item);
                                    }}
                                >
                                        <span className="food-emoji">{item.emoji}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* 하단 냉장고 칸 (냉장) */}
                    <div className={`fridge-compartment fridge-compartment-bottom ${isBottomDoorOpen ? "visible" : ""}`}>
                        {chilledItemDistribution.compartmentItems.map((item, index) => (
                            <div key={index} className="food-item" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowModal(item);
                                }}
                            >
                                <span className="food-emoji">{item.emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 냉동 페이지네이션 */}
            {isTopDoorOpen && (
            <div className="pagination-frozen-left">
                <Pagination>
                    {[...Array(totalFrozenPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === frozenPage}
                            onClick={() => setFrozenPage(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            )}

            {/* 냉장 페이지네이션 */}
            {isBottomDoorOpen && (
            <div className="pagination-chilled-left">
                <Pagination>
                    {[...Array(totalChilledPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === chilledPage}
                            onClick={() => setChilledPage(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            )}

            <Modal show={showModal} onHide={handleCloseModal} centered >
                <Modal.Header closeButton>
                    <Modal.Title>식품 정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFood && (
                        <div>
                            <div style={{ textAlign: 'center', fontSize: '2rem' }}>{selectedFood.emoji}</div>
                            <p><strong>이름:</strong> {selectedFood.name}</p>
                            <p><strong>수량:</strong> {selectedFood.quantity}</p>
                            <p><strong>냉장/냉동:</strong> {selectedFood.is_frozen ? '냉동' : '냉장'}</p>
                            <p><strong>유통기한:</strong> {selectedFood.expiration_date}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete(selectedFood.refrigerator)}>
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>

            <button className="more-button" onClick={toggleRightCanvas}>더보기</button>

            {/* 왼쪽 패널 (식료품 추가 패널) */}
            <div className={`off-canvas left-canvas ${isLeftCanvasOpen ? "open" : ""}`}>
                <button className="close-button" onClick={toggleLeftCanvas}>닫기</button>
                <div className="left-canvas-content">
                    <h2>식료품 입력하기</h2>

                    {/* 카테고리 선택 버튼 */}
                    <div className="category-buttons">
                        {["채소", "과일", "고기", "수산물", "유제품", "음료", "주류", "기타"].map((category) => (
                            <button
                                key={category}
                                className={`category-button ${selectedCategory === category ? "selected" : ""}`}
                                onClick={() => handleCategorySelect(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* 이모티콘 선택 */}
                    <div className="emoji-picker">
                        <h3>아이콘을 선택해주세요!</h3>
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="auto" />
                    </div>
                    {selectedEmoji && <div className="selectedEmoji">{selectedEmoji}</div>}

                    {/* 입력 필드 섹션 */}
                    <div className="input-section">
                        <p className="input-prompt">식료품 이름을 적어주세요</p>
                        <input type="text" className="input-field" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
                        
                        <p className="input-prompt">식료품 수량을 적어주세요</p>
                        <input type="text" className="input-field" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        
                        <p className="input-prompt">식료품의 냉동 여부를 선택해주세요</p>
                        <select className="input-field" value={frozen} onChange={(e) => setFrozen(e.target.value)}>
                            <option value="냉장">냉장</option>
                            <option value="냉동">냉동</option>
                        </select>

                        <p className="input-prompt">식료품 유통기한을 적어주세요</p>
                        <DatePicker selected={expirationDate} onChange={(date) => setExpirationDate(date)} dateFormat="yyyy/MM/dd" className="input-field" />

                        {/* 날짜 추가 버튼 */}
                        <div className="date-buttons">
                            <button onClick={() => addDays(1)}>+1일</button>
                            <button onClick={addWeeks}>+1주</button>
                            <button onClick={addMonths}>+1달</button>
                        </div>

                        <div className="save-buttons">
                            <button className="save-button" onClick={handleSave}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 오른쪽 패널 (유통기한 알림 패널) */}
            <div className={`off-canvas right-canvas ${isRightCanvasOpen ? "open" : ""}`}>
                <button className="close-button" onClick={toggleRightCanvas}>닫기</button>
                <div className="right-canvas-content">
                    <h2>유통기한 알림</h2>
                    {foodItems.slice(0, 5).map((item, index) => (
                        <div key={index} className="expiration-item">
                            <div className="icon-placeholder">{item.emoji}</div>
                            <div className="expiration-details">
                                <p className="expiration-date">유통기한: {item.expirationDate}</p>
                                <p className="food-name">{item.name}</p>
                            </div>
                        </div>
                    ))}
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
