import axios from "axios";

export async function login(userId, password) {
	try {
		const response = await axios.post(`http://localhost:8001/user/login`, {
			userId,
			password,
		});
		return response.data; // response.data를 반환
	} catch (error) {
		throw error; // 오류를 던져서 catch 블록에서 처리하도록
	}
}
