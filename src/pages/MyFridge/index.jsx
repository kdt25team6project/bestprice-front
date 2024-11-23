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
import { userState } from '../../state/userState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';


const MyFridge = () => {
    const navigate = useNavigate();

    // 로그인 여부 판별
    const { user } = useRecoilValue(userState);
    const isLoggedIn = user && user.userId ? true : false;
    const userId = user?.userId;

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

    const setUser = useSetRecoilState(userState);

    useEffect(() => {
        const storedUser = localStorage.getItem("userLocal");
        if (storedUser) {
            setUser({
                isLoggedIn: true,
                user: JSON.parse(storedUser).user, // 사용자 데이터 복원
            });
        }
    }, [setUser]);

    // 데이터 로드 (페이지 최초 렌더링 시 실행)
    useEffect(() => {
        fetchFoodItems();
    }, [userId]);

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
        if (!userId) {
            console.log("userId가 없습니다.");
            return;
        }
        try {
            const response = await axios.get(`${API_URL}?userId=${userId}`);
            console.log(userId);
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

        if (!userId) {
            console.error("userId가 없습니다. 로그인이 필요합니다.");
            alert("로그인이 필요합니다.");
            return;
        }

        const newFoodItem = {
            userId,
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
    
    // 냉장고 페이지네이션 상태
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

    // 유통기한 알림 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const maxPageButtons = 5;

    // 현재 날짜 가져오기
    const currentDate = new Date();

    // 유통기한 남은 일수 계산
    const calculateDaysLeft = (expirationDate) => {
        const expDate = new Date(expirationDate);
        const timeDiff = expDate - currentDate;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초 -> 일
    };

    // 남은 일수 기준으로 정렬
    const sortedFoodItems = [...foodItems].sort((a, b) => {
        const daysLeftA = calculateDaysLeft(a.expiration_date);
        const daysLeftB = calculateDaysLeft(b.expiration_date);
        return daysLeftA - daysLeftB;
    });

    // 페이지네이션을 위한 데이터 분리
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedFoodItems.slice(startIndex, startIndex + itemsPerPage);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(sortedFoodItems.length / itemsPerPage);

    // 현재 페이지네이션의 시작, 끝 계산
    const paginationStart = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const paginationEnd = Math.min(totalPages, paginationStart + maxPageButtons - 1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

//////////////////////////////////////////////////////////////////////////////////////////////////

    // 레시피 데이터 상태 관리
    const [recipe, setRecipes] = useState([]);
    // 유통기한 기준 상위 5개 항목 추출
    const topFiveItems = sortedFoodItems.slice(0, 5);
    const [ingredientName, setIngredientName] = useState([]);

    const fetchRecipesByIngredients = async () => {
        try {
            // 냉장고에 저장된 식료품 이름 추출
            const ingredientName = topFiveItems.map((item) => item.name);
            setIngredientName(ingredientName);

            const queryString = ingredientName
                .map(name => `ingredients=${encodeURIComponent(name)}`)
                .join('&');

            // 백엔드로 GET 요청을 보냄
            const response = await axios.get(
                `http://localhost:8001/api/recipe/search?${queryString}`
            );
            
            console.log("Fetched Recipes:", response.data);
            setRecipes(response.data);
        } catch (error) {
            console.error("Failed to fetch recipes:", error.message); // 에러 메시지 출력
        }
    };

    const handleRecipeClick = (recipeItem) => {
        // 클릭 시 레시피 상세 페이지로 이동
        navigate(`/recipe/${recipeItem.rcp_SNO}`, { state: { recipeItem } });
    };
    

    // 식료품 목록(foodItems)이 변경될 때 레시피를 가져옴
    useEffect(() => {
        if (foodItems && foodItems.length > 0) {
            fetchRecipesByIngredients();
        }
    }, [foodItems]);

    

    

///////////////////////////////////////////////////////////////////////////////////////////////

    return (
        
        <div className="fridge-container">
        {/* 로그인되지 않은 경우: 흐린 배경과 메시지 */}
        {(!user || !user.userId) && (
                <div className="overlay">
                    <div className="overlay-message">
                        <h2>로그인 해주세요</h2>
                    </div>
                </div>
            )}

            {/* 냉장고 UI */}
            <div className={`fridge-content ${!isLoggedIn ? "blurred" : ""}`}>

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
                        {/* 이전 버튼 */}
                        <Pagination.Prev
                            disabled={frozenPage === 1}
                            onClick={() => setFrozenPage(frozenPage - 1)}
                        />

                        {/* 페이지 번호 */}
                        {Array.from({ length: Math.min(totalFrozenPages, 5) }, (_, index) => {
                            const startPage = Math.max(1, frozenPage - 2); // 시작 페이지 계산
                            const page = startPage + index;
                            if (page > totalFrozenPages) return null; // 페이지가 총 페이지를 넘으면 렌더링 안함
                            return (
                                <Pagination.Item
                                    key={page}
                                    active={page === frozenPage}
                                    onClick={() => setFrozenPage(page)}
                                >
                                    {page}
                                </Pagination.Item>
                            );
                        })}

                        {/* 다음 버튼 */}
                        <Pagination.Next
                            disabled={frozenPage === totalFrozenPages}
                            onClick={() => setFrozenPage(frozenPage + 1)}
                        />
                    </Pagination>
                </div>
            )}

            {/* 냉장 페이지네이션 */}
            {isBottomDoorOpen && (
                <div className="pagination-chilled-left">
                    <Pagination>
                        {/* 이전 버튼 */}
                        <Pagination.Prev
                            disabled={chilledPage === 1}
                            onClick={() => setChilledPage(chilledPage - 1)}
                        />

                        {/* 페이지 번호 */}
                        {Array.from({ length: Math.min(totalChilledPages, 5) }, (_, index) => {
                            const startPage = Math.max(1, chilledPage - 2); // 시작 페이지 계산
                            const page = startPage + index;
                            if (page > totalChilledPages) return null; // 페이지가 총 페이지를 넘으면 렌더링 안함
                            return (
                                <Pagination.Item
                                    key={page}
                                    active={page === chilledPage}
                                    onClick={() => setChilledPage(page)}
                                >
                                    {page}
                                </Pagination.Item>
                            );
                        })}

                        {/* 다음 버튼 */}
                        <Pagination.Next
                            disabled={chilledPage === totalChilledPages}
                            onClick={() => setChilledPage(chilledPage + 1)}
                        />
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
			<div className={`off-canvas right-canvas ${isRightCanvasOpen ? "open" : ""}`}>
				<button className="close-button" onClick={toggleRightCanvas}>
					닫기
				</button>

				<div className="right-canvas-content">
					{" "}
					{/* 오른쪽 패널 내용 */}
					<h2>유통기한 알림</h2>
					{/* 유통기한이 다가오는 항목 표시 */}
                    {currentItems.map((item, index) => {
                        const daysLeft = calculateDaysLeft(item.expiration_date);
                        return (
                            <div key={index} className="expiration-item"
                                 onClick={(e) => { e.stopPropagation(); handleShowModal(item);}}>
                                <div className="food-emoji">{item.emoji}</div> {/* 아이콘 */}
                                <div className="expiration-details">
                                    <p className="expiration-date">남은 일수: {daysLeft}일</p>
                                    <p className="food-name">{item.name}</p>
                                </div>
                            </div>
                        );
                    })}

                    {/* 페이지네이션 */}
                <div className="pagination">
                    <Pagination>
                        {/* 이전 버튼 */}
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />

                        {/* 페이지 버튼 */}
                        {Array.from(
                            { length: paginationEnd - paginationStart + 1 },
                            (_, index) => paginationStart + index
                        ).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        {/* 다음 버튼 */}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
                </div>

				{/* 레시피 링크 */}
                <div className="recipe-links">
                <h3>유통기한 임박 재료 레시피</h3>
                <h7>해당 레시피는 랜덤으로 표시 됩니다!</h7>
                {recipe.slice(0, 5).map((recipeItem, index) => (
                    <div key={index} className="recipe-item"
                         onClick={() => handleRecipeClick(recipeItem)}>
                        <p className="recipe-name">식재료 : {ingredientName[index]}</p>
                        <p className="recipe-title">{recipeItem?.rcp_TTL || "레시피 없음"}</p>
                    </div>
                    ))}
                    </div>
				</div>
			</div>
		</div>
        </div>
	);
}

export default MyFridge;
