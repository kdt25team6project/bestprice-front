import React from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ onSearch }) => {
	const navigate = useNavigate();

	// 검색어와 검색 타입 업데이트
	const handleSearch = (keyword, searchType) => {
		onSearch(keyword); // 검색어 업데이트
		navigate(searchType === "product" ? "/product-search" : "/search-results"); // 검색타입업데이트
	};

	// 로그인 여부 확인
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

	// 마이페이지 버튼 클릭 시 동작
	const handleMyPageClick = () => {
		if (isLoggedIn) {
			navigate("/mypage"); // 로그인 되어있으면 마이페이지로 이동
		} else {
			navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
		}
	};

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand page-title" href="/">
					🍽️Best Price🍽️
				</a>
				<div className="mx-auto">
					<SearchBar onSearch={handleSearch} />
				</div>
				<div className="login-container">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							{/* 마이페이지 버튼 */}
							<button
								className="nav-link my-page-button"
								onClick={handleMyPageClick}
							>
								마이페이지
							</button>
						</li>
						<li className="nav-item">
							<button
								className="nav-link login-button"
								onClick={() => navigate("/login")}
							>
								로그인/회원가입
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="container-fluid mt-3 button-group">
				<button className="nav-button" onClick={() => navigate("/products")}>
					상품
				</button>

				<button className="nav-button" onClick={() => navigate("/")}>
					레시피
				</button>

				<button className="nav-button" onClick={() => navigate("/tips")}>
					자취팁
				</button>

				<button className="nav-button" onClick={() => navigate("/rank")}>
					랭킹
				</button>

				<button className="nav-button" onClick={() => navigate("/myfridge")}>
					나만의 냉장고
				</button>
			</div>
		</nav>
	);
};

export default Header;
