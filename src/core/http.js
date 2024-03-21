import language from '../utils/language.js';
import { displayCanceledMatchingModal as displayExpiredTokenModal } from '../utils/modal';
import { navigate } from '../router/utils/navigate';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const REFRESH_BASE_URL = `${BASE_URL}/api/auth/token/refresh/`;
const CHECK_BASE_URL = `${BASE_URL}/api/auth/otp/`;

const parseResponse = async (response) => {
	const { status } = response;
	let data = null; // 초기값을 null로 설정
	try {
		if (status !== 204) {
			data = await response.json();
		}
	} catch (error) {}

	return {
		status,
		data,
	};
};

const checkToken = async () => {
	let header = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
	};

	try {
		const response = await window.fetch(CHECK_BASE_URL, {
			method: 'GET',
			headers: new window.Headers(header),
		});
		if (!response.ok) {
			if (response.status === 401) {
				await refreshToken();
			}
		}
	} catch (e) {
		return {
			status: e.status,
			message: e.message,
		};
	}
};

const refreshToken = async () => {
	let header = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
	};
	let refBody = {
		refresh: localStorage.getItem('refreshToken'),
	};
	refBody = JSON.stringify(refBody);

	const refToken = localStorage.getItem('refreshToken');
	if (refToken) {
		try {
			const response = await window.fetch(REFRESH_BASE_URL, {
				method: 'POST',
				headers: new window.Headers(header),
				body: refBody,
			});
			if (!response.ok) {
				if (response.status === 401) {
					let region = 'kr';
					if (localStorage.getItem('language')) {
						region = localStorage.getItem('language');
					}
					await displayExpiredTokenModal(
						language.util[region].expiredTokenMessage,
					);
					localStorage.clear();
					navigate('/login');
				}
			} else {
				const data = await response.json();
				localStorage.setItem('accessToken', data.access);
			}
		} catch (e) {
			return {
				status: e.status,
				message: e.message,
			};
		}
	} else {
		localStorage.clear();
		navigate('/login');
	}
};

const request = async (params) => {
	const { method = 'GET', url, headers = {}, body } = params;
	let response;
	const config = {
		method,
		headers: new window.Headers(headers),
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	try {
		response = await window.fetch(url, config);
		if (!response.ok) {
			if (response.status === 401) {
				await refreshToken();
				response = await window.fetch(url, config);
			}
		}
	} catch (e) {
		return {
			status: e.status,
			message: e.message,
		};
	}

	return parseResponse(response);
};

const get = async (url, headers) => {
	const response = await request({
		url,
		headers,
		method: 'GET',
	});

	return response.data;
};

const post = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'POST',
		body,
	});
	return response.data;
};

const put = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'PUT',
		body,
	});
	return response.data;
};

const patch = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'PATCH',
		body,
	});
	return response.data;
};

const deleteRequest = async (url, headers) => {
	const response = await request({
		url,
		headers,
		method: 'DELETE',
	});
	return response.data;
};

export default {
	get,
	post,
	put,
	patch,
	delete: deleteRequest,
	checkToken,
};
