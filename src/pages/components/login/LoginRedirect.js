import Component from '../../../core/Component';
import store from '../../../store/store';
import http from '../../../core/http';
import language from '../../../utils/language';
import { displayConnectionFailedModal } from '../../../utils/modal';
import { navigate } from '../../../router/utils/navigate';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class LoginRedirect extends Component {
	setup() {
		this.$state = {
			region: localStorage.getItem('language')
				? localStorage.getItem('language')
				: 'kr',
		};
	}

	template() {
		return `<div class="login-body-wrapper">
		<img src="/static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper"><button class="login-btn" id="login-oauth-btn">${language.login[this.$state.region].loginBtn}</button>
			</div>
			</div>`;
	}

	async mounted() {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');
		if (code && !localStorage.getItem('accessToken')) {
			try {
				const btn = this.$target.querySelector('#login-oauth-btn');
				let loadingText = language.login[this.$state.region].loading;
				btn.innerText = loadingText;
				let dotCount = 0;

				setInterval(() => {
					dotCount = (dotCount + 1) % 4;
					btn.innerText = loadingText + '.'.repeat(dotCount);
				}, 500);

				if (localStorage.getItem('accessToken')) {
					store.dispatch('changeLoginProgress', 'twoFA');
					return;
				}

				// console.log(code);

				const data = await http.post(
					`${BASE_URL}/api/auth/login/`,
					{ code: code },
					{ 'Content-Type': 'application/json' },
				);

				if (data?.login === 'success') {
					localStorage.setItem('accessToken', data.access_token);
					localStorage.setItem('refreshToken', data.refresh_token);
					navigate("/login");
				}
			} catch (error) {
				// console.log('error: ', error);
			}
		}
	}
}
