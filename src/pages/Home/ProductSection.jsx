import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import './ProductSection.css';

// 개별 상품 컴포넌트
function ProductItem({ product }) {
  const rawPrice = product.price ? product.price.replace(/,/g, '') : null;
  const formattedPrice = !isNaN(Number(rawPrice))
    ? Number(rawPrice).toLocaleString() 
    : null;

  return (
    <li className="prod-ed-item">
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <div className="prod-item-img">
          <img src={product.imgUrl} alt={product.productName} className="prod-item-img" />
        </div>
        <div className="prod-item-info">
          <div className="title">{product.productName}</div>
          <div className="price">
            {formattedPrice ? `${formattedPrice}원` : "가격 정보 없음"}
          </div>
        </div>
      </a>
    </li>
  );
}


// 상품 섹션 컴포넌트
function ProductSection({ title, defaultQuery, topIngredients }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(defaultQuery);
  const scrollerRef = useRef(null);

  const sortedIngredients = topIngredients
    .sort((a, b) => {
      if (a.expiry && b.expiry) {
        return a.expiry - b.expiry;
      } else if (a.count && b.count) {
        return b.count - a.count;
      }
      return 0;
    })
    .slice(0, 5);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8001/shop?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft += 200;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='prod-ed'>
      <div className='prod-ed-header'>
        <span className='title'>{title}</span>
        <div className="top-ingredients">
          {sortedIngredients.map((ingredient, index) => (
            <span
              key={index}
              className="ingredient-info"
              onClick={() => setQuery(ingredient.name)}
            >
              {ingredient.name}: {ingredient.expiry ? `${ingredient.expiry}일 남음` : `${ingredient.count}회`}
            </span>
          ))}
        </div>
      </div>
      <div className='prod-ed-body'>
        <button className="scroll-button left" onClick={scrollLeft}>◀</button>
        <div className='prod-ed-wrap' ref={scrollerRef}>
          <ul className='prod-ed-list'>
            {products.map((product) => (
              <ProductItem key={product.productId} product={product} />
            ))}
          </ul>
        </div>
        <button className="scroll-button right" onClick={scrollRight}>▶</button>
      </div>
    </div>
  );
}

// 전체 상품 페이지 컴포넌트
function ProductPage() {
  const [refrigeratorData, setRefrigeratorData] = useState([]);
  const [defaultQuery, setDefaultQuery] = useState("");
  const [expiredItems, setExpiredItems] = useState([]);

  const user = useRecoilValue(userState); // Recoil 상태에서 사용자 정보 가져오기
  const { userId } = user?.user || {}; // userId 추출

  useEffect(() => {
    const fetchRefrigeratorData = async () => {
      try {
        // userId를 URL에 포함
        const response = await fetch(`http://localhost:8001/refrigerator?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();

          const today = new Date();
          const processedData = data.map(item => {
            const expirationDate = new Date(item.expiration_date);
            const expiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
            return { ...item, expiry };
          });

          const expired = processedData.filter(item => item.expiry <= 0);
          const valid = processedData.filter(item => item.expiry > 0);

          setExpiredItems(expired);
          setRefrigeratorData(valid);

          if (valid.length > 0) {
            const shortestExpiryItem = valid.sort((a, b) => a.expiry - b.expiry)[0];
            setDefaultQuery(shortestExpiryItem.name);
          }
        } else {
          console.error('Failed to fetch refrigerator data');
        }
      } catch (error) {
        console.error('Error fetching refrigerator data:', error);
      }
    };

    if (userId) {
      fetchRefrigeratorData(); // userId가 있을 때만 API 호출
    }
  }, [userId]);

  const sortedRefrigeratorData = refrigeratorData
    .sort((a, b) => a.expiry - b.expiry)
    .slice(0, 5)
    .map(item => ({ name: item.name, expiry: item.expiry }));

  return (
    <div>
      {refrigeratorData.length > 0 ? (
        <ProductSection 
          title="나만의 냉장고" 
          defaultQuery={defaultQuery} 
          topIngredients={sortedRefrigeratorData} 
        />
      ) : (
        <div className='prod-ed'>
          <div className='prod-ed-header' style={{ marginBottom: '100px' }}>
            <span className='title'>나만의 냉장고</span>
            <div className="empty-refrigerator">
              냉장고에 아무것도 없습니다.
            </div>
          </div>
        </div>
      )}
      <ProductSection 
        title="레시피에 최다 등록된 재료" 
        defaultQuery="설탕" 
        topIngredients={[
          { name: '생수', count: 252 },
          { name: '양파', count: 273 },
          { name: '계란', count: 279 },
          { name: '소금', count: 457 },
          { name: '설탕', count: 538 },
        ]} 
      />
    </div>
  );
}

export default ProductPage;
