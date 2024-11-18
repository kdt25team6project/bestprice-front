import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("name"); // 기본 검색 타입은 'name'
  const navigate = useNavigate();

  // 검색 실행
  const handleSearch = () => {
    if (!keyword.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    // 부모 컴포넌트 콜백 호출 (선택 사항)
    if (onSearch) {
      onSearch(keyword.trim(), searchType);
    }

    // 검색 타입에 따라 다른 경로로 이동
    const targetPath =
      searchType === "product"
        ? `/product-search?keyword=${encodeURIComponent(keyword)}&searchType=${encodeURIComponent(searchType)}`
        : `/search-results?keyword=${encodeURIComponent(keyword)}&searchType=${encodeURIComponent(searchType)}`;
    navigate(targetPath);
  };

  // Enter 키로 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색 타입 선택
  const handleSelect = (type) => {
    setSearchType(type);
  };

  return (
    <div className="search-bar">
      {/* 드롭다운 */}
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
          <li>
            <button className="dropdown-item" onClick={() => handleSelect("name")}>
              요리 이름
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => handleSelect("ingredient")}>
              재료
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => handleSelect("product")}>
              상품
            </button>
          </li>
        </ul>
      </div>

      {/* 검색 입력 */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={
          searchType === "name"
            ? "요리 이름을 입력하세요."
            : searchType === "ingredient"
            ? "재료를 입력하세요."
            : "상품을 입력하세요."
        }
        style={{ marginRight: "10px" }}
      />

      {/* 검색 버튼 */}
      <button type="button" className="btn btn-secondary" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
}

export default SearchBar;
