import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import language from '../../../utils/language.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
	constructor($target, $props) {
		super($target, $props);
		this.remoteSocket;
	}

	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		} else {
			http.checkToken();
		}

		this.$state = {
			region: 'kr',
			opponentIntraID: 'undefined',
			opponentIntraPic: 'undefined',
		};

		if (localStorage.getItem('language')) {
			this.$state.region = localStorage.getItem('language');
		}
	}

	setEvent() {
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (target.id === 'search') {
				window.location.pathname = '/select';
			}
		});
	}

	template() {
		return `
			<div class="main-container">
				<div class="container">
					<div class="mainbox">
						<div class="top-text">${language.remote[this.$state.region].searchText}</div>
						<img src="static/images/question-mark.png" id="question">
						<div id="counter"></div>
						<button class="match-button" id="search">${language.remote[this.$state.region].searchButton}</button>
					</div>
				</div>
			</div>
		`;
	}

	templateReady() {
		return `
			<div class="top-text">${language.remote[this.$state.region].readyText}</div>
			<img src="${this.$state.opponentIntraPic}" id="picture">
			<button id="match-intra">${this.$state.opponentIntraID}(5)</button>
		`;
	}

	async sleep() {
		const asleep = () => {
			return new Promise((resolve) => setTimeout(resolve, 3000));
		};
		const wait = async () => {
			console.log('sleep 시작');
			await asleep();
			console.log('sleep 끝');
		};
		await wait();
	}

	async closeSocket() {
		return new Promise((resolve) => {
			this.remoteSocket.onclose = () => {
				console.log(
					'원격 소켓 닫힘, readyState =',
					this.remoteSocket.readyState,
				);
				resolve();
			};
			this.remoteSocket.close();
		});
	}

	remoteReady() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.templateReady();
		this.timer();
	}

	exclamationMark() {
		const counterElement = document.getElementById('counter');
		counterElement.parentNode.removeChild(counterElement);

		const imageElement = document.getElementById('question');
		imageElement.src = 'static/images/exclamation-mark.png';
		imageElement.id = 'exclamation';
	}

	connectSocket() {
		this.remoteSocket = new WebSocket(
			`${SOCKET_URL}/ws/remote/?token=${localStorage.getItem('accessToken')}&game_mode=${localStorage.getItem('gameLevel')}`,
		);

		this.remoteSocket.onopen = () => {
			console.log('원격 소켓이 서버에 연결되었습니다.');
		};

		this.remoteSocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			if (data.type && data.type === 'ping') {
				console.log('remote', e.data);
				this.remoteSocket.send(JSON.stringify({ type: 'pong' }));
				console.log('remote pong');
			} else if (data.type && data.type === 'find_opponent') {
				console.log('원격 소켓이 서버로부터 메시지를 수신했습니다.');
				this.$state.opponentIntraID = data.opponent;
				this.$state.opponentIntraPic = data.opponent_image;
				localStorage.setItem('remote-id', data.id);
				this.exclamationMark();
				await this.sleep();
				this.remoteReady();
			} else if (data.type && data.type === 'disconnect') {
				console.log;
			}
		};

		this.remoteSocket.onerror = () => {
			console.log('원격 소켓 에러');
			this.stopCounter();
		};
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

		const stopCounter = async () => {
			clearInterval(count);
			updateCounter();
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
			}
		};
		this.stopCounter = stopCounter;

		const startCounter = () => {
			count = setInterval(() => {
				if (seconds === 59) {
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

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.getElementById('match-intra');
		const bindUpdateTimer = updateTimer.bind(this);

		function updateTimer() {
			buttonElement.textContent = `${this.$state.opponentIntraID}(${seconds})`;
		}

		const stopTimer = () => {
			clearInterval(time);
			bindUpdateTimer();
			window.location.pathname = '/game';
		};

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 1) {
					stopTimer();
				} else {
					seconds--;
				}
				bindUpdateTimer();
			}, 1000);
		}
		startTimer();
	}

	mounted() {
		console.log('마운트가 한번만 되는지 확인하는 로그 : Remote');
		this.counter();
		this.connectSocket();
	}
}
