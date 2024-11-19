import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState"; // Recoil userState 가져오기
import "./styles.css";

const MyPage = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userState); // Recoil 상태 읽기

    // user 정보 추출
    const { userId, name, nickname, email } = user?.user || {};

    return (
        <div className="mypage-container">
            {/* 사용자 정보 섹션 */}
            <div className="user-info">
                <div className="user-avatar-details">
                    <div className="user-avatar">
                        <span role="img" aria-label="avatar">
                            😊
                        </span>
                    </div>
                    <div className="user-details">
                        <h2>{name || "사용자 이름"}</h2>
                        <p>{nickname || "닉네임"}</p>
                        <p>{email || "이메일"}</p>
                    </div>
                </div>
                <div
                    className="settings-icon"
                    onClick={() => navigate("/settings")}
                    title="설정"
                >
                    ⚙️
                </div>
            </div>

            {/* 가로선 */}
            <hr className="divider" />

            {/* 내비게이션 버튼 섹션 */}
            <div className="user-actions">
                <div className="action-item" onClick={() => navigate("/scraps")}>
                    <i className="bi bi-bookmark"></i>
                    <p>관심 상품</p>
                </div>
                <div className="action-item" onClick={() => navigate("/cart")}>
                    <i className="bi bi-cart"></i>
                    <p>관심 레시피</p>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
