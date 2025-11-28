import axios from "axios";

const api = axios.create({
	baseURL: "https://doctorless-stopperless-turner.ngrok-free.dev",
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
