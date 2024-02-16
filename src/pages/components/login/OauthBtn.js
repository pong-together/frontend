import Component from '../Component.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			success: 'ananymous',
			region: 'kr',
		};
	}

	setEvent() {
		this.addEvent('click', '#login-oauth-btn', () => {
			window.location.href =
				'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9faf7925c4cf5dfe9518b96183f6225ad7c1c45e2f186121a5d808d8dcdad924&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fredirect%2F&response_type=code';
		});
	}

	template() {
		return `<button class="login-btn" id="login-oauth-btn">Login</button>`;
	}

	mounted() {
		if (this.$props.region) this.$state.region = this.$props.region;
	}
}
