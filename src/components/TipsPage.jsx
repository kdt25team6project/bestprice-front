import React, { useState } from 'react';
import { tips } from '../TipsData.js';
import Footer from './Footer';
import '../css/TipsPage.css';
import '../css/Header.css';
import Header from './Header';

function TipsPage() {
  const [likes, setLikes] = useState(
    tips.reduce((acc, tip) => {
      acc[tip.id] = 0;
      return acc;
    }, {})
  );
  
  const [memo, setMemo] = useState([]); 
  const [selectedTips, setSelectedTips] = useState([]); 
  const [isMemoVisible, setIsMemoVisible] = useState(false); 

  // 좋아요 기능
  const handleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] + 1,
    }));
  };

  // 체크박스 선택 기능
  const handleSelectTip = (id) => {
    setSelectedTips((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((tipId) => tipId !== id)
        : [...prevSelected, id] 
    );
  };

  // 메모에 선택된 팁 저장
  const handleSaveToMemo = () => {
    const selectedMemoTips = tips.filter((tip) => selectedTips.includes(tip.id));
    setMemo(selectedMemoTips);
    setIsMemoVisible(true);
  };

  // 메모 열고 닫기
  const toggleMemoVisibility = () => {
    setIsMemoVisible(!isMemoVisible);
  };

  // 개별 메모 삭제
  const handleDeleteMemo = (id) => {
    setMemo(memo.filter((tip) => tip.id !== id));
  };

  return (
    <div className="container">
      {/* Header 컴포넌트 추가 */}
      <Header />

      <div className="tips-page container my-5">
        <h1 className="tips-title mb-4">✨자취 꿀팁 모음</h1>

        <div className="d-flex justify-content-end mb-4">
          {/* 메모에 저장하기 버튼 */}
          <button 
            onClick={handleSaveToMemo}
            className="btn btn-success me-2" /* 초록색 버튼 */
            disabled={selectedTips.length === 0} // 선택된 팁이 없으면 비활성화
          >
            메모에 저장하기 ({selectedTips.length})
          </button>

          {/* 메모 열고 닫기 버튼 */}
          <button 
            onClick={toggleMemoVisibility} 
            className={`btn btn-success`} /* 초록색으로 변경 */
          >
            {isMemoVisible ? '메모 닫기' : '저장된 메모 보기'}
          </button>
        </div>

        {/* 저장된 메모 */}
        {isMemoVisible && memo.length > 0 && (
          <div className={`memo-section mb-4`}>
            <h3>저장된 메모</h3>
            {memo.map((tip) => (
              <div key={tip.id} className="list-group-item mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <h5>{tip.title}</h5>
                  <p>{tip.content}</p>
                </div>
                {/* 메모 삭제 버튼 */}
                <button 
                  onClick={() => handleDeleteMemo(tip.id)} 
                  className="btn btn-danger btn-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="list-group">
          {tips.map((tip) => (
            <div key={tip.id} className="list-group-item list-group-item-action mb-2">
            <div className="tip-content">
              <input
                type="checkbox"
                checked={selectedTips.includes(tip.id)}
                onChange={() => handleSelectTip(tip.id)}
                style={{ transform: 'scale(1.5)', accentColor: '#28a745' }}
              />
              <div className="tip-details">
                <h5 className="mb-1">{tip.title}</h5>
                <p className="mb-1">{tip.content}</p>
              </div>
            </div>
            
            {/* 좋아요 버튼 */}
            <div className="like-section">
              <button className="like-button" onClick={() => handleLike(tip.id)}>
                ❤️
              </button>
              <span className="like-count">{likes[tip.id]}</span>
            </div>
          </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TipsPage;