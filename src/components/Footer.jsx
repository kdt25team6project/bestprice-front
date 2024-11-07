import React from 'react';
import '../css/Footer.css'; // 풋터 스타일을 위한 CSS 파일

function Footer() {
  return (
    <footer className="footer bg-body-tertiary py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="text-success">Best Price</h5>
            <p>이 사이트는 다양한 요리 레시피를 제공하고 식재료의 가격 비교 서비스를 제공합니다.</p>
          </div>

          <div className="col-md-4">
            <h5 className="text-success">footer 테스트</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="footer-link">소개</a></li>
              <li><a href="/tips" className="footer-link">자취 꿀팁</a></li>
              <li><a href="/recipes" className="footer-link">레시피</a></li>
              <li><a href="/contact" className="footer-link">문의하기</a></li>
            </ul>
          </div>

          {/* 세 번째 컬럼: 소셜 미디어 */}
          <div className="col-md-4">
            <h5 className="text-success">SNS</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">인스타그램</a></li>
              <li><a href="#" className="footer-link">카페</a></li>
              <li><a href="#" className="footer-link">X</a></li>
            </ul>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="text-center mt-4">
          <p>&copy; 2024 Best Price Project.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;