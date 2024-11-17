import React, { useEffect, useState } from 'react';
import './BestProduct.css';

const BestProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8001/shop?query=%EC%82%AC%EA%B3%BC'); // API 엔드포인트
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
        <h2>인기 있는 베스트상품</h2>
      </div>
      <ul className="prdList grid4 clear">
        {products.slice(0, 5).map((product, index) => (
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

export default BestProduct;