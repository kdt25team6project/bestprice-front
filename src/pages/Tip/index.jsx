import React, { useState, useEffect } from "react";
import axios from "axios";
import { userState } from "../../state/userState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "./styles.css";

axios.defaults.baseURL = "http://localhost:8001";

function TipsPage() {
	const { user } = useRecoilValue(userState); // 로그인 상태와 유저 정보
	const isLoggedIn = user && user.userId ? true : false; // 로그인 여부 확인
	const userId = user?.userId; // 유저 ID

	const setUser = useSetRecoilState(userState); // 로그인 상태를 업데이트 할 수 있는 setUser 함수

	const [memo, setMemo] = useState([]); // 저장된 메모 상태
	const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
	const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
	const [tips, setTips] = useState([]); // 팁 목록 상태
	const tipsPerPage = 5;
	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber); // 현재 페이지 상태 업데이트
	};

	// 로컬스토리지에서 사용자 정보 복원 및 로그인 상태 업데이트
	useEffect(() => {
		const storedUser = localStorage.getItem("userLocal");
		if (storedUser) {
			const userInfo = JSON.parse(storedUser);
			setUser({
				isLoggedIn: true,
				user: userInfo.user, // 사용자 정보 복원
			});
		}
	}, [setUser]);

	// 팁 목록 가져오기 및 로그인 상태 반영
	useEffect(() => {
		axios
			.get("/api/tips") // 팁 목록 가져오기
			.then((response) => {
				setTips(response.data);

				// 로그인 상태일 경우 사용자 좋아요 목록 가져오기
				if (isLoggedIn && userId) {
					axios
						.get(`/api/tips/likes?userId=${userId}`) // 사용자 좋아요 목록 가져오기
						.then((res) => {
							const likedTipIds = res.data;
							const likedTips = response.data.filter((tip) =>
								likedTipIds.includes(tip.tipId)
							);
							setMemo(likedTips);
						})
						.catch((error) => {
							console.error("사용자 좋아요 목록 가져오기 실패:", error);
						});
				} else {
					setMemo([]); // 로그아웃 상태에서는 좋아요 목록 초기화
				}
			})
			.catch((error) => {
				console.error("팁 목록 가져오기 실패:", error);
			});
	}, [isLoggedIn, userId]); // 로그인 상태와 사용자 ID가 변경될 때마다 실행

	// 좋아요 추가/삭제 함수
	const toggleRecommendation = (id) => {
		if (!isLoggedIn) {
			alert("로그인을 해주세요.");
			return;
		}

		const isAlreadyRecommended = memo.some((tip) => tip.tipId === id);

		if (isAlreadyRecommended) {
			// 좋아요 삭제
			const updatedMemo = memo.filter((tip) => tip.tipId !== id);
			setMemo(updatedMemo);

			axios
				.delete(`/api/tips/like`, {
					params: { userId, tipId: id },
				})
				.then(() => {
					setTips((prevTips) =>
						prevTips.map((tip) =>
							tip.tipId === id
								? { ...tip, recommendation: tip.recommendation - 1 }
								: tip
						)
					);
				})
				.catch((error) => {
					console.error("좋아요 삭제 실패:", error);
				});
		} else {
			const selectedTip = tips.find((tip) => tip.tipId === id);
			if (selectedTip) {
				const updatedMemo = [...memo, selectedTip];
				setMemo(updatedMemo);

				axios
					.post(`/api/tips/like`, null, {
						params: { userId, tipId: id },
					})
					.then(() => {
						setTips((prevTips) =>
							prevTips.map((tip) =>
								tip.tipId === id
									? { ...tip, recommendation: tip.recommendation + 1 }
									: tip
							)
						);
					})
					.catch((error) => {
						console.error("좋아요 추가 실패:", error);
					});
			}
		}
	};

	// 팁 검색 필터링
	const filteredTips = tips.filter((tip) =>
		tip.tipTitle.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// 페이지 계산
	const indexOfLastTip = currentPage * tipsPerPage;
	const indexOfFirstTip = indexOfLastTip - tipsPerPage;
	const currentTips = filteredTips.slice(indexOfFirstTip, indexOfLastTip);
	const totalPages = Math.ceil(filteredTips.length / tipsPerPage);

	// 페이지 변경 함수
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className="tips-container">
			{/* 저장된 메모 보기 */}
			<div className="memo-container container my-5">
				<h2 className="tips-title mb-4"> 좋아요 팁 목록 📋</h2>
				{memo.length > 0 ? (
					<div className="list-group">
						{memo.map((tip) => (
							<div
								key={tip.tipId}
								className="list-group-item d-flex justify-content-between align-items-center"
							>
								<div>
									<h5>{tip.tipTitle}</h5>
									<p>{tip.tips}</p>
								</div>
								<button
									onClick={() => toggleRecommendation(tip.tipId)}
									className="btn btn-danger"
								>
									삭제
								</button>
							</div>
						))}
					</div>
				) : (
					<p>아직 좋아요를 누른 생활팁이 없습니다.</p>
				)}
			</div>

			{/* 하단 영역 */}
			<div className="bottom-container container my-5">
				{/* 제목과 검색창을 나란히 배치 */}
				<div className="search-bar-container">
					<h2 className="tips-title">생활팁 전체보기 ✨</h2>
					{/* 검색 입력란 */}
					<input
						type="text"
						className="search-bar-input"
						placeholder="검색어를 입력하세요." // 입력 필드 안내 문구
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)} // 입력값 변경 시 상태 업데이트
					/>
				</div>

				{/* 팁 목록 표시 */}
				<div className="list-group">
					{currentTips.map((tip) => (
						<div
							key={tip.tipId}
							className="list-group-item d-flex justify-content-between align-items-center"
						>
							<div>
								<h5>{tip.tipTitle}</h5>
								<p>{tip.tips}</p>
							</div>
							{/* 좋아요(하트) 버튼 */}
							<button
								className="btn"
								onClick={() => toggleRecommendation(tip.tipId)} // 좋아요 토글 함수 호출
								style={{
									fontSize: "1.5rem", 
									color: memo.some((savedTip) => savedTip.tipId === tip.tipId)
										? "red"
										: "gray", 
								}}
							>
								{memo.some((savedTip) => savedTip.tipId === tip.tipId)
									? "❤️"
									: "🤍"}{" "}
							</button>
						</div>
					))}
				</div>

				{/* 페이지네이션 */}
				<nav aria-label="Page navigation example">
					<ul className="pagination justify-content-center mt-4">
						{/* 이전 그룹으로 이동 */}
						<li className={`page-item ${currentPage <= 5 ? "disabled" : ""}`}>
							<button
								className="page-link"
								onClick={() =>
									paginate(Math.max(1, Math.floor((currentPage - 1) / 5) * 5))
								}
								aria-label="Previous"
							>
								<span aria-hidden="true">&laquo;</span>
							</button>
						</li>

						{/* 최대 5페이지 표시 */}
						{Array.from({ length: 5 }, (_, i) => {
							const pageNumber = Math.floor((currentPage - 1) / 5) * 5 + i + 1;
							if (pageNumber <= totalPages) {
								return (
									<li
										key={pageNumber}
										className={`page-item ${
											currentPage === pageNumber ? "active" : ""
										}`}
									>
										<button
											className="page-link"
											onClick={() => paginate(pageNumber)}
										>
											{pageNumber}
										</button>
									</li>
								);
							}
							return null;
						})}

						{/* 다음 그룹으로 이동 */}
						<li
							className={`page-item ${
								Math.floor((currentPage - 1) / 5) * 5 + 5 >= totalPages
									? "disabled"
									: ""
							}`}
						>
							<button
								className="page-link"
								onClick={() =>
									paginate(
										Math.min(
											totalPages,
											Math.floor((currentPage - 1) / 5) * 5 + 6
										)
									)
								}
								aria-label="Next"
							>
								<span aria-hidden="true">&raquo;</span>
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default TipsPage;
