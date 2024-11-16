import React, { useState } from "react";
import "./styles.css";

function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [realName, setRealName] = useState("");
	const [userId, setUserId] = useState("");
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLogin = (e) => {
		e.preventDefault();
		if (!email || !password) {
			setErrorMessage("이메일과 비밀번호를 입력해주세요.");
			return;
		}
		console.log("Logging in with:", { email, password });
	};

	const handleRegister = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
			return;
		}
		if (!username || !userId || !email || !password || !realName) {
			setErrorMessage("모든 사항을 입력해주세요.");
			return;
		}
		if (!isEmailVerified) {
			setErrorMessage("이메일 인증을 완료해주세요.");
			return;
		}
		console.log("Registering with:", {
			realName,
			username,
			userId,
			email,
			password,
		});
	};

	const toggleForm = () => {
		setIsVisible(false);
		setTimeout(() => {
			setShowSignIn(!showSignIn);
			setIsVisible(true);
		}, 500);
	};

	return (
		<div className="login-page">
			{/* 로그인 폼 */}
			{!showSignIn && (
				<div
					key="signin"
					className={`login-content login-content-signin ${
						isVisible ? "visible" : "hidden"
					}`}
				>
					<div>
						<h2>Best Price 로그인</h2>
						<form className="wrapper-box" role="form" onSubmit={handleLogin}>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form-control form-control-email"
								placeholder="이메일을 입력하세요."
								required
							/>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="form-control form-control-password"
								placeholder="비밀번호를 입력하세요."
								required
							/>
							<a className="outer-link pull-left" href="#/forgot">
								비밀번호 찾기
							</a>
							<button
								type="submit"
								className="btn btn-submit btn-default pull-right"
							>
								로그인
							</button>
						</form>
						{errorMessage && (
							<div className="error-message">{errorMessage}</div>
						)}
					</div>
				</div>
			)}

			{/* 회원가입 폼 */}
			{showSignIn && (
				<div
					key="signup"
					className={`login-content login-content-signup ${
						isVisible ? "visible" : "hidden"
					}`}
				>
					<div>
						<h2>Best Price 회원가입</h2>
						<form className="wrapper-box" role="form" onSubmit={handleRegister}>
							<input
								type="text"
								value={realName}
								onChange={(e) => setRealName(e.target.value)}
								className="form-control form-control-name"
								placeholder="이름을 입력하세요."
								required
							/>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="form-control form-control-username"
								placeholder="닉네임을 입력하세요."
								required
							/>
							<input
								type="text"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className="form-control form-control-id"
								placeholder="아이디를 입력하세요."
								required
							/>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form-control form-control-email"
								placeholder="이메일을 입력하세요."
								required
							/>

							{/* 이메일 인증 버튼 */}
							<button
								type="button"
								onClick={() => setIsEmailVerified(true)}
								className="btn btn-verify-email"
							>
								이메일 인증
							</button>

							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="form-control form-control-password"
								placeholder="비밀번호를 입력하세요."
								required
							/>

							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="form-control form-control-password-confirm"
								placeholder="비밀번호 확인"
								required
							/>
							<button
								type="submit"
								className="btn btn-submit btn-default pull-right"
							>
								회원가입
							</button>
						</form>
						{errorMessage && (
							<div className="error-message">{errorMessage}</div>
						)}
					</div>
				</div>
			)}

			{/* 로그인/회원가입 전환 버튼 */}
			<div className="login-switcher">
				{showSignIn ? (
					<div className="login-switcher-signin">
						<h3>계정이 있으신가요?</h3>
						<button onClick={toggleForm}>로그인</button>
					</div>
				) : (
					<div className="login-switcher-signup">
						<h3>아직 계정이 없으신가요?</h3>
						<button onClick={toggleForm}>회원가입</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default LoginPage;
