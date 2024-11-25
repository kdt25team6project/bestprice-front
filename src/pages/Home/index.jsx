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

import fridgeImage from "../../assets/images/fridge.jpg";
import productImage from "../../assets/images/product.png";
import rankImage from "../../assets/images/rank.jpeg";
import tipImage from "../../assets/images/tip.png";
import recipeImage from "../../assets/images/recipe.png";
import refrigerator from "../../assets/images/refrigerator close.png"

const Home = () => {
	const navigate = useNavigate();
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

	// 모달 닫기 핸들러
	const handleClosePreferencesModal = () => {
		setShowPreferencesModal(false);
	};

	return (
		<div className="main-content-container">
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
							<Carousel.Item>
								<img src="/logo192.png" alt="Slide 1" />
								<Carousel.Caption>
									<h3>추천 레시피 첫 번째 슬라이드</h3>
									<p>추천 레시피 슬라이드 설명</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img src="/logo192.png" alt="Slide 2" />
								<Carousel.Caption>
									<h3>추천 레시피 두 번째 슬라이드</h3>
									<p>추천 레시피 슬라이드 설명</p>
								</Carousel.Caption>
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
			<div className="d-flex justify-content-center align-items-center my-3 tip-container">
				<div className="tip-box">
					<h5 className="card-text mb-0">{`생활팁 한 줄! ${randomTip}`}</h5>
					<button
					className="btn btn-outline-secondary btn-sm ms-2"
					onClick={() => navigate("/tips")}
					>
					더보기
					</button>
				</div>
			</div>

			{/* 할인율 캐러셀 */}
			<div className="carousel-container2">
				<Carousel
					activeIndex={index3}
					onSelect={handleSelect3}
					data-bs-theme="dark"
				>
					<Carousel.Item>
						<img src="/logo192.png" alt="Slide 1" />
						<Carousel.Caption>
							<h3>첫 번째 슬라이드</h3>
							<p>슬라이드 설명</p>
						</Carousel.Caption>
					</Carousel.Item>
					<Carousel.Item>
						<img src="/logo192.png" alt="Slide 2" />
						<Carousel.Caption>
							<h3>두 번째 슬라이드</h3>
							<p>슬라이드 설명</p>
						</Carousel.Caption>
					</Carousel.Item>
				</Carousel>
			</div>

			{/* 알뜰한 살림꾼의 맛있는 한끼 */}
			<div className="meal-suggestion">
				<h3>알뜰한 살림꾼의 맛있는 한끼</h3>
				<div className="meal-content">{/* 데이터 추가 영역 */}</div>
			</div>
		</div>
	);
};

export default Home;
