import React, { useEffect, useState } from 'react';
import './ProductSearchPage.css';
import Graph from './Graph';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8001/shop?query=%EA%B0%84%EC%9E%A5');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("서버에서 JSON이 아닌 응답을 받았습니다. 응답:", await response.text());
          throw new Error("서버에서 JSON이 아닌 응답을 받았습니다.");
        }
  
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="wid">
      <div className="contaiiii">
      {products.map((product) => (
        <div key={product.productId} className="prod_main_info">
            <div className="prod_thumb_image">
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <img src={product.imgUrl} alt={product.productName} className="main_prod_list" />
              </a>
            </div>
            <div className="prod_info">
              <p className="prod_name">{product.productName}</p>
              {/* 가격 변동 그래프 추가 */}
              <Graph basePrice={product.basePrice} price={product.price} />
            </div>
            <div className="prod_pricelist">
              <ul>
                <li>
                  <p className="memory_sect">네이버</p>
                  <p className="price_sect"><a href={product.link}>{product.basePrice}원</a></p>
                </li>
                <li>
                  <p className="memory_sect"><a href={product.link}>쿠팡</a></p>
                  <p className="price_sect">{product.price}원</p>
                </li>
              </ul>
            </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export default ProductPage;
