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
  const [error, setError] = useState(null); // 오류 상태 관리
  const { user } = useRecoilValue(userState);
  const userId = user?.userId;
  const defaultKeywords = ["설탕", "소금", "계란", "양파", "생수"];

  const formatPrice = (price) => {
    if (!price) return null;
    if (typeof price === "string" && price.includes(",")) return price;
    return new Intl.NumberFormat("ko-KR").format(parseInt(price, 10));
  };

  const getRandomKeyword = (keywords, isLoggedIn) => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 기본 키워드에서 랜덤 선택
      const randomIndex = Math.floor(Math.random() * defaultKeywords.length);
      return defaultKeywords[randomIndex];
    }
    if (!keywords || keywords.length === 0) return null;
  
    // 키워드를 배열로 분리
    const keywordArray = keywords.split(",").map((kw) => kw.trim());
  
    // 랜덤 인덱스 선택
    const randomIndex = Math.floor(Math.random() * keywordArray.length);
  
    // 선택된 키워드에서 첫 번째 단어만 반환
    return keywordArray[randomIndex].split(" ")[0];
  };
  
  
  // 재료이름 추출
  const parseIngredients = (ingredientText) => {
    if (!ingredientText) return [];
    
    const sections = ingredientText.split(/\[(.*?)\]/).filter(Boolean);
    const ingredients = [];
  
    sections.forEach((section, index) => {
      if (index % 2 === 0) {
        return;
      } else {
        const items = section.split('|').map((item) => item.trim());
        ingredients.push(...items.filter(Boolean));
      }
    });
  
    return ingredients;
  };

  const parseQuantity = (item) => {
    const match = item.match(/(.*?)(\d+.*)?/);
    if (match) {
      const name = match[1]?.trim();
      return {
        name: name && name.length > 0 ? name : null,
        amount: match[2]?.trim() || null,
      };
    }
    return { name: null, amount: null };
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
          console.log(recipe);
          return { ...recipe, id };
        })
      );
      const ingredients = recipeDetails.flatMap((recipe) =>
        parseIngredients(recipe.ckg_MTRL_CN)
      );
      const keywordString = ingredients.join(", ");
      console.log("검색 키워드:", keywordString);
      setKeyword(keywordString);
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

  useEffect(() => {
    const fetchData = async () => {
      // 로그인 여부 확인
      const isLoggedIn = !!userId;
  
      // 랜덤 키워드 선택
      const randomKeyword = getRandomKeyword(keyword, isLoggedIn);
      console.log("랜덤 검색 키워드:", randomKeyword); 
  
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8001/shop?query=${encodeURIComponent(randomKeyword)}`
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
  }, [keyword, userId]);
  
  

  useEffect(() => {
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

    sortAndFilterProducts();
  }, [sortOption, products, filters]);

  const handleSortOption = (option) => {
    setSortOption(option);
  };

  const handleFilterChange = (platform) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [platform]: !prevFilters[platform],
    }));
  };

  const getPlatformName = (link) => {
    if (link.includes("coupang.com")) return "쿠팡";
    if (link.includes("smartstore.naver.com")) return "네이버";
    return "기타";
  };

  const filteredProducts = sortedProducts.filter(
    (product) => filters[product.platform]
  );

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
              onChange={() => handleFilterChange("네이버")}
            />
            네이버
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters["쿠팡"]}
              onChange={() => handleFilterChange("쿠팡")}
            />
            쿠팡
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters["기타"]}
              onChange={() => handleFilterChange("기타")}
            />
            기타
          </label>
        </div>
        <div className="sort_buttons">
          <button onClick={() => handleSortOption("default")}>기본순</button>
          <button onClick={() => handleSortOption("lowPrice")}>낮은 가격순</button>
          <button onClick={() => handleSortOption("highPrice")}>높은 가격순</button>
        </div>
      </div>

      {filteredProducts.map((product) => (
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
