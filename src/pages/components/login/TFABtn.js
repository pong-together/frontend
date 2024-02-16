import Component from '../Component.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
		};
	}

	template() {
		return `<button class="login-btn">2단계 인증</button>`;
	}

	mounted() {}
}
