import axios from "axios";

export async function resetPassword(email) {
	const response = await axios.post(
		`http://localhost:8001/user/password/reset`,
		{
			email,
		}
	);
	return response.data.message;
}
