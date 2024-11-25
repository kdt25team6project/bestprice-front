import React from "react";
import "./Footer.css"; // 풋터 스타일을 위한 CSS 파일

const Footer = () => {
	return (
		<footer className="footer bg-body-tertiary py-4 mt-5">
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<h5 className="text-success">Cook! Cook!</h5>
						<p>
							다양한 요리 레시피를 기반으로<br></br>식재료의 가격 비교 및<br></br>나만의 냉장고 서비스를 제공합니다.
						</p>
					</div>

					<div className="col-md-4">
						<h5 className="text-success">바로가기</h5>
						<ul className="list-unstyled">
							<li>
								<a href="products" className="footer-link">
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

					<div className="col-md-4">
						<h5 className="text-success">고객지원</h5>
						<ul className="list-unstyled">
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

				<div className="text-center mt-4">
					<p>&copy; 2024. Cook Cook. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
