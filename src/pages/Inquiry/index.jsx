import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import axios from "axios";
import Pagination from "./Pagination";
import InquiryForm from "./InquiryForm";
import "./styles.css";

const InquiryList = ({ userId }) => {
    const user = useRecoilValue(userState);
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);

    const fetchInquiries = async (page = 1) => {
        try {
            const response = await axios.get("http://localhost:8001/api/inquiries", {
                params: { page, userId }, // userId를 API 요청에 포함
            });
            const mappedInquiries = response.data.content.map((item) => ({
                inquiryId: item.inquiryId,
                inquiryTitle: item.inquiryTitle,
                inquiry: item.inquiry,
                inquiryDate: item.inquiryDate,
                inquiryType: item.inquiryType,
                secret: item.secret,
                userId: item.userId,
                answer: item.answer || null, // 답변 필드 추가
            }));
            setInquiries(mappedInquiries);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        }
    };

    useEffect(() => {
        fetchInquiries(currentPage);
    }, [currentPage, userId]);

    const handleFormSubmit = () => {
        setShowForm(false);
        fetchInquiries(currentPage);
    };

    const handleWriteButtonClick = () => {
        if (!user || !user.user || !user.user.userId) {
            alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
            return;
        }
        setShowForm(true);
    };

    if (showForm) {
        return (
            <InquiryForm
                onClose={() => setShowForm(false)}
                onSubmitSuccess={handleFormSubmit}
                userId={user.user?.userId || null}
            />
        );
    }

    return (
        <div className="inquiry-list-container">
            <h1>Q&A</h1>
            <div className="inquiry-actions">
                {user?.user?.userId && (
                    <button className="write-button" onClick={handleWriteButtonClick}>
                        글쓰기
                    </button>
                )}
            </div>
            <table className="inquiry-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>작성시간</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {inquiries.map((inquiry, index) => {
                        const isSecret =
                            inquiry.secret &&
                            (!user?.user?.userId || (user.user.userId !== inquiry.userId && user.user.role !== "MANAGER"));

                        return (
                            <tr key={inquiry.inquiryId || index}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/inquiries/${inquiry.inquiryId}`}>
                                        {isSecret ? "🔒 비밀글" : inquiry.inquiryTitle || "제목 없음"}
                                    </Link>
                                </td>
                                <td>{isSecret ? "익명" : inquiry.userId}</td>
                                <td>{inquiry.inquiryDate ? new Date(inquiry.inquiryDate).toLocaleDateString() : "날짜 없음"}</td>
                                <td>{inquiry.inquiryType}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
    );
};

export default InquiryList;
