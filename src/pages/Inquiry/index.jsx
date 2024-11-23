import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import InquiryForm from "./InquiryForm"; // InquiryForm 추가
import "./styles.css";

const InquiryList = () => {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false); // InquiryForm 표시 상태

    const fetchInquiries = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/inquiries`, {
                params: { page },
            });
            setInquiries(response.data.content); // 목록 데이터
            setTotalPages(response.data.totalPages); // 총 페이지 수
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        }
    };

    useEffect(() => {
        fetchInquiries(currentPage);
    }, [currentPage]);

    // InquiryForm 제출 완료 후 목록 갱신
    const handleFormSubmit = () => {
        setShowForm(false); // 폼 닫기
        fetchInquiries(currentPage); // 목록 갱신
    };

    if (showForm) {
        // 글쓰기 버튼 클릭 시 InquiryForm만 표시
        return (
            <InquiryForm
                onClose={() => setShowForm(false)}
                onSubmitSuccess={handleFormSubmit}
            />
        );
    }

    return (
        <div className="inquiry-list-container">
            <h1>Q&A</h1>
            <div className="inquiry-actions">
                <button className="write-button" onClick={() => setShowForm(true)}>
                    글쓰기
                </button>
            </div>
            <table className="inquiry-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>작성시간</th>
                    </tr>
                </thead>
                <tbody>
                    {inquiries.map((inquiry, index) => (
                        <tr key={inquiry.inquiry_id}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/inquiries/${inquiry.inquiry_id}`}>
                                    {inquiry.secret ? "🔒 " : ""}
                                    {inquiry.inquiry_title}
                                </Link>
                            </td>
                            <td>{inquiry.user_id || "익명"}</td>
                            <td>{new Date(inquiry.inquiry_date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default InquiryList;
