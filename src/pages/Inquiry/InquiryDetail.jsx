import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const InquiryDetail = () => {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/api/inquiries/${id}`);
                setInquiry(response.data);
            } catch (error) {
                console.error("Error fetching inquiry:", error);
            }
        };
        fetchInquiry();
    }, [id]);

    if (!inquiry) return <p>Loading...</p>;

    return (
        <div className="inquiry-detail">
            <h1>{inquiry.secret ? "🔒 " : ""}{inquiry.inquiry_title}</h1>
            <p><strong>작성자:</strong> {inquiry.user_id || "익명"}</p>
            <p><strong>작성일:</strong> {new Date(inquiry.inquiry_date).toLocaleString()}</p>
            <div className="inquiry-content">
                <p><strong>문의 내용:</strong></p>
                <p>{inquiry.inquiry}</p>
            </div>
        </div>
    );
};

export default InquiryDetail;
