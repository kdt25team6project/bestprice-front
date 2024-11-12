import React from 'react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router';
import "./Header.css";

const Header = ({ onSearch }) => {

	const navigate = useNavigate();

	const handleSearch = (keyword, searchType) => {
        // 검색어와 검색 타입을 쿼리 파라미터로 전달
        navigate(`/search-results?keyword=${keyword}&searchType=${searchType}`);
    };


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand page-title" href="/">🍽️Best Price🍽️</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <div className="mx-auto">
						<SearchBar onSearch={handleSearch} /> {/* SearchBar에 handleSearch 전달 */}
                    </div>

                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigate('/myfridge')}>
                                나만의 냉장고
                            </button>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                더보기
                            </a>
                            <ul className="dropdown-menu">
								<li><a className="dropdown-item" href="#">상품</a></li>
								<li><a className="dropdown-item" href="#">레시피</a></li>
                                <li><a className="dropdown-item" href="/tips">자취 꿀팁</a></li>
                                <li><a className="dropdown-item" href="#">랭킹</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => console.log('로그인/회원가입 클릭')}>
                                로그인/회원가입
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
