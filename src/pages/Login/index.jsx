import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";
import { join } from "../../services/signupApi";
import { login } from "../../services/loginApi";
import "./styles.css";

const LoginPage = () => {
	const [showSignIn, setShowSignIn] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [nickname, setNickname] = useState("");
	const [userId, setUserId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();
	const setUser = useSetRecoilState(userState);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const activate = searchParams.get("activate");
	const didMountRef = useRef(false);

	useEffect(() => {
		if (!didMountRef.current && activate === "true") {
			didMountRef.current = true;
			alert("메일 인증 성공! 로그인을 해주세요.");
		}
	}, [activate]);

	const handleRegister = useCallback(
		async (e) => {
			e.preventDefault();
			// 비밀번호 확인 검증
			if (password !== confirmPassword) {
				setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
				return;
			}

			try {
				await join(userId, password, name, nickname, email);
				alert("이메일 발송완료, 이메일 인증 후 로그인 해주세요");
				setShowSignIn(false); // 로그인 폼으로 전환
				// 상태 초기화
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				setName("");
				setNickname("");
				setUserId("");
			} catch (error) {
				if (error.response) {
					// 서버에서 응답이 온 경우
					const errorMessage = error.response.data.message || "회원가입 실패";

					// 오류 메시지 출력
					setErrorMessage(errorMessage);
				} else {
					// 서버와의 연결 문제 또는 다른 오류 처리
					setErrorMessage(
						"회원가입 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
					);
				}
			}
		},
		[name, nickname, userId, email, password, confirmPassword, navigate]
	);

	const handleLogin = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				const response = await login(userId, password);
				setUser({
					isLoggedIn: true,
					user: {
						name: response.name,
						nickname: response.nickname,
						email: response.email,
					},
				});
				localStorage.setItem("isLoggedIn", "true"); // 로그인 상태 저장
				navigate("/");
			} catch (error) {
				if (error.response) {
					// 서버에서 응답이 온 경우
					const errorMessage = error.response.data.message || "로그인 실패";

					// 오류 메시지 출력
					alert(errorMessage);
				} else {
					// 서버와의 연결 문제 또는 다른 오류 처리
					alert(
						"로그인 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
					);
				}
			}
		},
		[userId, navigate, password, setUser]
	);

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
								type="text"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className="form-control form-control-id"
								placeholder="아이디를 입력하세요."
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
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="form-control form-control-name"
								placeholder="이름을 입력하세요."
								required
							/>
							<input
								type="text"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
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
};

export default LoginPage;
