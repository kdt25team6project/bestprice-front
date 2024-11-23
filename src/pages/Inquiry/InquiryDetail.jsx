import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const InquiryDetail = () => {
    const { id } = useParams(); // URL 파라미터에서 `id` 가져옴
    const [inquiry, setInquiry] = useState(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/api/inquiries/${id}`);

                // 데이터 매핑 및 기본값 처리
                const inquiryData = {
                    inquiryId: response.data.inquiryId || response.data.inquiry_id || "알 수 없음",
                    inquiryTitle: response.data.inquiryTitle || response.data.inquiry_title || "제목 없음",
                    inquiry: response.data.inquiry || "내용 없음",
                    inquiryDate:
                        response.data.inquiryDate || response.data.inquiry_date
                            ? new Date(response.data.inquiryDate || response.data.inquiry_date).toLocaleString()
                            : "날짜 없음",
                    inquiryType: response.data.inquiryType || response.data.inquiry_type || "유형 없음",
                    secret: response.data.secret || false,
                    userId: response.data.userId || response.data.user_id || "익명",
                };

                setInquiry(inquiryData);
            } catch (error) {
                console.error("Error fetching inquiry:", error);
            }
        };
        fetchInquiry();
    }, [id]);

    if (!inquiry) return <p>Loading...</p>;

    return (
        <div className="inquiry-detail-container">
            <div className="inquiry-detail">
                <h1 className="inquiry-title">
                    {inquiry.secret ? "🔒 " : ""}
                    {inquiry.inquiryTitle}
                </h1>
                <p className="inquiry-meta">
                    <strong>작성자:</strong> {inquiry.userId} &nbsp;|&nbsp;
                    <strong>작성일:</strong> {inquiry.inquiryDate}
                </p>
                <hr className="divider" />
                <div className="inquiry-content">
                    <p>
                        <strong>문의 내용:</strong>
                    </p>
                    <p>{inquiry.inquiry}</p>
                </div>
            </div>
        </div>
    );
};

export default InquiryDetail;
