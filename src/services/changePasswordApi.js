import axios from "axios";

export async function changePassword(password, passwordConfirm, email, token) {
	const response = await axios.post(
		`http://localhost:8001/user/password/change`,
		{
			password,
			passwordConfirm,
			email,
			token,
		}
	);
	return response.data.message;
}
