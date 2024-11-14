import React, { useEffect, useState, useRef } from 'react';
import BestProduct from './BestProduct.jsx';
import './ProductPage.css';

function ProductItem({ product }) {
  return (
    <li className='prod-ed-item'>
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <div className='prod-item-img'>
          <img src={product.imgUrl} alt={product.productName} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className='prod-item-info'>
          <div className='title'>{product.productName}</div>
          <div className='price'>{product.price}원</div>
        </div>
      </a>
    </li>
  );
}

function ProductSection({ title, query }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8001/shop?query=${encodeURIComponent(query)}`);
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

function ProductPage() {
  return (
    <div>
      <BestProduct/>
      {/* 각 섹션에 대해 title과 query 값을 지정 */}
      <ProductSection title="내 냉장고 유통기한 임박" query="간장" />
      <ProductSection title="이달의 핫딜" query="된장" />
    </div>
  );
}

export default ProductPage;
