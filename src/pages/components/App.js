import Component from '../../core/Component.js';
import Router from '../router.js';
import Pages from '../pages.js';

export default class extends Component {
	template() {
		return `
		<div class="back-wrapper" data-link>
			<div class="back-logo-wrapper"><img class="back-logo" src="../../static/images/logoBlue.png" alt=""/></div>
			<div class="body-wrapper"></div>
			<div class="footer-wrapper">
				<div class="footer-profile"></div>
				<div class="footer-chat"></div>
			</div>
		</div>
		`;
	}

	changeModule() {
		if (window.location.hash === '#/login') {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
			<div class="login-wrapper" data-link>
			<div class="body-wrapper"></div>
		</div>`;
		} else {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
			<div class="back-wrapper" data-link>
			<div class="back-logo-wrapper"><img class="back-logo" src="../../static/images/logoBlue.png" alt=""/></div>
			<div class="body-wrapper"></div>
			<div class="footer-wrapper">
				<div class="footer-profile"></div>
				<div class="footer-chat"></div>
			</div>
		</div>
			`;
		}
	}

	routerModule() {
		const $body = this.$target.querySelector('.body-wrapper');
		const pages = Pages($body);
		const router = Router($body);
		router.addRoute('#/login', pages.login);
		router.addRoute('#/select', pages.gameSelect);
		router.addRoute('#/local', pages.local);
		router.addRoute('#/tournament', pages.tournament);
		router.addRoute('#/remote', pages.remote);
		router.addRoute('#/game', pages.game);
		router.start();
	}

	mounted() {
		window.addEventListener('hashchange', () => {
			this.changeModule();
			this.routerModule();
		});
		window.addEventListener('load', () => {
			this.changeModule();
			this.routerModule();
		});

		this.routerModule();
	}
}
