import React, { useState } from "react";
import { tips } from "../../assets/TipsData.js"
import "./styles.css";

function TipsPage() {
	const [memo, setMemo] = useState([]);
	const [selectedTips, setSelectedTips] = useState([]);
	const [isMemoVisible, setIsMemoVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState(""); // TipsPage에서만 사용할 검색어 상태
	const [currentPage, setCurrentPage] = useState(1);
	const tipsPerPage = 5;
  
	// 검색어 업데이트 함수
	const handleSearch = (value) => {
	  setSearchTerm(value); // 검색어 업데이트
	};
  
	// 팁 선택 토글
	const handleSelectTip = (id) => {
	  setSelectedTips((prevSelected) =>
		prevSelected.includes(id)
		  ? prevSelected.filter((tipId) => tipId !== id)
		  : [...prevSelected, id]
	  );
	};
  
	// 메모 저장
	const handleSaveToMemo = () => {
	  const selectedMemoTips = tips.filter((tip) => selectedTips.includes(tip.id));
	  setMemo((prevMemo) => [...prevMemo, ...selectedMemoTips]);
	  setSelectedTips([]);
	  alert("선택한 팁이 메모에 저장되었습니다.");
	};
  
	// 메모 보이기/닫기
	const toggleMemoVisibility = () => {
	  setIsMemoVisible(!isMemoVisible);
	};
  
	// 메모 삭제
	const handleDeleteMemo = (id) => {
	  setMemo((prevMemo) => prevMemo.filter((tip) => tip.id !== id));
	};
  
	// 팁 검색
	const filteredTips = tips.filter((tip) =>
	  tip.title.toLowerCase().includes(searchTerm.toLowerCase())
	);
  
	// 페이지 계산
	const indexOfLastTip = currentPage * tipsPerPage;
	const indexOfFirstTip = indexOfLastTip - tipsPerPage;
	const currentTips = filteredTips.slice(indexOfFirstTip, indexOfLastTip);
	const totalPages = Math.ceil(filteredTips.length / tipsPerPage);
  
	// 페이지 변경
	const handlePageChange = (pageNumber) => {
	  setCurrentPage(pageNumber);
	};
  
	return (
	  <div className="tips-container">

		{/* 상단 영역 */}
		<div className="top-container container my-5">
		  <h1 className="tips-title mb-4">✨ 생활팁 검색하기</h1>
  
		  {/* TipsPage의 검색 바 */}
		  <input
			type="text"
			className="form-control mb-4 search-bar-input"
			placeholder="검색어를 입력하세요."
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)} // TipsPage 내에서만 상태 업데이트
		  />
  
		  <div className="d-flex justify-content-center gap-4 mb-4">
			<button 
			  onClick={handleSaveToMemo}
			  className="btn btn-success"
			  disabled={selectedTips.length === 0}
			>
			  메모에 저장하기 ({selectedTips.length})
			</button>
			<button
			  onClick={toggleMemoVisibility}
			  className={`custom-toggle-btn ${isMemoVisible ? 'close-btn' : 'view-btn'}`}
			>
			  {isMemoVisible ? "저장된 메모 닫기" : "저장된 메모 보기"}
			</button>
		  </div>
		</div>
  
		{/* 저장된 메모 보기 */}
		{isMemoVisible && (
		  <div className="memo-container container my-5">
			<h2 className="tips-title mb-4">📋 저장된 메모</h2>
			{memo.length > 0 ? (
			  <div className="list-group">
				{memo.map((tip) => (
				  <div
					key={tip.id}
					className="list-group-item d-flex justify-content-between align-items-center"
				  >
					<div>
					  <h5>{tip.title}</h5>
					  <p>{tip.content}</p>
					</div>
					<button
					  onClick={() => handleDeleteMemo(tip.id)}
					  className="btn btn-danger"
					>
					  삭제
					</button>
				  </div>
				))}
			  </div>
			) : (
			  <p>저장된 메모가 없습니다.</p>
			)}
		  </div>
		)}
  
		{/* 하단 영역 */}
		<div className="bottom-container container my-5">
		  <h2 className="tips-title mb-4">📋 생활팁 전체보기</h2>
		  <div className="list-group">
			{currentTips.map((tip) => (
			  <div key={tip.id} className="list-group-item">
				<div className="tip-details">
				  <h5>{tip.title}</h5>
				  <p>{tip.content}</p>
				</div>
				<input
				  type="checkbox"
				  checked={selectedTips.includes(tip.id)}
				  onChange={() => handleSelectTip(tip.id)}
				/>
			  </div>
			))}
		  </div>
  
		  {/* 페이지네이션 */}
		  <nav className="mt-4">
			<ul className="pagination justify-content-center">
			  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
				<button
				  className="page-link"
				  onClick={() => handlePageChange(currentPage - 1)}
				>
				  &laquo;
				</button>
			  </li>
			  {Array.from({ length: totalPages }, (_, index) => (
				<li
				  key={index}
				  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
				>
				  <button
					className="page-link"
					onClick={() => handlePageChange(index + 1)}
				  >
					{index + 1}
				  </button>
				</li>
			  ))}
			  <li
				className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
			  >
				<button
				  className="page-link"
				  onClick={() => handlePageChange(currentPage + 1)}
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
