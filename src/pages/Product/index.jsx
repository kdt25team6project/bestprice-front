import React, { useEffect, useState } from 'react';
import "./style.css";
import Graph from '../Search/Graph.jsx';
import { userState } from "../../state/userState";
import { useRecoilValue } from "recoil";
import axios from "axios";

function ProductSearchPage() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [filters, setFilters] = useState({ 네이버: true, 쿠팡: true, 기타: true });
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [allKeywords, setAllKeywords] = useState([]); // 모든 키워드 상태
  const [error, setError] = useState(null); // 오류 상태 관리
  const [selectedKeyword, setSelectedKeyword] = useState(""); // 현재 선택된 키워드 상태
  const { user } = useRecoilValue(userState);
  const userId = user?.userId;
  const defaultKeywords = ["설탕", "소금", "계란", "양파", "생수"];

  const parseIngredients = (ingredientText) => {
    if (!ingredientText) return [];

    const sections = ingredientText.split(/\[(.*?)\]/).filter(Boolean);
    const ingredients = [];

    sections.forEach((section, index) => {
      if (index % 2 === 0) return;

      const items = section.split('|').map((item) => {
        const trimmedItem = item.trim();
        if (/\d/.test(trimmedItem)) {
          return trimmedItem.replace(/\d.*$/, "").trim();
        }
        return trimmedItem.split(" ")[0].trim();
      });

      ingredients.push(...items.filter(Boolean));
    });

    return ingredients;
  };

  const fetchBookmarkedRecipes = async () => {
    setIsLoading(true);
    try {
      const { data: bookmarkedIds } = await axios.get(
        "http://localhost:8001/api/recipe/bookmarks",
        { params: { userId } }
      );

      const recipeDetails = await Promise.all(
        bookmarkedIds.map(async (id) => {
          const { data: recipe } = await axios.get(
            `http://localhost:8001/api/recipe/${id}`
          );
          return { ...recipe, id };
        })
      );
      const ingredients = recipeDetails.flatMap((recipe) =>
        parseIngredients(recipe.ckg_MTRL_CN)
      );
      const keywordsArray = [...new Set(ingredients)];
      setAllKeywords(keywordsArray);
      setKeyword(keywordsArray[0] || defaultKeywords[0]);
      setBookmarkedRecipes(recipeDetails);
    } catch (error) {
      console.error("북마크된 레시피를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedRecipes(); // 북마크된 레시피 데이터 가져오기
  }, []);

  const handleKeywordClick = (selectedKeyword) => {
    setSelectedKeyword(selectedKeyword); // 선택된 키워드 상태 업데이트
    setKeyword(selectedKeyword); // 선택된 키워드로 검색
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) return;
      setLoading(true);
      setError(null); // 오류 초기화
      try {
        const response = await fetch(
          `http://localhost:8001/shop?query=${encodeURIComponent(keyword)}`
        );
        const data = await response.json();
        const classifiedData = data.map((item) => ({
          ...item,
          platform: getPlatformName(item.link),
          price: formatPrice(item.price),
        }));

        setProducts(classifiedData);
        setSortedProducts(classifiedData);
      } catch (error) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        console.error("데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const formatPrice = (price) => {
    if (!price) return null;
    if (typeof price === "string" && price.includes(",")) return price;
    return new Intl.NumberFormat("ko-KR").format(parseInt(price, 10));
  };

  const getPlatformName = (link) => {
    if (link.includes("coupang.com")) return "쿠팡";
    if (link.includes("smartstore.naver.com")) return "네이버";
    return "기타";
  };

  const sortAndFilterProducts = () => {
    const sorted = [...products].sort((a, b) => {
      if (sortOption === "lowPrice") {
        return (
          parseInt(a.price.replace(/,/g, ""), 10) -
          parseInt(b.price.replace(/,/g, ""), 10)
        );
      }
      if (sortOption === "highPrice") {
        return (
          parseInt(b.price.replace(/,/g, ""), 10) -
          parseInt(a.price.replace(/,/g, ""), 10)
        );
      }
      return 0;
    });

    const filtered = sorted.filter((product) => filters[product.platform]);
    setSortedProducts(filtered);
  };

  useEffect(() => {
    sortAndFilterProducts();
  }, [sortOption, products, filters]);

  const allRenderedKeywords = [...new Set([...defaultKeywords, ...allKeywords])];

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="prod_container">
      <div className="sort_options">
        <div className="filter_checkboxes">
          <label>
            <input
              type="checkbox"
              checked={filters["네이버"]}
              onChange={() => setFilters({ ...filters, 네이버: !filters["네이버"] })}
            />
            네이버
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters["쿠팡"]}
              onChange={() => setFilters({ ...filters, 쿠팡: !filters["쿠팡"] })}
            />
            쿠팡
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters["기타"]}
              onChange={() => setFilters({ ...filters, 기타: !filters["기타"] })}
            />
            기타
          </label>
        </div>
        <div className="sort_buttons">
          <button onClick={() => setSortOption("default")}>기본순</button>
          <button onClick={() => setSortOption("lowPrice")}>낮은 가격순</button>
          <button onClick={() => setSortOption("highPrice")}>높은 가격순</button>
        </div>
      </div>

      <div className="button-group">
        {(allKeywords.length > 0 ? allKeywords : defaultKeywords).map((kw, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(kw)}
            className={`btn ${selectedKeyword === kw ? "active" : ""}`}
          >
            {kw}
          </button>
        ))}
      </div>


      {sortedProducts.map((product) => (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          key={product.productId}
        >
          <div className={`prod_main_info ${product.platform}`}>
            <div className="prod_thumb_image">
              <img
                src={product.imgUrl}
                alt={product.productName}
                className="main_prod_list"
              />
            </div>
            <div className="prod_info">
              <p className="prod_name">{product.productName}</p>
              {product.basePrice && product.price ? (
                <Graph
                  basePrice={formatPrice(product.basePrice)}
                  price={formatPrice(product.price)}
                />
              ) : null}
            </div>
            <div className="prod_pricelist">
              <ul>
                <li>
                  <p className="memory_sect">{product.platform}</p>
                  <p className="price_sect">{product.price}원</p>
                </li>
              </ul>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default ProductSearchPage;
