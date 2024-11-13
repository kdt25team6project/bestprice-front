import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import MyFridge from "./pages/MyFridge";
import Ranking from "./pages/Ranking";
import TipsPage from "./pages/Tip";
import SearchResultsPage from "./pages/Search";
import RecipeDetailPage from "./pages/Recipe/RecipeDetailPage";
import ProductPage from "./pages/Product/ProductPage";
import ProductSearchPage from "./pages/Search/ProductSearchPage";
import styled from "styled-components";

const Router = () => {
	return (
		<BrowserRouter>
			<Container>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/myfridge" element={<MyFridge />} />
					<Route path="/rank" element={<Ranking />} />
					<Route path="/tips" element={<TipsPage />} />
					<Route path="/search-results" element={<SearchResultsPage />} />
					<Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
					<Route path="/products" element={<ProductPage />} />
					<Route path="/product-search" element={<ProductSearchPage />} />
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
