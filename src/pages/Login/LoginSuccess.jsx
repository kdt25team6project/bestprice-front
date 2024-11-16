import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../state/userState";

function LoginSuccess() {

	const setUser = useSetRecoilState(userState);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const name = searchParams.get("name");
		const userId = searchParams.get("userId");
		const accessToken = searchParams.get("accessToken");
        const nickname = searchParams.get("nickname");

		if (accessToken && userId && name && nickname) {
			setUser({ name, userId, accessToken, nickname });
			navigate("/");
		}
	}, [location, navigate, setUser]);

	return <div>로그인 처리 중...</div>;
}

export default LoginSuccess;
