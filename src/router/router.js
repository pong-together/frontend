import { routes } from '../router/constants/pages.js';
import NotFound from '../pages/components/NotFound.js';

function Router($container) {
	this.$container = $container;
	let currentPage = undefined;

	const findMatchedRoute = () =>
		routes.find((route) => route.path.test(location.pathname));

	const route = () => {
		if (currentPage){
			currentPage.destroy();
			currentPage = null;
		}
		const TargetPage = findMatchedRoute()?.element || NotFound;
		currentPage = new TargetPage(this.$container);
	};

	const init = () => {
		window.addEventListener('historychange', ({ detail }) => {
			const { to, isReplace } = detail;

			if (isReplace || to === location.pathname)
				history.replaceState(null, '', to);
			else history.pushState(null, '', to);

			route();
		});

		window.addEventListener('popstate', () => {
			route();
		});
	};

	init();
	route();
}

export default Router;
