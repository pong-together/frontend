import http from "../../../core/http.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const HEADERS = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
};

const LOCAL_BASE_URL = `${BASE_URL}/api/local/`;

const list = (id) => {
	const BASE_URL_ID = LOCAL_BASE_URL + id + '/';
	return http.get(BASE_URL_ID, HEADERS);
};

const create = (nicknames, gamemode) => {
	const list = {
		player1_name: nicknames[0],
		player2_name: nicknames[1],
		game_mode: gamemode,
	};

	return http.post(LOCAL_BASE_URL, list, HEADERS);
};


export default {
	list, create,
}
