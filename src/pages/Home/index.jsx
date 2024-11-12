import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import { useNavigate } from 'react-router';
import { tips } from '../../assets/TipsData';

import fridgeImage from "../../assets/images/fridge.jpg";
import productImage from "../../assets/images/product.png";
import rankImage from "../../assets/images/rank.jpeg";
import tipImage from "../../assets/images/tip.png";
import recipeImage from "../../assets/images/recipe.png";

const Home = () => {

	const navigate = useNavigate();

	const [index1, setIndex1] = useState(0);
	const [index2, setIndex2] = useState(0);
	const [index3, setIndex3] = useState(0);
	const [randomTip, setRandomTip] = useState('');

	const handleSelect1 = (selectedIndex) => setIndex1(selectedIndex);
	const handleSelect2 = (selectedIndex) => setIndex2(selectedIndex);
	const handleSelect3 = (selectedIndex) => setIndex3(selectedIndex);

	useEffect(() => {
		if (tips && tips.length > 0) {
		  const randomIndex = Math.floor(Math.random() * tips.length);
		  setRandomTip(tips[randomIndex].content); // 무작위로 팁 선택
		}
	}, []);

	return (
		<div className="main-content-container">
			{/* 캐러셀과 나만의 냉장고를 가로로 배치 */}
			<div className="carousel-fridge-container">
				{/* 추천 레시피와 상품/레시피 캐러셀을 세로로 배치한 부모 div */}
				<div className="carousel-group">
					{/* 상품/레시피 캐러셀 */}
					<div className="carousel-container">
						<Carousel
							activeIndex={index1}
							onSelect={handleSelect1}
							data-bs-theme="dark"
							className="movecarousel"
						>
							<Carousel.Item>
								<img
									src={productImage}
									alt="Slide 1"
									className="carousel-image"
								/>
								<Carousel.Caption>
									<h3>상품</h3>
									<p>냉장고를 가득 채울 신선한 상품을 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img
									src={recipeImage}
									alt="Slide 2"
									className="carousel-image"
								/>
								<Carousel.Caption>
									<h3>레시피</h3>
									<p>신선한 재료와 좋은 레시피로 맛있는 요리를 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img src={tipImage} alt="Slide 3" className="carousel-image" />
								<Carousel.Caption>
									<h3>생활 팁</h3>
									<p>살면서 유용한 조언, 팁을 만나보세요!</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img src={rankImage} alt="Slide 4" className="carousel-image" />
								<Carousel.Caption>
									<h3>랭킹</h3>
									<p>
										어떤 레시피가 많은사람들에게 맛있는 요리를 선물했을까요?
									</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img
									src={fridgeImage}
									alt="Slide 5"
									className="carousel-image"
								/>
								<Carousel.Caption>
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
				<div className="my-fridge">나만의 냉장고</div>
			</div>

			{/* 자취팁 일반 div */}
			<div className="living-tips">
				<p>자취팁 관련 내용</p>
			</div>

			<div className="d-flex justify-content-center align-items-center my-3">
				<div className="tip-box d-flex align-items-center">
					<h5 className="card-text mb-0">{`자취 꿀팁 한 줄! ${randomTip} `}</h5>
					<button
						className="btn btn-outline-secondary btn-sm ms-2"
						onClick={() => navigate('/tips')}
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
				<div className="meal-content"> {/* 데이터 추가를 위한 영역 */}</div>
			</div>
		</div>
	);
};

export default Home;
