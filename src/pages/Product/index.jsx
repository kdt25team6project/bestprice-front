import React, { useEffect, useState, useRef } from 'react';
import './style.css';


//인기 있는 베스트 상품
const BestProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8001/shop?query=계란');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w_custom">
      <div className="title main_title">
        <h2>인기 있는 베스트 상품</h2>
      </div>
      <ul className="prdList grid4 clear">
        {products.slice(0, 3).map((product, index) => (
          <li
            key={product.productId}
            className={`product-item ${index === 0 ? "large" : ""}`}
          >
            <div className="thumbnail">
              <div className={`cnt ${index === 0 ? "best-badge" : ""}`}>
                <span className='prdrank'>{index === 0 ? `Best ${index + 1}` : index + 1}</span>
              </div>
              <div className="prdImg">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <img src={product.imgUrl} alt={product.productName} />
                </a>
              </div>
              <div className="description">
                <div className="item_tit_box">
                  <strong className="item_name">
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      {product.productName}
                    </a>
                  </strong>
                </div>
                <div className="item_money_box">
                  <strong className="c_price">{product.price}원</strong>
                  {product.basePrice && (
                    <del className="item_price">{product.basePrice}원</del>
                  )}
                  {product.discount && (
                    <span className="discount">{product.discount} 할인</span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function ProductItem({ product }) {
  return (
    <li className='prod-ed-item'>
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <div className='prod-item-img'>
          <img src={product.imgUrl} alt={product.productName} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className='prod-item-info'>
          <div className='title'>{product.productName}</div>
          <div className='price'>{product.price ? `${product.price}원` : '가격 정보 없음'}</div>
        </div>
      </a>
    </li>
  );
}

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
      {/* 상품 타이틀 및 버튼 */}
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

      {/* 상품 */}
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

function ProductPage() {
  const [refrigeratorData, setRefrigeratorData] = useState([]);
  const [defaultQuery, setDefaultQuery] = useState("");
  const [expiredItems, setExpiredItems] = useState([]);

  useEffect(() => {
    const fetchRefrigeratorData = async () => {
      try {
        const response = await fetch('http://localhost:8002/refrigerator');
        if (response.ok) {
          const data = await response.json();

          const today = new Date();
          const processedData = data.map(item => {
            const expirationDate = new Date(item.expiration_date);
            const expiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
            // 1000 = 1초 | 1000*60 = 1분 | 1000*60*60 = 1시간 | 1000 * 60 * 60 * 24 = 하루
            return { ...item, expiry };
          });

          const expired = processedData.filter(item => item.expiry <= 0);
          // 유통기한이 지남
          const valid = processedData.filter(item => item.expiry > 0);
          // 유통기한이 남음

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

    fetchRefrigeratorData();
  }, []);

  const sortedRefrigeratorData = refrigeratorData
    .sort((a, b) => a.expiry - b.expiry)
    .slice(0, 5)
    .map(item => ({ name: item.name, expiry: item.expiry }));

  return (
    <div>
 {/*   <BestProduct />  */}    
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
{/* 
      {expiredItems.length > 0 && (
        <ProductSection 
          title="유통기한이 지난 재료" 
          defaultQuery={expiredItems[0].name}
          topIngredients={expiredItems.map(item => ({
            name: item.name,
            expiry: "유통기한 지남",
          }))} 
        />
      )}
*/}
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
