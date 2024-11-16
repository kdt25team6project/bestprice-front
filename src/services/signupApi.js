import axios from "axios";

export async function join(email, userId, password) {
	const response = await axios.post(
		`http://localhost:8001/user/join`,
		{
			email,
			userId,
			password,
		}
	);
	return response.data.message;
}
