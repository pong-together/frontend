export default {
	/*
	예시코드
	addItem(state, payload) {
		state.items.push(payload);

		return state;
	},
	clearItem(state, payload) {
		state.items.splice(payload.index, 1);

		return state;
	},
*/
	changeLanguage(state, payload) {
		state.language = payload;
		return state;
	},
	login(state, payload) {
		state.login = payload;
		return state;
	},
};