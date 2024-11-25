import React from "react";
import "./Footer.css"; // 풋터 스타일을 위한 CSS 파일

const Footer = () => {
	return (
		<footer className="custom-footer">
			<div className="footer-container">
				<div className="footer-column">
					<h5 className="footer-title">Cook! Cook!</h5>
					<p className="footer-description">
						다양한 요리 레시피를 기반으로
						<br /> 식재료의 가격 비교 및
						<br /> 나만의 냉장고 서비스를 제공합니다.
					</p>
				</div>

				<div className="footer-column">
					<h5 className="footer-title">바로가기</h5>
					<ul className="footer-links">
						<li>
							<a href="/products" className="footer-link">
								상품
							</a>
						</li>
						<li>
							<a href="/search-results" className="footer-link">
								레시피
							</a>
						</li>
						<li>
							<a href="/tips" className="footer-link">
								생활팁
							</a>
						</li>
						<li>
							<a href="/rank" className="footer-link">
								레시피 랭킹
							</a>
						</li>
						<li>
							<a href="/myfridge" className="footer-link">
								나만의 냉장고
							</a>
						</li>
					</ul>
				</div>

				<div className="footer-column">
					<h5 className="footer-title">고객지원</h5>
					<ul className="footer-links">
						<li>
							<a href="/inquiries" className="footer-link">
								문의하기
							</a>
						</li>
						<li>
							<a href="#" className="footer-link">
								인스타그램
							</a>
						</li>
						<li>
							<a href="#" className="footer-link">
								블로그
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer-bottom">
				<p>&copy; 2024 Cook Cook. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
