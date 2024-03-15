import App from './pages/components/App.js';
import store from './store/index.js';
import Router from './router/Router.js';

new App(document.querySelector('#app'), store).init(document.querySelector('#app'));

const $body = this.$target.querySelector('#app');
new Router($body);
