import React from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/userState";
import useLogout from "../hooks/useLogout";
import "./Header.css";

const Header = ({ onSearch }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userState); // Recoil 상태 읽기
	const logout = useLogout(); // useLogout 훅 사용

	const handleSearch = (keyword, searchType) => {
		if (!keyword.trim()) {
			alert("검색어를 입력하세요.");
			return;
		}

		// 부모 컴포넌트 콜백 호출
		if (onSearch) {
			onSearch(keyword.trim(), searchType);
		}

		// 경로 설정
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
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand page-title" href="/">
					🍽️Cook Cook🍽️
				</a>
				<div className="mx-auto">
					<SearchBar onSearch={handleSearch} />
				</div>
				<div className="login-container">
					<ul className="navbar-nav ms-auto">
						{user?.user?.userId ? ( // userId 존재 여부로 확인
							<>
								<li className="nav-item">
									<button
										className="nav-link my-page-button"
										onClick={() => navigate("/mypage")}
									>
										마이페이지
									</button>
								</li>
								<li className="nav-item">
									<button
										className="nav-link login-button"
										onClick={logout}
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
				<button
					className="nav-button"
					onClick={() => navigate("/search-results")}
				>
					레시피
				</button>
				<button className="nav-button" onClick={() => navigate("/tips")}>
					생활팁
				</button>
				<button className="nav-button" onClick={() => navigate("/rank")}>
					레시피 랭킹
				</button>
				<button className="nav-button" onClick={() => navigate("/myfridge")}>
					나만의 냉장고
				</button>
			</div>
		</nav>
	);
};

export default Header;
