import React from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/userState";
import useLogout from "../hooks/useLogout";
import "./Header.css";

const Header = ({ onSearch }) => {
	const navigate = useNavigate();
	const location = useLocation(); // 현재 경로 확인
	const user = useRecoilValue(userState);
	const logout = useLogout();

	const handleSearch = (keyword, searchType) => {
		if (!keyword.trim()) {
			alert("검색어를 입력하세요.");
			return;
		}

		if (onSearch) {
			onSearch(keyword.trim(), searchType);
		}

		const targetPath = `/search-results?keyword=${encodeURIComponent(
			keyword
		)}&searchType=${encodeURIComponent(searchType)}`;

		if (searchType === "product") {
			navigate(
				`/product-search?keyword=${encodeURIComponent(
					keyword
				)}&searchType=${encodeURIComponent(searchType)}`
			);
		} else {
			navigate(targetPath);
		}
	};

	return (
		<nav className="header-container">
			{/* 브랜드 로고 */}
			<div className="brand-container" onClick={() => navigate("/")}>
				<span className="brand-title">쿡쿡</span>
			</div>

			{/* 메뉴 */}
			<div className="menu-container">
				<span
					className={`menu-link ${
						location.pathname === "/products" ? "active" : ""
					}`}
					onClick={() => navigate("/products")}
				>
					상품
				</span>
				<span
					className={`menu-link ${
						location.pathname === "/search-results" ? "active" : ""
					}`}
					onClick={() => navigate("/search-results")}
				>
					레시피
				</span>
				<span
					className={`menu-link ${
						location.pathname === "/tips" ? "active" : ""
					}`}
					onClick={() => navigate("/tips")}
				>
					자취팁
				</span>
				<span
					className={`menu-link ${
						location.pathname === "/rank" ? "active" : ""
					}`}
					onClick={() => navigate("/rank")}
				>
					랭킹
				</span>
				<span
					className={`menu-link ${
						location.pathname === "/myfridge" ? "active" : ""
					}`}
					onClick={() => navigate("/myfridge")}
				>
					나만의 냉장고
				</span>
			</div>

			{/* 검색바 */}
			<div className="search-container">
				<SearchBar onSearch={handleSearch} />
			</div>

			{/* 사용자 메뉴 */}
			<div className="user-container">
				{user?.user?.userId ? (
					<>
						<span
							className={`user-link ${
								location.pathname === "/mypage" ? "active" : ""
							}`}
							onClick={() => navigate("/mypage")}
						>
							마이페이지
						</span>
						<span className="user-link" onClick={logout}>
							로그아웃
						</span>
					</>
				) : (
					<span
						className={`user-link ${
							location.pathname === "/login" ? "active" : ""
						}`}
						onClick={() => navigate("/login")}
					>
						로그인/회원가입
					</span>
				)}
			</div>
		</nav>
	);
};

export default Header;
