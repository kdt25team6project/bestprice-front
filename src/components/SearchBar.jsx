import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
	const [keyword, setKeyword] = useState("");
	const [searchType, setSearchType] = useState("name"); // 기본 검색 타입
	const navigate = useNavigate();

	// 검색 실행
	const handleSearch = () => {
		if (!keyword.trim()) {
			alert("검색어를 입력하세요.");
			return;
		}

		if (onSearch) {
			onSearch(keyword.trim(), searchType);
		}

		const targetPath =
			searchType === "product"
				? `/product-search?keyword=${encodeURIComponent(
						keyword
				  )}&searchType=${encodeURIComponent(searchType)}`
				: `/search-results?keyword=${encodeURIComponent(
						keyword
				  )}&searchType=${encodeURIComponent(searchType)}`;
		navigate(targetPath);
	};

	// 드롭다운 선택
	const handleSelect = (type) => {
		setSearchType(type);
	};

	// Enter 키로 검색 실행
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="custom-search-bar">
			<div className="dropdown">
				<button className="dropdown-button" type="button">
					{searchType === "name"
						? "요리 이름"
						: searchType === "ingredient"
						? "재료"
						: "상품"}
					<span className="dropdown-arrow">▼</span>
				</button>
				<ul className="dropdown-menu">
					<li onClick={() => handleSelect("name")}>요리 이름</li>
					<li onClick={() => handleSelect("ingredient")}>재료</li>
					<li onClick={() => handleSelect("product")}>상품</li>
				</ul>
			</div>

			<input
				type="text"
				className="search-input"
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
				onKeyPress={handleKeyPress}
				placeholder="검색어를 입력하세요."
			/>

			{/* 검색 버튼으로 SVG 사용 */}
			<svg
				className="search-icon"
				onClick={handleSearch}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="20"
				height="20"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={{ cursor: "pointer" }}
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
		</div>
	);
}

export default SearchBar;
