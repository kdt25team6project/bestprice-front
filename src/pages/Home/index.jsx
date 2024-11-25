import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { tips } from "../../assets/TipsData";
import axios from "axios";
import PreferencesModal from "./PreferencesModal";
import RecipeList from "../Search/RecipeList";
import { Modal, Button } from "react-bootstrap";


import fridgeImage from "../../assets/images/fridge.jpg";
import productImage from "../../assets/images/product.png";
import rankImage from "../../assets/images/rank.jpeg";
import tipImage from "../../assets/images/tip.png";
import recipeImage from "../../assets/images/recipe.png";
import refrigerator from "../../assets/images/refrigerator close.png"
import Product from "../Product";


const Home = () => {
	const navigate = useNavigate();
	const [recipes, setRecipes] = useState({ inq: [], srap: [], rcmm: [] });

	const { user } = useRecoilValue(userState); // Recoil 상태에서 사용자 정보 가져오기
	const [showPreferencesModal, setShowPreferencesModal] = useState(false);

	// 캐러셀 인덱스 상태
	const [index1, setIndex1] = useState(0);
	const [index2, setIndex2] = useState(0);
	const [index3, setIndex3] = useState(0);

	// 랜덤 꿀팁
	const [randomTip, setRandomTip] = useState("");

	// 캐러셀 핸들러
	const handleSelect1 = (selectedIndex) => setIndex1(selectedIndex);
	const handleSelect2 = (selectedIndex) => setIndex2(selectedIndex);
	const handleSelect3 = (selectedIndex) => setIndex3(selectedIndex);

	// 초기 로드 시 랜덤 꿀팁 선택
	useEffect(() => {
		if (tips && tips.length > 0) {
			const randomIndex = Math.floor(Math.random() * tips.length);
			setRandomTip(tips[randomIndex].content); // 무작위로 팁 선택
		}
	}, []);

	// 로그인 후 preference 확인
	useEffect(() => {
		const checkPreferences = async () => {
			if (!user || !user.userId) {
				console.warn("사용자 정보가 없습니다.");
				return;
			}

			try {
				// API 호출로 preference 존재 여부 확인
				const response = await axios.get(
					"http://localhost:8001/api/preferences/check",
					{
						params: { userId: user.userId },
					}
				);

				if (!response.data) {
					// preference가 없으면 모달 띄우기
					setShowPreferencesModal(true);
				}
			} catch (error) {
				console.error("Preference 확인 중 오류 발생:", error);
			}
		};

		checkPreferences();
	}, [user]);

	useEffect(() => {
		fetch("http://localhost:8001/allrecipes")
		  .then((response) => {
			if (!response.ok) {
			  console.error("API 응답 실패:", response.status, response.statusText);
			  throw new Error("네트워크 응답이 좋지 않습니다.");
			}
			return response.json();
		  })
		  .then((data) => {
			console.log("전체 데이터:", data);
	  
			if (!Array.isArray(data)) {
			  throw new Error("API에서 반환된 데이터가 배열 형식이 아닙니다.");
			}
	  
			// 데이터 변환: 속성 이름 변경 및 숫자 변환
			const transformedData = data.map((recipe) => ({
			  id: recipe.rcp_SNO,               // 고유 ID
			  name: recipe.rcp_TTL,             // 레시피 이름
			  종류: recipe.ckg_KND_ACTO_NM,     // 레시피 종류
			  재료: recipe.ckg_MTRL_CN,         // 레시피 재료
			  요리방법: recipe.ckg_MTH_ACTO_NM, // 요리 방법
			  RGTR_NM: recipe.rgtr_NM,          // 작성자 이름
			  RGTR_ID: recipe.rgtr_ID,          // 작성자 ID
			  INQ_CNT: Number(recipe.inq_CNT),  // 조회수 (숫자 변환)
			  RCMM_CNT: Number(recipe.rcmm_CNT),// 추천수 (숫자 변환)
			  CKG_DODF_NM: recipe.ckg_DODF_NM,  // 난이도
			  mainThumb: recipe.image_URL,      // 메인 이미지 URL
			}));
	  
			console.log("변환된 데이터:", transformedData);
	  
			// 정렬 및 상위 3개 데이터 추출
			const byInqCount = [...transformedData]
			  .sort((a, b) => b.INQ_CNT - a.INQ_CNT)
			  .slice(0, 3);
			console.log("조회수 기준 데이터:", byInqCount);
	  
			const bySrapCount = [...transformedData]
			  .sort((a, b) => b.RCMM_CNT - a.RCMM_CNT) // 추천수 기준
			  .slice(0, 3);
			console.log("추천 수 기준 데이터:", bySrapCount);
	  
			const byRcmmCount = [...transformedData]
			  .sort((a, b) => b.RCMM_CNT - a.RCMM_CNT)
			  .slice(0, 3);
			console.log("추천 수 기준 데이터:", byRcmmCount);
	  
			// 상태 업데이트
			setRecipes({
			  inq: byInqCount,
			  srap: bySrapCount,
			  rcmm: byRcmmCount,
			});
		  })
		  .catch((error) => {
			console.error("데이터 가져오기 오류:", error);
		  });
	  }, []);

	// 모달 닫기 핸들러
	const handleClosePreferencesModal = () => {
		setShowPreferencesModal(false);
	};

	///////////////////////////////////////////////////////////////////////////

	// 유통기한 임박 모달 상태
	const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
	const [nearExpiryItems, setNearExpiryItems] = useState([]);

	// 유통기한 임박 식재료 필터링 함수
	const filterNearExpiryItems = (foodItems) => {
		const currentDate = new Date();
		return foodItems.filter((item) => {
			const expirationDate = new Date(item.expiration_date);
			const timeDiff = expirationDate - currentDate;
			const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
			return daysLeft > 0 && daysLeft <= 7;
		});
	};

	// 유통기한 임박 데이터 가져오기
	useEffect(() => {
		const fetchNearExpiryItems = async () => {
			if (!user || !user.userId) {
				console.warn("로그인이 필요합니다.");
				return;
			}

			const modalShownKey = `modalShown_${user.userId}`; // 유저별 상태 저장 키
			const isModalShown = localStorage.getItem(modalShownKey);
	
			// 모달이 이미 표시된 경우, 데이터만 가져오고 모달은 띄우지 않음
			if (isModalShown === "true") {
				return;
			}

			try {
				const response = await axios.get(
					`http://localhost:8001/refrigerator`,
					{
						params: { userId: user.userId },
					}
				);

				const nearExpiryItems = filterNearExpiryItems(response.data);
				if (nearExpiryItems.length > 0) {
					setNearExpiryItems(nearExpiryItems);
					setIsExpiryModalOpen(true); // 모달 열기
				}
			} catch (error) {
				console.error("유통기한 임박 데이터 가져오기 실패:", error);
			}
		};

		fetchNearExpiryItems();
	}, [user]);

	// 모달 닫기 핸들러
	const handleCloseExpiryModal = () => {
		if (user && user.userId) {
			// localStorage에 모달 본 상태 저장
			const modalShownKey = `modalShown_${user.userId}`;
			localStorage.setItem(modalShownKey, "true");
		}
		setIsExpiryModalOpen(false);
	};

	/////////////////////////////////////////////////////////
	

	return (
		<div className="main-content-container">

			{/* 유통기한 임박 모달 */}
			<Modal show={isExpiryModalOpen} onHide={handleCloseExpiryModal} centered>
				<Modal.Header closeButton>
					<Modal.Title>유통기한 임박 재료</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{nearExpiryItems.length > 0 ? (
						nearExpiryItems.map((item, index) => (
							<div key={index} className="near-expiry-item">
								<p><strong>이름:</strong> {item.name}</p>
								<p><strong>남은 일수:</strong> {Math.ceil((new Date(item.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))}일</p>
								<hr></hr>
							</div>
						))
					) : (
						<p>유통기한이 임박한 재료가 없습니다.</p>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseExpiryModal}>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>

			{/* 선호도 모달 */}
			<PreferencesModal
				show={showPreferencesModal}
				onClose={handleClosePreferencesModal}
			/>

			{/* 캐러셀과 나만의 냉장고 */}
			<div className="carousel-fridge-container">
				<div className="carousel-group">
					{/* 상품/레시피 캐러셀 */}
					<div className="carousel-container">
						<Carousel
							activeIndex={index1}
							onSelect={handleSelect1}
							data-bs-theme="dark"
							className="movecarousel"
						>
							<Carousel.Item onClick={() => navigate("/products")}>
								<img
									src={productImage}
									alt="Slide 1"
									className="carousel-image1"
								/>
								<Carousel.Caption style={{ transform: "translateY(-10px)"}}>
									<h3>상품</h3>
									<p>냉장고를 가득 채울 신선한 상품을 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item >
							<Carousel.Item onClick={() => navigate("/search-results")}>
								<img
									src={recipeImage}
									alt="Slide 2"
									className="carousel-image2"
								/>
								<Carousel.Caption style={{ transform: "translateY(-10px)"}}>
									<h3>레시피</h3>
									<p>신선한 재료와 좋은 레시피로 맛있는 요리를 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item onClick={() => navigate("/tips")}>
								<img 
									src={tipImage} 
									alt="Slide 3"
									className="carousel-image3" 	 
								/>
								<Carousel.Caption style={{ transform: "translateY(-10px)"}}>
									<h3>생활 팁</h3>
									<p>살면서 유용한 조언, 팁을 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item onClick={() => navigate("/rank")}>
								<img 
									src={rankImage} 
									alt="Slide 4"
									className="carousel-image4"
								/>
								<Carousel.Caption style={{ transform: "translateY(22px)"}}>
									<h3>랭킹</h3>
									<p>
										가장 사랑을 많이 받은 레시피를 만나보세요!
									</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item onClick={() => navigate("/myfridge")}>
								<img
									src={fridgeImage}
									alt="Slide 5"
									className="carousel-image5"
								/>
								<Carousel.Caption style={{ transform: "translateY(-13px)"}}>
									<h3>나만의 냉장고</h3>
									<p>자신의 냉장고를 관리해 보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
						</Carousel>
			</div>
		{/* 추천 레시피 캐러셀 */}
		<div className="carousel-container">
			<Carousel
				activeIndex={index2}
				onSelect={handleSelect2}
				data-bs-theme="dark"
				className="recipe"
			>
				{/* 조회수 기준 */}
				<Carousel.Item>
				<RecipeList recipes={recipes.inq} />
				</Carousel.Item>

				{/* 스크랩 기준 */}
				<Carousel.Item>
				<RecipeList recipes={recipes.srap} />
				</Carousel.Item>

				{/* 좋아요 기준 */}
				<Carousel.Item>
				<RecipeList recipes={recipes.rcmm} />
				</Carousel.Item>
			</Carousel>
			</div>
		</div>


				{/* 나만의 냉장고 */}
				<div className="my-fridge" onClick={() => navigate("/myfridge")}>
					<h3 className="fridgeh3">나만의 냉장고</h3>
					<img
						src={refrigerator}
						className="fridgediv"
					/>
				</div>
			</div>

			{/* 랜덤 꿀팁 */}
			<div className="d-flex justify-content-center align-items-center my-3">
				<div className="tip-box d-flex align-items-center">
					<h5 className="card-text mb-0">{`자취 꿀팁 한 줄! ${randomTip} `}</h5>
					<button
						className="btn btn-outline-secondary btn-sm ms-2"
						onClick={() => navigate("/tips")}
					>
						더보기
					</button>
				</div>
			</div>

			<div className="productstyle">
				<Product/>
			</div>
		</div>
	);
};

export default Home;
