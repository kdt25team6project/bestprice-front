import React, { useEffect, useState } from 'react';
import './ProductSearchPage.css';
import Graph from './Graph.jsx';
function ProductSearchPage({ keyword }) {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [filters, setFilters] = useState({ 네이버: true, 쿠팡: true, 기타: true });

  const formatPrice = (price) => {
    if (!price) return null;
    if (typeof price === "string" && price.includes(",")) return price;
    return new Intl.NumberFormat("ko-KR").format(parseInt(price, 10)); 
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8001/shop?query=${encodeURIComponent(keyword)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const classifiedData = data.map(item => ({
          ...item,
          platform: getPlatformName(item.link),
          price: formatPrice(item.price) 
        }));

        setProducts(classifiedData);
        setSortedProducts(classifiedData);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  useEffect(() => {
    const sortProducts = () => {
      let sorted;

      if (sortOption === "default") {
        sorted = [...products];
      } else if (sortOption === "lowPrice") {
        sorted = [...products].sort((a, b) => parseInt(a.price.replace(/,/g, ""), 10) - parseInt(b.price.replace(/,/g, ""), 10));
      } else if (sortOption === "highPrice") {
        sorted = [...products].sort((a, b) => parseInt(b.price.replace(/,/g, ""), 10) - parseInt(a.price.replace(/,/g, ""), 10));
      }

      setSortedProducts(sorted);
    };

    sortProducts();
  }, [sortOption, products]);

  const handleSortOption = (option) => {
    setSortOption(option);
  };

  const handleFilterChange = (platform) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [platform]: !prevFilters[platform]
    }));
  };

  const getPlatformName = (link) => {
    if (link.includes('coupang.com')) return '쿠팡';
    if (link.includes('smartstore.naver.com')) return '네이버';
    return '기타';
  };

  const filteredProducts = sortedProducts.filter(product => filters[product.platform]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='prod_container'>
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

      {filteredProducts.map((product, index) => (
        <a href={product.link} target="_blank" rel="noopener noreferrer" key={product.productId}>
          <div className={`prod_main_info ${product.platform}`}>
            <div className="prod_thumb_image">
              <img src={product.imgUrl} alt={product.productName} className="main_prod_list" />
            </div>
            <div className="prod_info">
              <p className="prod_name">{product.productName}</p>
              {product.basePrice && product.price ? (
                <Graph basePrice={formatPrice(product.basePrice)} price={formatPrice(product.price)} />
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