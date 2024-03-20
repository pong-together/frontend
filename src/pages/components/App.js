import Component from '../../core/Component.js';
import Router from '../../router/Router.js';
import { navigate } from '../../router/utils/navigate.js';
import store from '../../store/index.js';
import language from '../../utils/language.js';
import { displayConnectionFailedModal } from '../../utils/modal';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
	setup() {
		if (localStorage.getItem('language')) {
			store.dispatch('changeLanguage', localStorage.getItem('language'));
		}
		this.$state = {
			region: store.state.language,
		};
		this.$store = this.$props;
	}

	setEvent() {
		this.addEvent('click', '.back-logo', (e) => {
			e.stopPropagation();
			if (localStorage.getItem('tournament-id')) {
				localStorage.removeItem('tournament-id');
			}
			if (window.location.pathname !== '/remote' && window.location.pathname !== '/game'){
				navigate("/select");
			}
		});

		this.addEvent('click', '.modal-close-btn', () => {
			navigate("/login", true);
		});
	}

	template() {
		return `
		<div class="body-wrapper"></div>
		`;
	}

	routerModule(){
		const $body = this.$target.querySelector('.body-wrapper');
		new Router($body);
	}


	changeModule() {
		if (
			window.location.pathname === '/login' ||
			window.location.pathname === '/' ||
			window.location.pathname === '/auth'
		) {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
				<div class="login-wrapper" data-link>
						<div class="body-wrapper"></div>
				</div>`;
		} else if (
			window.location.pathname === '/select' ||
			window.location.pathname === '/local' ||
			window.location.pathname === '/remote' ||
			window.location.pathname === '/tournament' ||
			window.location.pathname === '/game'
		) {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
				<div class="back-wrapper" data-link>
				<div class="back-logo-wrapper"><img class="back-logo" src="/static/images/logoBlue.png" alt=""/></div>
				<div class="body-wrapper"></div>
				<div class="footer-wrapper">
						<div class="chip-container">
						<div class="chip-top">
								<div class="yellow-box1"></div>
								<div class="yellow-box2"></div>
								<div class="yellow-box3"></div>
						</div>
						<div class="chip-middle">
								<div class="chip-logo"></div>
								<div class="intra-info">
										<div class="intra-nickname">${localStorage.getItem('intraId')}</div>
										<div class="record">${localStorage.getItem('winCount')}${language.util[store.state.language].winCount} ${localStorage.getItem('loseCount')}${language.util[store.state.language].loseCount}(${localStorage.getItem('rate')}%)</div>
								</div>
						</div>
						<div class="intra-picture">
								<div class="chip-picture"><img class="chip-image" src="${localStorage.getItem('intraImg')}"/></div>
						</div>
						<div class="chip-bottom">
								<div class="triangle"></div>
						</div>
				</div>

				<div class="chat-container">
						<div class="message-container">

						</div>
						<div action="" id="chat-form">
								<input id="m" autocomplete="off" /><button class="message-btn">${language.util[store.state.language].submit}</button>
						</div>
				</div>
				</div>
		</div>
				`;
		}
	}

	connectSocket() {
		const chatSocket = new WebSocket(
			`${SOCKET_URL}/ws/chats/?token=${localStorage.getItem('accessToken')}`,
		);

		chatSocket.onopen = () => {
			// console.log("chat connect");
			this.addEvent('click', '.message-btn', (e) => {
				e.preventDefault();
				var message = this.$target.querySelector('#m').value;
				if (message && chatSocket.readyState === WebSocket.OPEN) {
					// 여기에 조건 추가
					if (message.trim() !== '') {
						chatSocket.send(JSON.stringify({ message }));
						this.$target.querySelector('#m').value = '';
					}
				}
			});
			this.addEvent('keypress', '#m', (e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					this.$target.querySelector('.message-btn').click();
				}
			});
		};

		chatSocket.onclose = function (event) {
			// console.log('WebSocket closed.');
			if(event.code === 1000){
				console.log('Try multiple connections');
				displayConnectionFailedModal(
					language.util[localStorage.getItem('language')?localStorage.getItem('language'):'en'].chatMessage,
				);
				localStorage.clear();
			}
			return;
		};

		chatSocket.onerror = function (e) {
			displayConnectionFailedModal(
				language.util[this.$state.region].chatMessage,
			);
			localStorage.clear();
			return;
		};

		chatSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type && data.type === 'chat_message') {
				this.displayMessage(data);
			} else if (data.type && data.type === 'ping') {
				chatSocket.send(JSON.stringify({ type: 'pong' }));
			} else if (data.type && data.type === 'send_multiple_connection') {
				chatSocket.close(1000, 'Try multiple connections');
			}
		};
	}

	displayMessage(data) {
		const messageContainer = this.$target.querySelector('.message-container');
		const messageElement = document.createElement('div');
		messageElement.classList.add('messages');
		if (data.intra_id === localStorage.getItem('intraId')) {
			messageElement.classList.add('my-message-wrapper');
		} else {
			messageElement.classList.add('others-message-wrapper');
		}
		const messageTime = document.createElement('span');
		messageTime.classList.add('message-time-stamp');
		const messageContent = document.createElement('span');
		messageContent.classList.add('message');

		messageTime.textContent = `${data.timestamp}`;
		if (data.intra_id === localStorage.getItem('intraId')) {
			messageContent.textContent = `${data.message}`;
		} else messageContent.textContent = `${data.intra_id}: ${data.message}`;
		messageElement.appendChild(messageTime);
		messageElement.appendChild(messageContent);
		messageContainer.appendChild(messageElement);
		messageContainer.scrollTop = messageContainer.scrollHeight;
	}

	async mounted() {
		window.addEventListener('load', () => {
			this.changeModule();
			this.routerModule();
		});

		if (
			localStorage.getItem('accessToken') &&
			localStorage.getItem('intraId') &&
			(!localStorage.getItem('chatConnection') ||
				localStorage.getItem('chatConnection') !== true)
		) {
			this.connectSocket.bind(this)();
		}

		if (localStorage.getItem('accessToken') && localStorage.getItem('twoFA')) {
			store.dispatch('changeLoginProgress', 'done');
		} else if (localStorage.getItem('accessToken')) {
			store.dispatch('changeLoginProgress', 'twoFA');
		}
	}
}
