import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ onSearch }) {
	const [keyword, setKeyword] = useState("");
	const [searchType, setSearchType] = useState("name");
	const navigate = useNavigate();

  // 부모 컴퍼넌트로 전달
	const handleSearch = () => {
		onSearch(keyword, searchType); // 검색어와 타입 전달
		if (searchType === "product") {
			navigate("/product-search");
		} else {
			navigate("/search-results");
		}
	};

	return (
		<div className="search-bar">
			<div className="dropdown">
				<button
					className="btn btn-secondary dropdown-toggle"
					type="button"
					id="dropdownMenuButton"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					style={{ width: "100px", height: "50px", margin: "5px" }}
				>
					{searchType === "name" ? "요리 이름" : searchType === "ingredient" ? "재료" : "상품"}
				</button>
				<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<li><button className="dropdown-item" onClick={() => setSearchType("name")}>요리 이름</button></li>
					<li><button className="dropdown-item" onClick={() => setSearchType("ingredient")}>재료</button></li>
					<li><button className="dropdown-item" onClick={() => setSearchType("product")}>상품</button></li>
				</ul>
			</div>

			<input
				type="text"
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
				placeholder={searchType === "name" ? "요리 이름을 입력하세요." : searchType === "ingredient" ? "재료를 입력하세요." : "상품을 입력하세요."}
			/>
			<button type="button" className="btn btn-secondary" onClick={handleSearch}>
				검색
			</button>
		</div>
	);
}

export default SearchBar;
