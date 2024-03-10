import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import RemoteReady from './RemoteReady.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		}

		this.intra = {
			opponentIntraID: 'undefined',
			opponentintraPic: 'undefined',
		};
		this.$state = this.$props;
		this.setState(this.intra);
		//remoteSocket = null;
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].searchText}</div>
			<img src="static/images/question-mark.png" id="question">
			<div id="counter"></div>
			<button class="match-button" id="search">${language.remote[this.$state.region].searchButton}</button>
		`;
	}

	setEvent() {
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (target.id === 'search') {
				this.stopCounter();
			}
		});
	}

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		function stopCounter() {
			clearInterval(count);
			updateCounter();
			remoteSocket.close();
			window.location.pathname = '/select';
		}
		this.stopCounter = stopCounter;

		const nextLevel = () => {
			clearInterval(count);
			updateCounter();
			new RemoteReady(
				document.querySelector('.mainbox'),
				this.$state,
				remoteSocket,
			);
		};
		this.nextLevel = nextLevel;

		const startCounter = () => {
			count = setInterval(() => {
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		};

		startCounter();
	}

	connectSocket() {
		var remoteSocket = new WebSocket(
			`${SOCKET_URL}/ws/remote/?token=${localStorage.getItem('accessToken')}&game_mode=${localStorage.getItem('mode')}`,
		);

		remoteSocket.onopen = () => {
			if (remoteSocket.readyState === WebSocket.OPEN) {
				console.log('remoteSocket connected');
			}
		};

		remoteSocket.onmessage = (e) => {
			console.log('received msg from server');
			const data = JSON.parse(e.data);
			this.$state.type = data.type;
			this.$state.opponentIntraID = data.opponent;
			this.$state.intraID = data.intra_id;
			this.$state.opponentintraPic = data.opponent_image;
			this.$state.typeID = data.id;
			localStorage.setItem('remoteState', JSON.stringify(this.$state));
			this.nextLevel();
		};

		remoteSocket.onerror = (e) => {
			console.log('remoteSocker error');
			console.log(e);
			console.log(e.status);
			remoteSocket.close();
		};

		remoteSocket.onclose = () => {
			console.log('remoteSocker closed');
			localStorage.removeItem('mode');
		};
	}

	mounted() {
		this.counter();
		this.connectSocket();
	}
}
