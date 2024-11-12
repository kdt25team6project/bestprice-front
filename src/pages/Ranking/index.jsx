import React from "react";
import "./styles.css";

const Ranking = () => {
	const topThree = [
		{
			rank: 1,
			color: "#FFD700",
			label: "추천수",
			icon: "⭐",
			bgColor: "#FFF5CC",
		},
		{
			rank: 2,
			color: "#C0C0C0",
			label: "조회수",
			icon: "⭐",
			bgColor: "#E6E6E6",
		},
		{
			rank: 3,
			color: "#FF8C00",
			label: "리뷰수",
			icon: "⭐",
			bgColor: "#FFE6CC",
		},
	];

	const otherRanks = [4, 5, 6, 7, 8, 9, 10];

	return (
		<div className="ranking-container">
			{/* Header Buttons */}
			<div className="ranking-header">
				<button className="header-button views">조회수</button>
				<button className="header-button recommends">추천수</button>
				<button className="header-button reviews">리뷰수</button>
			</div>

			{/* Top 3 Ranking Display */}
			<div className="top-three-container">
				{topThree.map((item, index) => (
					<div
						key={index}
						className="top-item"
						style={{ backgroundColor: item.bgColor }}
					>
						<span className="rank-icon" style={{ color: item.color }}>
							{item.icon}
						</span>
						<div className="rank-number" style={{ color: item.color }}>
							{item.rank}
						</div>
					</div>
				))}
			</div>

			{/* Divider */}
			<hr className="divider" />

			{/* Other Rankings */}
			<div className="other-ranks-container">
				{otherRanks.map((rank) => (
					<div key={rank} className="rank-item">
						<div className="rank-avatar">👤</div>
						<div className="rank-label">{rank}</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Ranking;
