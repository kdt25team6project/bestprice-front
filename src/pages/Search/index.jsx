import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // useLocation 추가
import axios from "axios";
import RecipeList from "./RecipeList";
import "./styles.css";
import "./RecipeCard.css";
import "./RecipeList.css";

function SearchResultsPage() {
	const [allRecipes, setAllRecipes] = useState([]);
	const [filteredRecipes, setFilteredRecipes] = useState([]);
	const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
	const [layout, setLayout] = useState("three-column");
	const [sortType, setSortType] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isFilterVisible, setIsFilterVisible] = useState(false); // 카테고리 필터 표시 여부
	const location = useLocation(); // 현재 URL 경로 가져오기
	const [error, setError] = useState(null); // 에러 상태
	const [loading, setLoading] = useState(true); // 로딩 상태

	const handleSearch = (keyword, searchType) => {
		const filtered = allRecipes.filter((recipe) =>
			searchType === "name"
				? recipe.name.includes(keyword)
				: recipe.재료.includes(keyword)
		);
		setFilteredRecipes(filtered);
		setCurrentPage(1);
	};

	useEffect(() => {
		// URL 쿼리 파라미터 가져오기
		const queryParams = new URLSearchParams(location.search);
		const keyword = queryParams.get("keyword");
		const searchType = queryParams.get("searchType") || "name";

		if (keyword) {
			handleSearch(keyword, searchType);
		}
	}, [location]); // location이 변경될 때마다 실행

	// recipesPerPage 값을 동적으로 설정
	let recipesPerPage;

	if (layout === "two-column") {
		recipesPerPage = 6; // 2열 보기일 때 최대 6개
	} else if (layout === "three-column") {
		recipesPerPage = 9; // 3열 보기일 때 최대 9개 (기본값)
	} else if (layout === "five-column") {
		recipesPerPage = 20; // 5열 보기일 때 최대 20개
	}

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await axios.get("http://localhost:8001/allrecipes");
				const basicRecipes = response.data.map((recipe) => ({
					id: recipe.rcp_SNO, // 고유 ID
					name: recipe.rcp_TTL, // 레시피 이름
					종류: recipe.ckg_KND_ACTO_NM, // 레시피 종류
					재료: recipe.ckg_MTRL_CN, // 레시피 재료
					요리방법: recipe.ckg_MTH_ACTO_NM, // 요리 방법
					RGTR_NM: recipe.rgtr_NM, // 작성자 이름
					RGTR_ID: recipe.rgtr_ID, // 작성자 ID
					INQ_CNT: Number(recipe.inq_CNT), // 조회수
					RCMM_CNT: Number(recipe.rcmm_CNT), // 추천수
					CKG_DODF_NM: recipe.ckg_DODF_NM, // 난이도
					mainThumb: recipe.image_URL,
				}));
				setAllRecipes(basicRecipes); // 모든 레시피를 상태에 저장
				setFilteredRecipes(basicRecipes); // 초기값을 전체 레시피로 설정
				setLoading(false);
			} catch (error) {
				console.error("Error fetching recipes:", error);
				setError(error);
				setLoading(false);
			}
		};

		fetchRecipes(); // 비동기 함수 호출
	}, []); // 빈 배열로 useEffect를 처음 렌더링 시에만 실행

	// 로딩 상태 처리
	if (loading) {
		return <p>Loading recipes...</p>;
	}

	// 에러 처리
	if (error) {
		return <p>Error loading recipes: {error.message}</p>;
	}

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

		if (e.target.value === "views") {
			sortedRecipes.sort((a, b) => b.INQ_CNT - a.INQ_CNT); // 조회수 높은 순
		} else if (e.target.value === "recommendations") {
			sortedRecipes.sort((a, b) => b.RCMM_CNT - a.RCMM_CNT); // 추천수 높은 순
		} else if (e.target.value === "difficulty") {
			// 난이도를 숫자로 매핑
			const difficultyMap = { 아무나: 1, 초급: 2, 중급: 3, 고급: 4 };

			// 난이도를 기준으로 정렬
			sortedRecipes.sort(
				(a, b) => difficultyMap[a.CKG_DODF_NM] - difficultyMap[b.CKG_DODF_NM]
			);
		} else if (e.target.value === "newest") {
			sortedRecipes.sort((a, b) => new Date(b.RGTR_ID) - new Date(a.RGTR_ID)); // 최신순
		}

		setFilteredRecipes(sortedRecipes);
	};

	const goSearchRecipe = (category, value) => {
		const filtered = allRecipes.filter(
			(recipe) =>
				(category === "cat4" &&
					(value === "" || recipe.종류?.includes(value))) ||
				(category === "cat3" &&
					(value === "" || recipe.재료?.includes(value))) ||
				(category === "cat1" &&
					(value === "" || recipe.요리방법?.includes(value)))
		);
		setFilteredRecipes(filtered);
		setCurrentPage(1); // 페이지를 첫 페이지로 초기화
	};

	// 페이지네이션 관련 함수들
	const indexOfLastRecipe = currentPage * recipesPerPage;
	const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
	const currentRecipes = filteredRecipes.slice(
		indexOfFirstRecipe,
		indexOfLastRecipe
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

	const toggleFilterVisibility = () => {
		setIsFilterVisible(!isFilterVisible);
	};

	return (
		<div className="container">
			<div className={`filter-container ${isFilterVisible ? "show" : ""}`}>
				<div className="button-group">
					<h3>종류 별</h3>
					<button onClick={() => goSearchRecipe("cat4", "")}>전체</button>
					<button onClick={() => goSearchRecipe("cat4", "밑반찬")}>
						밑반찬
					</button>
					<button onClick={() => goSearchRecipe("cat4", "메인반찬")}>
						메인반찬
					</button>
					<button onClick={() => goSearchRecipe("cat4", "국/탕")}>국/탕</button>
					<button onClick={() => goSearchRecipe("cat4", "찌개")}>찌개</button>
					<button onClick={() => goSearchRecipe("cat4", "디저트")}>
						디저트
					</button>
					<button onClick={() => goSearchRecipe("cat4", "면/만두")}>
						면/만두
					</button>
					<button onClick={() => goSearchRecipe("cat4", "퓨전")}>퓨전</button>
					<button onClick={() => goSearchRecipe("cat4", "김치/젓갈/장류")}>
						김치/젓갈/장류
					</button>
					<button onClick={() => goSearchRecipe("cat4", "양식")}>양식</button>
					<button onClick={() => goSearchRecipe("cat4", "샐러드")}>
						샐러드
					</button>
					<button onClick={() => goSearchRecipe("cat4", "스프")}>스프</button>
					<button onClick={() => goSearchRecipe("cat4", "차/음료/술")}>
						차/음료/술
					</button>
					<button onClick={() => goSearchRecipe("cat4", "기타")}>기타</button>
				</div>

				<div className="button-group">
					<h3>재료 별</h3>
					<button onClick={() => goSearchRecipe("cat3", "")}>전체</button>
					<button onClick={() => goSearchRecipe("cat3", "소고기")}>
						소고기
					</button>
					<button onClick={() => goSearchRecipe("cat3", "돼지고기")}>
						돼지고기
					</button>
					<button onClick={() => goSearchRecipe("cat3", "닭고기")}>
						닭고기
					</button>
					<button onClick={() => goSearchRecipe("cat3", "육류")}>육류</button>
					<button onClick={() => goSearchRecipe("cat3", "채소류")}>
						채소류
					</button>
					<button onClick={() => goSearchRecipe("cat3", "해물류")}>
						해물류
					</button>
					<button onClick={() => goSearchRecipe("cat3", "달걀/유제품")}>
						달걀/유제품
					</button>
					<button onClick={() => goSearchRecipe("cat3", "가공식품류")}>
						가공식품류
					</button>
					<button onClick={() => goSearchRecipe("cat3", "쌀")}>쌀</button>
					<button onClick={() => goSearchRecipe("cat3", "밀가루")}>
						밀가루
					</button>
					<button onClick={() => goSearchRecipe("cat3", "버섯류")}>
						버섯류
					</button>
					<button onClick={() => goSearchRecipe("cat3", "과일류")}>
						과일류
					</button>
					<button onClick={() => goSearchRecipe("cat3", "기타")}>기타</button>
				</div>

				<div className="button-group">
					<h3>요리 방법 별</h3>
					<button onClick={() => goSearchRecipe("cat1", "")}>전체</button>
					<button onClick={() => goSearchRecipe("cat1", "볶음")}>볶음</button>
					<button onClick={() => goSearchRecipe("cat1", "끓이기")}>
						끓이기
					</button>
					<button onClick={() => goSearchRecipe("cat1", "부침")}>부침</button>
					<button onClick={() => goSearchRecipe("cat1", "조림")}>조림</button>
					<button onClick={() => goSearchRecipe("cat1", "무침")}>무침</button>
					<button onClick={() => goSearchRecipe("cat1", "비빔")}>비빔</button>
					<button onClick={() => goSearchRecipe("cat1", "찜")}>찜</button>
					<button onClick={() => goSearchRecipe("cat1", "절임")}>절임</button>
					<button onClick={() => goSearchRecipe("cat1", "튀김")}>튀김</button>
					<button onClick={() => goSearchRecipe("cat1", "삶기")}>삶기</button>
					<button onClick={() => goSearchRecipe("cat1", "굽기")}>굽기</button>
					<button onClick={() => goSearchRecipe("cat1", "데치기")}>
						데치기
					</button>
					<button onClick={() => goSearchRecipe("cat1", "회")}>회</button>
					<button onClick={() => goSearchRecipe("cat1", "기타")}>기타</button>
				</div>
			</div>

			<div className="d-flex justify-content-end align-items-center my-3">
				<button
					className="custom-filter-button"
					onClick={toggleFilterVisibility}
				>
					{isFilterVisible ? "카테고리 닫기" : "카테고리 열기"}
				</button>

				<select
					className="form-select w-auto me-2"
					value={sortType}
					onChange={handleSortChange}
				>
					<option value="">-정렬 기준-</option>
					<option value="difficulty">최신 순</option>
					<option value="difficulty">난이도 쉬운 순</option>
					<option value="views">조회수 높은 순</option>
					<option value="recommendations">추천수 높은 순</option>
				</select>

				<select className="form-select w-auto me-2" aria-label="찜 목록">
					<option>찜 목록</option>
					{bookmarkedRecipes.map((recipe) => (
						<option key={recipe.id} value={recipe.id}>
							{recipe.name}
						</option>
					))}
				</select>

				<select
					className="form-select w-auto"
					value={layout}
					onChange={handleLayoutChange}
				>
					<option value="two-column">2열 보기</option>
					<option value="three-column">3열 보기</option>
					<option value="five-column">5열 보기</option>
				</select>
			</div>
			<RecipeList
				recipes={currentRecipes}
				onBookmark={handleBookmark}
				bookmarkedRecipes={bookmarkedRecipes}
				layout={layout}
			/>

			{/* 페이지네이션 */}
			<nav aria-label="Page navigation example">
				<ul className="pagination justify-content-center mt-4">
					<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
						<button
							className="page-link"
							onClick={() => paginate(currentPage - 1)}
							aria-label="Previous"
						>
							<span aria-hidden="true">&laquo;</span>
						</button>
					</li>

					{Array.from({ length: totalPages }, (_, i) => (
						<li
							key={i}
							className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
						>
							<button className="page-link" onClick={() => paginate(i + 1)}>
								{i + 1}
							</button>
						</li>
					))}

					<li
						className={`page-item ${
							currentPage === totalPages ? "disabled" : ""
						}`}
					>
						<button
							className="page-link"
							onClick={() => paginate(currentPage + 1)}
							aria-label="Next"
						>
							<span aria-hidden="true">&raquo;</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default SearchResultsPage;
