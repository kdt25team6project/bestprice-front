import React, { useState } from "react";
import "./styles.css";

const AnswerForm = ({ onSubmit, onClose }) => {
    const [answer, setAnswer] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim() === "") {
            alert("답변 내용을 입력하세요.");
            return;
        }
        onSubmit(answer);
    };

    return (
        <div className="answer-form-container">
            <form onSubmit={handleSubmit}>
                <h2>답변 작성</h2>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="답변 내용을 입력하세요."
                    required
                />
                <div className="form-actions">
                    <button type="submit" className="submit-button">등록</button>
                    <button type="button" className="cancel-button" onClick={onClose}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default AnswerForm;
