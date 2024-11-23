import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const InquiryForm = ({ onClose, onSubmitSuccess, userId }) => {
    const [formData, setFormData] = useState({
        inquiryTitle: "",
        inquiry: "",
        inquiryType: "일반", // 기본값
        secret: false,
        userId: userId || null, // 전달받은 userId 사용
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8001/api/inquiries", formData);
            alert("문의가 등록되었습니다.");
            onSubmitSuccess(); // 성공 콜백 호출
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="inquiry-form-container">
            <div className="inquiry-form">
                <h2>문의하기</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>제목</label>
                        <input
                            type="text"
                            name="inquiryTitle"
                            value={formData.inquiryTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>내용</label>
                        <textarea
                            name="inquiry"
                            value={formData.inquiry}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>문의 유형</label>
                        <select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                        >
                            <option value="일반">일반</option>
                            <option value="버그">버그</option>
                            <option value="요청">요청</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="secret"
                                checked={formData.secret}
                                onChange={handleChange}
                            />
                            비밀글로 설정
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            등록
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InquiryForm;
