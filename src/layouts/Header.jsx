import React from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../state/userState";
import "./Header.css";

const Header = ({ onSearch }) => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userState); // 로그인 상태 구독

	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn"); // 로컬 스토리지에서 상태 제거
		setUser({ isLoggedIn: false, user: null }); // Recoil 상태 초기화
		navigate("/"); // 홈으로 이동
	};

	const handleSearch = (keyword, searchType) => {
		onSearch(keyword);
		navigate(searchType === "product" ? "/product-search" : "/search-results");
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
						{user.isLoggedIn ? (
							<>
								{/* 마이페이지 버튼 */}
								<li className="nav-item">
									<button
										className="nav-link my-page-button"
										onClick={() => navigate("/mypage")}
									>
										마이페이지
									</button>
								</li>
								{/* 로그아웃 버튼 */}
								<li className="nav-item">
									<button
										className="nav-link login-button"
										onClick={handleLogout}
									>
										로그아웃
									</button>
								</li>
							</>
						) : (
							<li className="nav-item">
								<button
									className="nav-link login-button"
									onClick={() => navigate("/login")}
								>
									로그인/회원가입
								</button>
							</li>
						)}
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
