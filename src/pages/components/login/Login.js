import Component from '../Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';

export default class extends Component {
	setup() {
		this.$state = {
			progress: 'oauth',
			region: 'jp',
		};
	}

	template() {
		return `
		<div class="login-body-wrapper">
			<img src="../../../static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper"></div>
		</div>
		`;
	}

	mounted() {
		const $parent = this.$target.querySelector('.login-content-wrapper');
		if (this.$state.progress === 'oauth') {
			new OauthBtn($parent, this.$state);
		} else if (this.$state.progress === 'twoFA') {
			new TFABtn($parent, this.$state);
		} else if (this.$state.progress === 'language') {
			new SelectLanguage($parent, this.$state);
		}

		if (this.$props.region) this.$state.region = this.$props.region;
	}
}
