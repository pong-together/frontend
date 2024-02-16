import Component from '../Component.js';
import Router from '../../router.js';
import Pages from '../../pages.js';
import Cancel from './RemoteCancel.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'wait'
		};
	}

	template() {
		return `
			<div class="container">
				<div class="mainbox"></div>
			</div>
		`;
	}

	mounted() {
		new Cancel();
	}
}
