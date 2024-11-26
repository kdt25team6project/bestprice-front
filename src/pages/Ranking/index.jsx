import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

const Ranking = () => {
    // 상태 정의: 상위 3개와 그 외 순위
    const [topThree, setTopThree] = useState([]);
    const [otherRanks, setOtherRanks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("inquiry"); // 초기 카테고리를 inquiry로 설정
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 카테고리 변경 시 데이터를 가져오는 함수
    const fetchRankingData = async (category) => {
        try {
            setIsLoading(true); // 로딩 상태 설정
            // 요청 경로 설정
            const endpoint = `http://localhost:8001/rank/${category}`;

            // Axios 요청
            const response = await axios.get(endpoint);
            const data = response.data;

            // 상위 3개와 나머지 4~10위를 분리하여 상태에 저장
            setTopThree(data.slice(0, 3));
            setOtherRanks(data.slice(3, 10));
        } catch (error) {
            console.error("Error fetching ranking data:", error);
        } finally {
            setIsLoading(false); // 로딩 상태 해제
        }
    };

    // 선택된 카테고리가 변경될 때마다 데이터를 다시 가져옴
    useEffect(() => {
        fetchRankingData(selectedCategory);
    }, [selectedCategory]);

    // 카테고리 선택 함수
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleRecipeClick = (recipeItem) => {
        if (recipeItem?.rcpSno) {
            navigate(`/recipe/${recipeItem.rcpSno}`, {
                state: {
                    recipe: recipeItem,
                },
            });
        } else {
            console.error({ recipeItem});
        }
    };

    return (
        <div className="ranking-container">
            {/* Header Buttons */}
            <div className="ranking-header">
                <button className={`header-button ${selectedCategory === "inquiry" ? "selected" : ""}`}
                        onClick={() => handleCategorySelect("inquiry")}>
                    전체 조회수
                </button>
                <button className={`header-button ${selectedCategory === "recommendation" ? "selected" : ""}`}
                        onClick={() => handleCategorySelect("recommendation")}>
                    전체 추천수
                </button>
                <button className={`header-button ${selectedCategory === "weekly_views" ? "selected" : ""}`}
                        onClick={() => handleCategorySelect("weekly_views")}>
                    주간 조회수
                </button>
                <button className={`header-button ${selectedCategory === "weekly_recommendations" ? "selected" : ""}`}
                        onClick={() => handleCategorySelect("weekly_recommendations")}>
                    주간 추천수
                </button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {/* Top 3 Ranking Display */}
                    <Row className="top-three-container">
    {topThree && topThree.length > 2 ? (
        <> 
            {/* 2등 */}
            <Col xs={12} md={4} className="top-item top-item-2 mb-4">
                <Card className="top-card">
                    <Card.Header className="top-card-header">
                        <span className="rank-icon">⭐</span> {topThree[1]?.rank || 2}위
                    </Card.Header>
                    <Card.Img
                        className="top-card-image"
                        variant="top"
                        src={topThree[1]?.imageUrl}
                        alt="Recipe Image"
                    />
                    <Card.Body
                        className="top-card-body"
                        onClick={() => handleRecipeClick(topThree[1])}
                    >
                        <Card.Title className="top-card-title">
                            {topThree[1]?.rcpTtl || "Unknown Title"}
                        </Card.Title>
                        <Card.Text className="top-card-nickname">
                            {topThree[1]?.rgtrNm || "Unknown User"}
                        </Card.Text>
                        <Card.Text className="top-card-stat">
                            {selectedCategory === "inquiry" &&
                                `조회수: ${topThree[1]?.inqCnt || 0}`}
                            {selectedCategory === "recommendation" &&
                                `추천수: ${topThree[1]?.rcmmCnt || 0}`}
                            {selectedCategory === "weekly_views" &&
                                `주간 조회수: ${topThree[1]?.weeklyViews || 0}`}
                            {selectedCategory === "weekly_recommendations" &&
                                `주간 추천수: ${topThree[1]?.weeklyRecommendations || 0}`}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>

            {/* 1등 */}
            <Col xs={12} md={4} className="top-item top-item-1 mb-4">
                <Card className="top-card">
                    <Card.Header className="top-card-header">
                        <span className="rank-icon">⭐</span> {topThree[0]?.rank || 1}위
                    </Card.Header>
                    <Card.Img
                        className="top-card-image"
                        variant="top"
                        src={topThree[0]?.imageUrl}
                        alt="Recipe Image"
                    />
                    <Card.Body
                        className="top-card-body"
                        onClick={() => handleRecipeClick(topThree[0])}
                    >
                        <Card.Title className="top-card-title">
                            {topThree[0]?.rcpTtl || "Unknown Title"}
                        </Card.Title>
                        <Card.Text className="top-card-nickname">
                            {topThree[0]?.rgtrNm || "Unknown User"}
                        </Card.Text>
                        <Card.Text className="top-card-stat">
                            {selectedCategory === "inquiry" &&
                                `조회수: ${topThree[0]?.inqCnt || 0}`}
                            {selectedCategory === "recommendation" &&
                                `추천수: ${topThree[0]?.rcmmCnt || 0}`}
                            {selectedCategory === "weekly_views" &&
                                `주간 조회수: ${topThree[0]?.weeklyViews || 0}`}
                            {selectedCategory === "weekly_recommendations" &&
                                `주간 추천수: ${topThree[0]?.weeklyRecommendations || 0}`}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>

            {/* 3등 */}
            <Col xs={12} md={4} className="top-item top-item-3 mb-4">
                <Card className="top-card">
                    <Card.Header className="top-card-header">
                        <span className="rank-icon">⭐</span> {topThree[2]?.rank || 3}위
                    </Card.Header>
                    <Card.Img
                        className="top-card-image"
                        variant="top"
                        src={topThree[2]?.imageUrl}
                        alt="Recipe Image"
                    />
                    <Card.Body
                        className="top-card-body"
                        onClick={() => handleRecipeClick(topThree[2])}
                    >
                        <Card.Title className="top-card-title">
                            {topThree[2]?.rcpTtl || "Unknown Title"}
                        </Card.Title>
                        <Card.Text className="top-card-nickname">
                            {topThree[2]?.rgtrNm || "Unknown User"}
                        </Card.Text>
                        <Card.Text className="top-card-stat">
                            {selectedCategory === "inquiry" &&
                                `조회수: ${topThree[2]?.inqCnt || 0}`}
                            {selectedCategory === "recommendation" &&
                                `추천수: ${topThree[2]?.rcmmCnt || 0}`}
                            {selectedCategory === "weekly_views" &&
                                `주간 조회수: ${topThree[2]?.weeklyViews || 0}`}
                            {selectedCategory === "weekly_recommendations" &&
                                `주간 추천수: ${topThree[2]?.weeklyRecommendations || 0}`}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </>
    ) : (
        <div>No Data Available</div>
    )}
</Row>

                    {/* Divider */}
                    <hr className="divider" />

                    {/* Other Rankings */}
                    <div className="other-ranks-container">
                        {otherRanks && otherRanks.length > 0 ? (
                            otherRanks.map((item, index) => (
                                <div key={item?.rcpSno || index} className="rank-item" onClick={() => handleRecipeClick(item)}>
                                    <div className="rank-number">{index + 4}</div> {/* 4위부터 시작 */}
                                    <div className="rank-title">{item?.rcpTtl || "Unknown Title"}</div>
                                    <div className="rank-nickname">{item?.rgtrNm || "Unknown User"}</div>
                                    <div className="rank-stat">
                                        {selectedCategory === "inquiry" && `조회수: ${item?.inqCnt || 0}`}
                                        {selectedCategory === "recommendation" && `추천수: ${item?.rcmmCnt || 0}`}
                                        {selectedCategory === "weekly_views" && `주간 조회수: ${item?.weeklyViews || 0}`}
                                        {selectedCategory === "weekly_recommendations" && `주간 추천수: ${item?.weeklyRecommendations || 0}`}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No Data Available</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Ranking;
