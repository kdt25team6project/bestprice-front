import React, { useEffect, useState } from 'react';
import './ProductSearchPage.css';
import Graph from './Graph.jsx';

function ProductSearchPage({ keyword }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8001/shop?query=${encodeURIComponent(keyword)}`);
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
  }, [keyword]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='prod_container'>
      {products.map((product) => (
        <div key={product.productId} className="prod_main_info">
          <div className="prod_thumb_image">
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              <img src={product.imgUrl} alt={product.productName} className="main_prod_list" />
            </a>
          </div>
          <div className="prod_info">
            <p className="prod_name">{product.productName}</p>
            {product.basePrice && product.price ? (
              <Graph basePrice={product.basePrice} price={product.price} />
            ) : null}
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
  );
}

export default ProductSearchPage;
