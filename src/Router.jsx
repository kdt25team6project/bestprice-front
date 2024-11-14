import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import MyFridge from "./pages/MyFridge";
import Ranking from "./pages/Ranking";
import TipsPage from "./pages/Tip";
import SearchResultsPage from "./pages/Search";
import RecipeDetailPage from "./pages/Recipe/RecipeDetail";
import ProductPage from "./pages/Product/ProductPage";
import ProductSearchPage from "./pages/Search/ProductSearchPage";
import styled from "styled-components";
import { useState } from "react";

const Router = () => {
	// 검색어를 저장하는 상태를 정의하여 SearchBar와 ProductSearchPage에서 공유
	const [searchKeyword, setSearchKeyword] = useState("");

	// 검색어가 입력되면 이 함수가 호출되어 검색어 상태를 업데이트함
	const handleSearch = (keyword) => {
		setSearchKeyword(keyword);
	};

	return (
		<BrowserRouter>
			<Container>
				{/* Header에 handleSearch 함수를 전달하여 검색 시 검색어를 설정 */}
				<Header onSearch={handleSearch} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/myfridge" element={<MyFridge />} />
					<Route path="/rank" element={<Ranking />} />
					<Route path="/tips" element={<TipsPage />} />
					<Route path="/search-results" element={<SearchResultsPage />} />
					<Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
					<Route path="/products" element={<ProductPage />} />
					<Route path="/product-search" element={<ProductSearchPage keyword={searchKeyword} />} />
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
