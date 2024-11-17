import axios from "axios";

export async function join(userId, password, name, nickname, email) {
	const response = await axios.post(
		`http://localhost:8001/user/register`,
		{
			
			userId,
			password,
			name,
			nickname,
			email
		}
	);
	return response.data.message;
}
