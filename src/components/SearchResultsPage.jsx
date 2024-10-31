import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SearchBar from './SearchBar';
import RecipeList from './RecipeList';
import '../css/SearchResultsPage.css';
import '../css/RecipeCard.css';
import '../css/RecipeList.css';
import { tips } from '../TipsData.js';

function SearchResultsPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [randomTip, setRandomTip] = useState('');
  const [layout, setLayout] = useState('three-column');
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex].content);

    fetch('/recipes.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            const recipes = results.data.map((recipe) => ({
              id: recipe.RCP_SNO,
              name: recipe.RCP_TTL,
              종류: recipe.CKG_NM,
              재료: recipe.CKG_MTRL_CN,
              RGTR_NM: recipe.RGTR_NM,
              RGTR_ID: recipe.RGTR_ID,
              INQ_CNT: Number(recipe.INQ_CNT),
              RCMM_CNT: Number(recipe.RCMM_CNT)
            }));
            setAllRecipes(recipes);
            setFilteredRecipes(recipes);
          },
        });
      });
  }, []);

  const handleSearch = (keyword, searchType) => {
    const filtered = allRecipes.filter((recipe) =>
      searchType === 'name'
        ? recipe.name.includes(keyword)
        : recipe.재료.includes(keyword)
    );
    setFilteredRecipes(filtered);
  };

  const handleBookmark = (recipe) => {
    setBookmarkedRecipes((prev) =>
      prev.some((r) => r.id === recipe.id)
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const handleLayoutChange = (e) => {
    setLayout(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    let sortedRecipes = [...filteredRecipes];
    if (e.target.value === 'views') {
      sortedRecipes.sort((a, b) => b.INQ_CNT - a.INQ_CNT);
    } else if (e.target.value === 'recommendations') {
      sortedRecipes.sort((a, b) => b.RCMM_CNT - a.RCMM_CNT);
    }
    setFilteredRecipes(sortedRecipes);
  };

  const goSearchRecipe = (category, value) => {
    const filtered = allRecipes.filter(recipe => 
      (category === 'cat4' && recipe.종류.includes(value)) ||
      (category === 'cat3' && recipe.재료.includes(value)) ||
      (category === 'cat1' && recipe.조리법.includes(value))
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand page-title" href="#">검색 결과 페이지</a>
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
              <SearchBar onSearch={handleSearch} />
            </div>

            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button className="nav-link" onClick={() => console.log('나만의 냉장고 클릭')}>
                  나만의 냉장고
                </button>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  더보기
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/tips">자취 꿀팁</a></li>
                  <li><a className="dropdown-item" href="#">요리 팁</a></li>
                  <li><a className="dropdown-item" href="#">최저가 그래프</a></li>
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
{/* 새로운 기능: 종류별, 재료별, 방법별 버튼 */}
<div className="my-3">
        <div className="button-group">
          <h3>종류 별</h3>
          <button onClick={() => goSearchRecipe('cat4', '')}>전체</button>
          <button onClick={() => goSearchRecipe('cat4', '밑반찬')}>밑반찬</button>
          <button onClick={() => goSearchRecipe('cat4', '메인반찬')}>메인반찬</button>
          <button onClick={() => goSearchRecipe('cat4', '국/탕')}>국/탕</button>
          <button onClick={() => goSearchRecipe('cat4', '찌개')}>찌개</button>
          <button onClick={() => goSearchRecipe('cat4', '디저트')}>디저트</button>
        </div>

        <div className="button-group">
          <h3>재료 별</h3>
          <button onClick={() => goSearchRecipe('cat3', '')}>전체</button>
          <button onClick={() => goSearchRecipe('cat3', '소고기')}>소고기</button>
          <button onClick={() => goSearchRecipe('cat3', '돼지고기')}>돼지고기</button>
          <button onClick={() => goSearchRecipe('cat3', '닭고기')}>닭고기</button>
          <button onClick={() => goSearchRecipe('cat3', '채소류')}>채소류</button>
        </div>

        <div className="button-group">
          <h3>요리 방법 별</h3>
          <button onClick={() => goSearchRecipe('cat1', '')}>전체</button>
          <button onClick={() => goSearchRecipe('cat1', '볶음')}>볶음</button>
          <button onClick={() => goSearchRecipe('cat1', '끓이기')}>끓이기</button>
          <button onClick={() => goSearchRecipe('cat1', '부침')}>부침</button>
        </div>
      </div>

      <div className="d-flex justify-content-end align-items-center my-3">
        {/* 조회수/추천수 정렬 드롭다운 */}
        <select className="form-select w-auto me-2" value={sortType} onChange={handleSortChange}>
          <option value="">정렬 기준</option>
          <option value="views">조회수 높은 순</option>
          <option value="recommendations">추천수 높은 순</option>
        </select>

        {/* 찜 목록 드롭다운 */}
        <select className="form-select w-auto me-2" aria-label="찜 목록">
          <option>찜 목록</option>
          {bookmarkedRecipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
          ))}
        </select>

        {/* n열 보기 드롭다운 */}
        <select className="form-select w-auto" value={layout} onChange={handleLayoutChange}>
          <option value="one-column">1열 보기</option>
          <option value="two-column">2열 보기</option>
          <option value="three-column">3열 보기</option>
        </select>
      </div>

      <RecipeList
        recipes={filteredRecipes}
        onBookmark={handleBookmark}
        bookmarkedRecipes={bookmarkedRecipes}
        layout={layout}
      />
      <div className="d-flex justify-content-center align-items-center my-3">
        <div className="tip-box d-flex align-items-center">
          <h5 className="card-text mb-0">{`자취 꿀팁 한 줄! ${randomTip} `}</h5>
          <button
            className="btn btn-outline-secondary btn-sm ms-2" 
            onClick={() => window.location.href='/tips'}
          >
            더보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;
