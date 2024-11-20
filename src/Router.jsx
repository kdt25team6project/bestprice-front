import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "./state/userState";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import MyFridge from "./pages/MyFridge";
import Ranking from "./pages/Ranking";
import TipsPage from "./pages/Tip";
import SearchResultsPage from "./pages/Search";
import RecipeDetailPage from "./pages/Recipe";
import ProductPage from "./pages/Product";
import ProductSearchPage from "./pages/Search/ProductSearchPage";

const Router = () => {
	const [searchKeyword, setSearchKeyword] = useState(""); // 검색 상태
	const setUser = useSetRecoilState(userState); // Recoil 상태 업데이트

	// 앱 초기화 시 로그인 상태를 로컬 스토리지에서 로드
	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userLocal"));
		if (userInfo) {
			setUser({ user: userInfo });
		}
	}, [setUser]);
	

	// 검색어 상태 업데이트 함수
	const handleSearch = (keyword) => {
		setSearchKeyword(keyword);
	};

	return (
		<BrowserRouter>
			<Container>
				{/* Header에 검색 상태 관리 함수를 전달 */}
				<Header onSearch={handleSearch} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/mypage" element={<MyPage />} />
					<Route path="/myfridge" element={<MyFridge />} />
					<Route path="/rank" element={<Ranking />} />
					<Route path="/tips" element={<TipsPage />} />
					<Route path="/search-results" element={<SearchResultsPage />} />
					<Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
					<Route path="/products" element={<ProductPage />} />
					<Route
						path="/product-search"
						element={<ProductSearchPage keyword={searchKeyword} />}
					/>
				</Routes>
				<Footer />
			</Container>
		</BrowserRouter>
	);
};

export default Router;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	background-color: #f9f9f9;
`;
