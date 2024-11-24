import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import AnswerForm from "./AnswerForm";
import "./styles.css";

const InquiryDetail = () => {
	const { id } = useParams();
	const user = useRecoilValue(userState);
    const navigate = useNavigate(); // useNavigate 추가
	const [inquiry, setInquiry] = useState(null);
	const [showAnswerForm, setShowAnswerForm] = useState(false);

	const fetchInquiry = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8001/api/inquiries/${id}`
			);
			const inquiryData = {
				inquiryId: response.data.inquiryId || "알 수 없음",
				inquiryTitle: response.data.inquiryTitle || "제목 없음",
				inquiry: response.data.inquiry || "내용 없음",
				inquiryDate: response.data.inquiryDate,
				inquiryType: response.data.inquiryType,
				secret: response.data.secret || false,
				userId: response.data.userId || "익명",
				answer: response.data.answer || "아직 답변이 없습니다.",
			};

			// 비밀글 접근 제어: 로그인하지 않았거나, 작성자나 관리자가 아닌 경우
			if (
				inquiryData.secret &&
				(!user?.user?.userId ||
					(user.user.userId !== inquiryData.userId &&
						user.user.role !== "MANAGER"))
			) {
				alert("비밀글은 작성자와 관리자만 볼 수 있습니다.");
                navigate("/inquiries");
				return;
			}

			setInquiry(inquiryData);
		} catch (error) {
			console.error("Error fetching inquiry:", error);
		}
	};

	useEffect(() => {
		fetchInquiry();
	}, [id, user?.user?.userId, user?.user?.role]);

	const handleAnswerSubmit = async (answer) => {
		try {
			await axios.post(`http://localhost:8001/api/inquiries/${id}/answer`, {
				answer,
			});
			alert("답변이 등록되었습니다.");
			setShowAnswerForm(false);
			fetchInquiry(); // 업데이트된 문의를 다시 가져옵니다.
		} catch (error) {
			console.error("Error submitting answer:", error);
			alert("답변 등록 중 오류가 발생했습니다.");
		}
	};

	const handleDelete = async () => {
		if (window.confirm("정말 삭제하시겠습니까?")) {
			try {
				await axios.delete(`http://localhost:8001/api/inquiries/${id}`);
				alert("문의가 삭제되었습니다.");
				window.location.href = "/inquiries";
			} catch (error) {
				console.error("Error deleting inquiry:", error);
				alert("문의 삭제 중 오류가 발생했습니다.");
			}
		}
	};

	if (!inquiry) return <p>Loading...</p>;

	return (
		<div className="inquiry-detail-container">
			<div className="inquiry-detail">
				<h1>{inquiry.inquiryTitle}</h1>
				<p>
					<strong>작성자:</strong> {inquiry.userId}
				</p>
				<p>
					<strong>작성일:</strong>{" "}
					{new Date(inquiry.inquiryDate).toLocaleString()}
				</p>
				<p>
					<strong>문의 상태:</strong> {inquiry.inquiryType}
				</p>
				<hr />
				<div className="inquiry-content">
					<strong>문의 내용:</strong>
					<p>{inquiry.inquiry}</p>
				</div>
				<div className="inquiry-answer">
					<strong>답변:</strong>
					<p>{inquiry.answer}</p>
				</div>

				{/* 답변 작성 버튼: 관리자만 표시 */}
				{user?.user?.role === "MANAGER" && (
					<button
						onClick={() => setShowAnswerForm(true)}
						className="answer-button"
					>
						답변 작성
					</button>
				)}

				{/* 삭제 버튼: 작성자나 관리자만 표시 */}
				{user?.user?.userId === inquiry.userId ||
				user?.user?.role === "MANAGER" ? (
					<button onClick={handleDelete} className="delete-button">
						삭제
					</button>
				) : null}

				{/* 답변 작성 폼 */}
				{showAnswerForm && (
					<AnswerForm
						onSubmit={(answer) => handleAnswerSubmit(answer)}
						onClose={() => setShowAnswerForm(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default InquiryDetail;
