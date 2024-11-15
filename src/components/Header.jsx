import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

function Header({ handleSearch }) {
  const navigate = useNavigate();

  // 로그인 여부 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 마이페이지 버튼 클릭 시 동작
  const handleMyPageClick = () => {
    if (isLoggedIn) {
      navigate('/mypage'); // 로그인 되어있으면 마이페이지로 이동
    } else {
      navigate('/login'); // 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand page-title" href="/">🍽️Best Price🍽️</a>
        <div className="mx-auto">
          {/* 검색창 */}
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
                onClick={() => navigate('/login')}
              >
                로그인/회원가입
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-fluid mt-3 button-group">
        <button className="nav-button" onClick={() => navigate('/')}>
          상품
        </button>

        <button className="nav-button" onClick={() => navigate('/')}>
          레시피
        </button>

        <button className="nav-button" onClick={() => navigate('/tips')}>
          자취팁
        </button>

        <button className="nav-button" onClick={() => navigate('/rank')}>
          랭킹
        </button>

        <button className="nav-button" onClick={() => navigate('/fridge')}>
          나만의 냉장고
        </button>
      </div>
    </nav>
  );
}

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('name');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(keyword, searchType);
    }
  };

  const handleSearch = () => {
    onSearch(keyword, searchType);
  };

  const handleSelect = (type) => {
    setSearchType(type);
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
        >
          {searchType === 'name' ? '요리 이름' : '재료'}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <button className="dropdown-item" onClick={() => handleSelect('name')}>
              요리 이름
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => handleSelect('ingredient')}>
              재료
            </button>
          </li>
        </ul>
      </div>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={searchType === 'name' ? '요리 이름을 입력하세요.' : '재료를 입력하세요.'}
        className="search-input"
      />
      <button type="button" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
}

export default Header;