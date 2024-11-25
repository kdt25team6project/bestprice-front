import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function TipsPage() {
  const [memo, setMemo] = useState([]); // 저장된 메모 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [tips, setTips] = useState([]); // 팁 목록 상태
  const tipsPerPage = 5;

  // 팁 목록 가져오기
  useEffect(() => {
    console.log("팁 목록 가져오기 시작");

    // 팁 목록 가져오기
    axios
      .get("http://localhost:8001/api/tips")
      .then((response) => {
        console.log("팁 목록 가져오기 성공:", response.data);
        setTips(response.data);

        // 로컬 스토리지에서 저장된 메모 불러오기
        const savedMemo = JSON.parse(localStorage.getItem("memo")) || [];
        const savedTips = response.data.filter((tip) =>
          savedMemo.includes(tip.tipId)
        );
        setMemo(savedTips);
      })
      .catch((error) => {
        console.error("팁 목록 가져오기 실패:", error);
      });
  }, []);

  // 검색어 업데이트 함수
  const handleSearch = (value) => {
    setSearchTerm(value); // 검색어 상태 업데이트
  };

  // 좋아요 추가/삭제 함수
  const toggleRecommendation = (id) => {
    const isAlreadyRecommended = memo.some((tip) => tip.tipId === id);

    if (isAlreadyRecommended) {
      // 좋아요 삭제
      const updatedMemo = memo.filter((tip) => tip.tipId !== id);
      setMemo(updatedMemo);

      // 로컬 스토리지 업데이트
      localStorage.setItem(
        "memo",
        JSON.stringify(updatedMemo.map((tip) => tip.tipId))
      );

      setTips((prevTips) =>
        prevTips.map((tip) =>
          tip.tipId === id
            ? { ...tip, recommendation: tip.recommendation - 1 }
            : tip
        )
      );

      alert("팁이 메모에서 삭제되었습니다.");
    } else {
      const selectedTip = tips.find((tip) => tip.tipId === id);
      if (selectedTip) {
        const updatedMemo = [...memo, selectedTip];
        setMemo(updatedMemo);

        // 로컬 스토리지 업데이트
        localStorage.setItem(
          "memo",
          JSON.stringify(updatedMemo.map((tip) => tip.tipId))
        );

        setTips((prevTips) =>
          prevTips.map((tip) =>
            tip.tipId === id
              ? { ...tip, recommendation: tip.recommendation + 1 }
              : tip
          )
        );

        alert("팁이 메모에 저장되었습니다.");
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
      {/* 상단 영역 */}
      <div className="top-container container my-5">
        <h1 className="tips-title mb-4">🔍 생활팁 검색</h1>

        {/* 검색 바 */}
        <input
          type="text"
          className="form-control mb-4 search-bar-input"
          placeholder="검색어를 입력하세요."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* 저장된 메모 보기 */}
      <div className="memo-container container my-5">
        <h2 className="tips-title mb-4">📋 좋아요 팁 목록</h2>
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
        <h2 className="tips-title mb-4">✨ 생활팁 전체보기</h2>
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
              {/* 하트 버튼 */}
              <button
                className="btn"
                onClick={() => toggleRecommendation(tip.tipId)}
                style={{
                  fontSize: "1.5rem",
                  color: memo.some((savedTip) => savedTip.tipId === tip.tipId)
                    ? "red"
                    : "gray",
                }}
              >
                {memo.some((savedTip) => savedTip.tipId === tip.tipId)
                  ? "❤️"
                  : "🤍"}
              </button>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <nav className="mt-4">
		<ul className="pagination justify-content-center">
			{/* 이전 그룹 이동 */}
			<li
			className={`page-item ${
				currentPage <= 5 ? "disabled" : ""
			}`}
			>
			<button
				className="page-link"
				onClick={() =>
				handlePageChange(
					Math.max(1, Math.floor((currentPage - 1) / 5) * 5)
				)
				}
			>
				&laquo;
			</button>
			</li>

			{/* 현재 그룹의 최대 5개 페이지 표시 */}
			{Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
			const pageNumber =
				Math.floor((currentPage - 1) / 5) * 5 + index + 1;
			return (
				pageNumber <= totalPages && (
				<li
					key={pageNumber}
					className={`page-item ${
					currentPage === pageNumber ? "active" : ""
					}`}
				>
					<button
					className="page-link"
					onClick={() => handlePageChange(pageNumber)}
					>
					{pageNumber}
					</button>
				</li>
				)
			);
			})}

			{/* 다음 그룹 이동 */}
			<li
			className={`page-item ${
				Math.floor((currentPage - 1) / 5) * 5 + 6 > totalPages
				? "disabled"
				: ""
			}`}
			>
			<button
				className="page-link"
				onClick={() =>
				handlePageChange(
					Math.min(
					totalPages,
					Math.floor((currentPage - 1) / 5) * 5 + 6
					)
				)
				}
			>
				&raquo;
			</button>
			</li>
		</ul>
		</nav>
      </div>
    </div>
  );
}

export default TipsPage;