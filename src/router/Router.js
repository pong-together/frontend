import { routes } from './constants/pages.js';
import RouterInstanceStore from './constants/RouterInstanceStore.js';

export default class Router {
	constructor($container) {
			this.$container = $container;
			this.currentPage = undefined;
			this.instanceStore = new RouterInstanceStore();
			this.init();
			this.route();
	}

	findMatchedRoute() {
		return routes.find(route => route.path.test(window.location.pathname));
	}

	route() {

		console.log('route');
			const matchedRoute = this.findMatchedRoute();
			const routeName = matchedRoute ? matchedRoute.element.name : 'NotFound';

			if (this.currentPage && typeof this.currentPage.destroy === 'function') {
					this.currentPage.destroy();
			}
			this.currentPage = null;

			this.currentPage = this.instanceStore.getInstance(routeName, this.$container);
			// 생성자에서 자동으로 렌더링 실행하기 때문에 생성자 로직을 수정하고 init에게 렌더링 권한 위임해야 함
			console.log('init!');
			this.currentPage.init(this.$container);

			console.log('Current page:', this.currentPage);
	}

	init() {
			window.addEventListener('popstate', () => this.route());
			window.addEventListener('historychange', ({ detail }) => {
					const { to, isReplace } = detail;
					if (isReplace) {
							history.replaceState(null, '', to);
					} else {
							history.pushState(null, '', to);
					}
					this.route();
			});
	}
};
