import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Header from './Header';
import RecipeList from './RecipeList';
import Footer from './Footer';
import '../css/SearchResultsPage.css';
import '../css/RecipeCard.css';
import '../css/RecipeList.css';
import '../css/Header.css';
import { tips } from '../TipsData.js';

function SearchResultsPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [randomTip, setRandomTip] = useState('');
  const [layout, setLayout] = useState('three-column');
  const [sortType, setSortType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  let recipesPerPage;
  
  if (layout === 'two-column') {
    recipesPerPage = 6; // 2열 보기일 때 최대 6개
  } else if (layout === 'three-column') {
    recipesPerPage = 9; // 3열 보기일 때 최대 9개 (기본값)
  } else if (layout === 'five-column') {
    recipesPerPage = 20; // 5열 보기일 때 최대 20개
  }

  useEffect(() => {
    if (tips && tips.length > 0) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setRandomTip(tips[randomIndex].content);
    }
  }, []);

  useEffect(() => {
    fetch('/recipes.csv')
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            const recipes = results.data.map((recipe) => ({
              id: recipe.RCP_SNO,
              name: recipe.RCP_TTL,
              종류: recipe.CKG_KND_ACTO_NM,
              재료: recipe.CKG_MTRL_CN,
              요리방법: recipe.CKG_MTH_ACTO_NM,
              RGTR_NM: recipe.RGTR_NM,
              RGTR_ID: recipe.RGTR_ID,
              INQ_CNT: Number(recipe.INQ_CNT),
              RCMM_CNT: Number(recipe.RCMM_CNT),
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
    setCurrentPage(1);
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
      sortedRecipes.sort((a, b) => b.INQ_CNT - a.INQ_CNT); // 조회수 높은 순
    } else if (e.target.value === 'recommendations') {
      sortedRecipes.sort((a, b) => b.RCMM_CNT - a.RCMM_CNT); // 추천수 높은 순
    } else if (e.target.value === 'difficulty') {
      const difficultyMap = { '아무나': 1, '초급': 2, '중급': 3, '고급': 4 };
      sortedRecipes.sort((a, b) => difficultyMap[a.CKG_DODF_NM] - difficultyMap[b.CKG_DODF_NM]); // 난이도 쉬운 순
    } else if (e.target.value === 'newest') {
      sortedRecipes.sort((a, b) => new Date(b.RGTR_ID) - new Date(a.RGTR_ID)); // 최신순
    }

    setFilteredRecipes(sortedRecipes);
  };

  const goSearchRecipe = (category, value) => {
    const filtered = allRecipes.filter(recipe =>
      (category === 'cat4' && (value === '' || recipe.종류?.includes(value))) ||
      (category === 'cat3' && (value === '' || recipe.재료?.includes(value))) ||
      (category === 'cat1' && (value === '' || recipe.요리방법?.includes(value)))
    );
    setFilteredRecipes(filtered);
    setCurrentPage(1);
  };

  // 페이지네이션 관련
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="container">
      <Header handleSearch={handleSearch} />

      <div className={`filter-container ${isFilterVisible ? 'show' : ''}`}>
          <div className="button-group">
            <h3>종류 별</h3>
    <button onClick={() => goSearchRecipe('cat4', '')}>전체</button>
    <button onClick={() => goSearchRecipe('cat4', '밑반찬')}>밑반찬</button>
    <button onClick={() => goSearchRecipe('cat4', '메인반찬')}>메인반찬</button>
    <button onClick={() => goSearchRecipe('cat4', '국/탕')}>국/탕</button>
    <button onClick={() => goSearchRecipe('cat4', '찌개')}>찌개</button>
    <button onClick={() => goSearchRecipe('cat4', '디저트')}>디저트</button>
    <button onClick={() => goSearchRecipe('cat4', '면/만두')}>면/만두</button>
    <button onClick={() => goSearchRecipe('cat4', '퓨전')}>퓨전</button>
    <button onClick={() => goSearchRecipe('cat4', '김치/젓갈/장류')}>김치/젓갈/장류</button>
    <button onClick={() => goSearchRecipe('cat4', '양식')}>양식</button>
    <button onClick={() => goSearchRecipe('cat4', '샐러드')}>샐러드</button>
    <button onClick={() => goSearchRecipe('cat4', '스프')}>스프</button>
    <button onClick={() => goSearchRecipe('cat4', '차/음료/술')}>차/음료/술</button>
    <button onClick={() => goSearchRecipe('cat4', '기타')}>기타</button>
  </div>

  <div className="button-group">
    <h3>재료 별</h3>
    <button onClick={() => goSearchRecipe('cat3', '')}>전체</button>
    <button onClick={() => goSearchRecipe('cat3', '소고기')}>소고기</button>
    <button onClick={() => goSearchRecipe('cat3', '돼지고기')}>돼지고기</button>
    <button onClick={() => goSearchRecipe('cat3', '닭고기')}>닭고기</button>
    <button onClick={() => goSearchRecipe('cat3', '육류')}>육류</button>
    <button onClick={() => goSearchRecipe('cat3', '채소류')}>채소류</button>
    <button onClick={() => goSearchRecipe('cat3', '해물류')}>해물류</button>
    <button onClick={() => goSearchRecipe('cat3', '달걀/유제품')}>달걀/유제품</button>
    <button onClick={() => goSearchRecipe('cat3', '가공식품류')}>가공식품류</button>
    <button onClick={() => goSearchRecipe('cat3', '쌀')}>쌀</button>
    <button onClick={() => goSearchRecipe('cat3', '밀가루')}>밀가루</button>
    <button onClick={() => goSearchRecipe('cat3', '버섯류')}>버섯류</button>
    <button onClick={() => goSearchRecipe('cat3', '과일류')}>과일류</button>
    <button onClick={() => goSearchRecipe('cat3', '기타')}>기타</button>
  </div>

  <div className="button-group">
    <h3>요리 방법 별</h3>
    <button onClick={() => goSearchRecipe('cat1', '')}>전체</button>
    <button onClick={() => goSearchRecipe('cat1', '볶음')}>볶음</button>
    <button onClick={() => goSearchRecipe('cat1', '끓이기')}>끓이기</button>
    <button onClick={() => goSearchRecipe('cat1', '부침')}>부침</button>
    <button onClick={() => goSearchRecipe('cat1', '조림')}>조림</button>
    <button onClick={() => goSearchRecipe('cat1', '무침')}>무침</button>
    <button onClick={() => goSearchRecipe('cat1', '비빔')}>비빔</button>
    <button onClick={() => goSearchRecipe('cat1', '찜')}>찜</button>
    <button onClick={() => goSearchRecipe('cat1', '절임')}>절임</button>
    <button onClick={() => goSearchRecipe('cat1', '튀김')}>튀김</button>
    <button onClick={() => goSearchRecipe('cat1', '삶기')}>삶기</button>
    <button onClick={() => goSearchRecipe('cat1', '굽기')}>굽기</button>
    <button onClick={() => goSearchRecipe('cat1', '데치기')}>데치기</button>
    <button onClick={() => goSearchRecipe('cat1', '회')}>회</button>
    <button onClick={() => goSearchRecipe('cat1', '기타')}>기타</button>
  </div>
</div>

<div className="d-flex justify-content-center align-items-center my-3 custom-filter-container">
  <button className="custom-filter-button" onClick={toggleFilterVisibility}>
    {isFilterVisible ? '카테고리 닫기' : '카테고리 열기'}
  </button>
</div>


{/* 드롭다운들 (정렬 기준, 찜 목록, n열 보기) */}
<div className="d-flex justify-content-end gap-3 my-3">
  {/* 정렬 기준 드롭다운 */}
  <div className="dropdown1">
    <select className="form-select w-auto" value={sortType} onChange={handleSortChange}>
      <option value="">-정렬 기준-</option>
      <option value="newest">최신 순</option>
      <option value="difficulty">난이도 쉬운 순</option>
      <option value="views">조회수 높은 순</option>
      <option value="recommendations">추천수 높은 순</option>
    </select>
  </div>

  {/* n열 보기 드롭다운 */}
  <div className="dropdown3">
    <select className="form-select w-auto" value={layout} onChange={handleLayoutChange}>
      <option value="two-column">2열 보기</option>
      <option value="three-column">3열 보기</option>
      <option value="five-column">5열 보기</option>
    </select>
  </div>

   {/* 찜 목록 드롭다운 */}
   <div className="dropdown2">
    <select className="form-select w-auto me-2" aria-label="찜 목록">
      <option>찜 목록</option>
      {bookmarkedRecipes.map((recipe) => (
        <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
      ))}
    </select>
  </div>
</div>

      <RecipeList
        recipes={currentRecipes}
        onBookmark={handleBookmark}
        bookmarkedRecipes={bookmarkedRecipes}
        layout={layout}
      />

      {/* 페이지네이션 기능 */}
<nav aria-label="Page navigation example">
  <ul className="pagination justify-content-center mt-4">
    {/* 이전 그룹 페이지 이동 */}
    <li className={`page-item ${currentPage <= 5 ? 'disabled' : ''}`}>
      <button
        className="page-link"
        onClick={() => paginate(Math.max(1, Math.floor((currentPage - 1) / 5) * 5))}
        aria-label="Previous"
      >
        <span aria-hidden="true">&laquo;</span>
      </button>
    </li>

    {/* 최대 5페이지 표시 */}
    {Array.from({ length: 5 }, (_, i) => {
      const pageNumber = Math.floor((currentPage - 1) / 5) * 5 + i + 1;
      if (pageNumber <= totalPages) {
        return (
          <li
            key={pageNumber}
            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => paginate(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        );
      }
      return null;
    })}

    {/* 다음 그룹 페이지 이동 */}
    <li className={`page-item ${currentPage + 5 > totalPages ? 'disabled' : ''}`}>
      <button
        className="page-link"
        onClick={() => paginate(Math.min(totalPages, Math.floor((currentPage - 1) / 5) * 5 + 6))}
        aria-label="Next"
      >
        <span aria-hidden="true">&raquo;</span>
      </button>
    </li>
  </ul>
</nav>

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
      <Footer />
    </div>
  );
}


export default SearchResultsPage;
