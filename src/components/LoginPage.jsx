import React, { useState } from 'react';
import '../css/LoginPage.css';

function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [username, setUsername] = useState('');
  const [realName, setRealName] = useState(''); // 이름
  const [userId, setUserId] = useState(''); // 아이디
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    console.log('Registering with:', { realName, username, userId, email, password });
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
        <div key="signin" className={`login-content login-content-signin ${isVisible ? 'visible' : 'hidden'}`}>
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
              <a className="outer-link pull-left" href="#/forgot">비밀번호 찾기</a>
              <button type="submit" className="btn btn-submit btn-default pull-right">로그인</button>
            </form>
          </div>
        </div>
      )}

      {/* 회원가입 폼 */}
      {showSignIn && (
        <div key="signup" className={`login-content login-content-signup ${isVisible ? 'visible' : 'hidden'}`}>
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

              {/* 비밀번호 필드 */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-password"
                placeholder="비밀번호를 입력하세요."
                required
              />
              
              {/* 비밀번호 확인 필드 */}
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control form-control-password-confirm"
                placeholder="비밀번호 확인"
                required
              />

              {/* 회원가입 버튼 */}
              <button type="submit" className="btn btn-submit btn-default pull-right">회원가입</button>
            </form>
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