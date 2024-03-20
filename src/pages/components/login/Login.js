import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';
import store from '../../../store/index.js';

export default class Login extends Component {
	setup() {
		if (localStorage.getItem('language')) {
			store.dispatch('changeLanguage', localStorage.getItem('language'));
		}
		store.events.subscribe('loginProgressChange', async () => this.render());
	}

	template() {
		return `
		<div class="login-body-wrapper">
		</div>
		`;
	}

	mounted() {
		const $parent = this.$target.querySelector('.login-body-wrapper');

		if (store.state.loginProgress === 'done') {
			window.location.pathname = '/select';
		}
		if (store.state.loginProgress === 'oauth') {
			if (
				localStorage.getItem('accessToken') &&
				!localStorage.getItem('twoFA')
			) {
				store.dispatch('changeLoginProgress', 'twoFA');
				return;
			}
			new OauthBtn($parent).init($parent);
		}
		if (store.state.loginProgress === 'twoFA') {
			new TFABtn($parent).init($parent);
		}
		if (store.state.loginProgress === 'language') {
			new SelectLanguage($parent).init($parent);
		}
	}
}
