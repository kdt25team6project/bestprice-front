import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // useLocation 추가
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import axios from "axios";
import RecipeList from "./RecipeList";
import "./styles.css";
import "./RecipeCard.css";
import "./RecipeList.css";

function SearchResultsPage() {
	const user = useRecoilValue(userState); // 사용자 상태
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
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedIngredient, setSelectedIngredient] = useState("");

	const [preferences, setPreferences] = useState(null);
	const { userId } = user?.user || {};

	const fetchPreferences = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8001/api/preferences/${userId}`
			);
			setPreferences(response.data);
		} catch (error) {
			console.error("Error fetching preferences:", error);
		}
	};

	useEffect(() => {
		fetchPreferences();
	}, []);

	useEffect(() => {
		// preferences가 로드된 후 fetchRecipes 실행
		if (preferences !== null) {
			fetchRecipes();
		}
	}, [preferences]); // preferences가 업데이트될 때마다 실행

	const fetchRecipes = async () => {
		try {
			let response;

			if (preferences) {
				// 선호도가 있는 경우, 필터링된 레시피를 가져옴
				response = await axios.get("http://localhost:8001/recipes", {
					params: {
						difficulty: preferences.ckg_DODF_NM,
						portion: preferences.ckg_INBUN_NM,
						category: preferences.ckg_KND_ACTO_NM,
						method: preferences.ckg_MTH_ACTO_NM,
					},
				});
			} else {
				// 선호도가 없는 경우, 전체 레시피를 가져옴
				response = await axios.get("http://localhost:8001/allrecipes");
			}

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

			setAllRecipes(basicRecipes); // 모든 레시피 저장
			setFilteredRecipes(basicRecipes); // 필터링된 레시피 초기값 설정
			setLoading(false);
		} catch (error) {
			console.error("Error fetching recipes:", error);
			setError(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				await fetchPreferences(); // 선호도를 먼저 가져옴
				fetchRecipes(); // 이후 레시피를 가져옴
			} catch (error) {
				console.error("Error initializing data:", error);
			}
		};

		fetchInitialData();
	}, []);

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

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
		goSearchRecipe("cat1", category);
	};

	const handleTypeClick = (type) => {
		setSelectedType(type);
		goSearchRecipe("cat4", type);
	};

	const handleIngredientClick = (ingredient) => {
		setSelectedIngredient(ingredient);
		goSearchRecipe("cat3", ingredient);
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
					<h3>분류</h3>
					{[
						"",
						"밑반찬",
						"메인반찬",
						"국/탕",
						"찌개",
						"디저트",
						"면/만두",
						"퓨전",
						"김치/젓갈/장류",
						"양식",
						"샐러드",
						"스프",
						"차/음료/술",
						"기타",
					].map((type) => (
						<button
							key={type}
							className={`button ${selectedType === type ? "selected" : ""}`}
							onClick={() => handleTypeClick(type)}
						>
							{type || "전체"}
						</button>
					))}
				</div>

				{/* 재료 별 */}
				<div className="button-group">
					<h3>재료</h3>
					{[
						"",
						"소고기",
						"돼지고기",
						"닭고기",
						"육류",
						"채소류",
						"해물류",
						"달걀/유제품",
						"가공식품류",
						"쌀",
						"밀가루",
						"버섯류",
						"과일류",
						"기타",
					].map((ingredient) => (
						<button
							key={ingredient}
							className={`button ${
								selectedIngredient === ingredient ? "selected" : ""
							}`}
							onClick={() => handleIngredientClick(ingredient)}
						>
							{ingredient || "전체"}
						</button>
					))}
				</div>

				<div className="button-group">
					<h3>조리 방식</h3>
					{[
						"",
						"볶음",
						"끓이기",
						"부침",
						"조림",
						"무침",
						"비빔",
						"찜",
						"절임",
						"튀김",
						"삶기",
						"굽기",
						"데치기",
						"회",
						"기타",
					].map((category) => (
						<button
							key={category}
							className={`button ${
								selectedCategory === category ? "selected" : ""
							}`}
							onClick={() => handleCategoryClick(category)}
						>
							{category || "전체"}
						</button>
					))}
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
					<option value="newest">최신 순</option>
					<option value="difficulty">난이도 쉬운 순</option>
					<option value="views">조회수 높은 순</option>
					<option value="recommendations">추천수 높은 순</option>
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
					{/* 이전 그룹 페이지 이동 */}
					<li className={`page-item ${currentPage <= 5 ? "disabled" : ""}`}>
						<button
							className="page-link"
							onClick={() =>
								paginate(Math.max(1, Math.floor((currentPage - 1) / 5) * 5))
							}
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
									className={`page-item ${
										currentPage === pageNumber ? "active" : ""
									}`}
								>
									<button
										className="page-link"
										onClick={() => paginate(pageNumber)}
									>
										{pageNumber}
									</button>
								</li>
							);
						}
						return null;
					})}

					{/* 다음 그룹 페이지 이동 */}
					<li
						className={`page-item ${
							Math.floor((currentPage - 1) / 5) * 5 + 5 >= totalPages
								? "disabled"
								: ""
						}`}
					>
						<button
							className="page-link"
							onClick={() =>
								paginate(
									Math.min(
										totalPages,
										Math.floor((currentPage - 1) / 5) * 5 + 6
									)
								)
							}
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
