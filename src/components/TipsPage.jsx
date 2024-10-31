import React, { useState } from 'react';
import { tips } from '../TipsData.js';
import '../css/TipsPage.css';

function TipsPage() {
  const [likes, setLikes] = useState(tips.reduce((acc, tip) => {
    acc[tip.id] = 0;
    return acc;
  }, {}));

  const handleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] + 1,
    }));
  };

  return (
    <div className="tips-page container my-5">
      <h1 className="mb-4">자취 꿀팁 모음</h1>
      <div className="list-group">
        {tips.map((tip) => (
          <div key={tip.id} className="list-group-item list-group-item-action mb-2 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{tip.title}</h5>
              <p className="mb-1">{tip.content}</p>
            </div>
            <div className="like-section">
              <button className="like-button" onClick={() => handleLike(tip.id)}>
                ❤️
              </button>
              <span className="like-count">{likes[tip.id]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TipsPage;
