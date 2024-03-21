import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
// import TournamentBracket from '../tournament/Tournament-Bracket.js';
import language from '../../../utils/language.js';
import { navigate } from '../../../router/utils/navigate.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class Game extends Component {
	static instance = null;

	static getInstance($container) {
		if (!Game.instance) {
			Game.instance = new Game($container);
		}
		return Game.instance;
	}

	constructor($target, $props) {
		super($target, $props);
		this.gameSocket;
		this.bracket;
		this.event1;
		this.event2;
	}
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			navigate('/login');
		} else {
			http.checkToken();
		}
		this.$state = {
			player1: '',
			player2: '',
			gameMode: window.localStorage.getItem('gameMode'),
			game_id: 0,
			player1_result: '',
			player1_score: 0,
			player2_result: '',
			player2_score: 0,
			winner: '',
			ball_x: 309,
			ball_y: 213,
			player1_y: 192,
			player2_y: 192,
			buttonMessage: '',
			region: localStorage.getItem('language')
				? localStorage.getItem('language')
				: 'kr',
			player1_image: '',
			player2_image: '',
		};
		if (this.$state.gameMode === 'local') {
			this.$state.game_id = window.localStorage.getItem('local-id');
			this.$state.buttonMessage = language.game[this.$state.region].localButton;
		} else if (this.$state.gameMode === 'tournament') {
			this.$state.game_id = window.localStorage.getItem('tournament-id');
			this.$state.buttonMessage =
				language.game[this.$state.region].tournamentButton;
		} else if (this.$state.gameMode === 'remote') {
			this.$state.game_id = window.localStorage.getItem('remote-id');
			this.$state.buttonMessage = language.game[this.$state.region].localButton;
		}
		if (this.$state.game_id) {
			this.connectGameSocket();
		}
	}

	template() {
		return `
			<div class="game-container">
				<div class="player1-container">
					<div class="player1-image"></div>
					<div class="player1-nickname">${this.$state.player1}</div>
					<div class="player1-gameresult">${this.$state.player1_result}</div>
					<div class="player1-score-info">score</div>
					<div class="player1-game-score">${this.$state.player1_score}</div>
				</div>
				<div class="game-display">
					<div class="display-container">
						<div class="game-count">3</div>
					</div>
				</div>
				<div class="player2-container">
					<div class="player2-game-score">${this.$state.player2_score}</div>
					<div class="player2-score-info">score</div>
					<div class="player2-gameresult">${this.$state.player2_result}</div>
					<div class="player2-nickname">${this.$state.player2}</div>
					<div class="player2-image"></div>
				</div>
			</div>
		`;
	}

	setState(newState) {
		this.$state = { ...this.$state, ...newState };
	}

	connectGameSocket() {
		const gameSocket = new WebSocket(
			`${SOCKET_URL}/ws/games/?token=${localStorage.getItem('accessToken')}&type=${this.$state.gameMode}&type_id=${this.$state.game_id}`,
		);

		this.gameSocket = gameSocket;

		gameSocket.onopen = () => {
			console.log('WebSocket connection opened.');
			const keyStates = {};

			window.addEventListener('beforeunload', function (event) {
				if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
					gameSocket.close();
				}
			});

			this.event1 = (e) => {
				if (window.localStorage.getItem('gameMode') === 'remote') {
					if (e.key === 'ㅈ') keyStates['w'] = true;
					else if (e.key === 'ㄴ') keyStates['s'] = true;
					else if (e.key === 'ㅔ') keyStates['p'] = true;
					keyStates[e.key] = true;
					updateBarPositionRemote();
				} else {
					if (e.key === 'ㅈ') keyStates['w'] = true;
					else if (e.key === 'ㄴ') keyStates['s'] = true;
					else if (e.key === 'ㅔ') keyStates['p'] = true;
					keyStates[e.key] = true;
					updateBarPosition();
				}
			};

			document.addEventListener('keydown', this.event1);

			this.event2 = (e) => {
				if (e.key === 'ㅈ') keyStates['w'] = false;
				else if (e.key === 'ㄴ') keyStates['s'] = false;
				else if (e.key === 'ㅔ') keyStates['p'] = false;
				keyStates[e.key] = false;
			};

			document.addEventListener('keyup', this.event2);

			function updateBarPositionRemote() {
				let messages = [];
				if (keyStates['w']) {
					messages.push({
						type: 'push_button',
						sender_player: `${window.localStorage.getItem('intraId')}`,
						button: 'up',
					});
				} else if (keyStates['s']) {
					messages.push({
						type: 'push_button',
						sender_player: `${window.localStorage.getItem('intraId')}`,
						button: 'down',
					});
				}

				messages.forEach((message) => {
					gameSocket.send(JSON.stringify(message));
				});
			}

			function updateBarPosition() {
				let messages = [];
				if (keyStates['w']) {
					messages.push({
						type: 'push_button',
						sender_player: 'player1',
						button: 'up',
					});
				}
				if (keyStates['s']) {
					messages.push({
						type: 'push_button',
						sender_player: 'player1',
						button: 'down',
					});
				}
				if (keyStates['p']) {
					messages.push({
						type: 'push_button',
						sender_player: 'player2',
						button: 'up',
					});
				}
				if (keyStates[';']) {
					messages.push({
						type: 'push_button',
						sender_player: 'player2',
						button: 'down',
					});
				}

				messages.forEach((message) => {
					gameSocket.send(JSON.stringify(message));
				});
			}

			setTimeout(() => {
				if (gameSocket.readyState === WebSocket.OPEN) {
					let start = {
						type: 'start_game',
					};
					gameSocket.send(JSON.stringify(start));
				}
			}, 3000);
		};

		gameSocket.onclose = () => {
			console.log('gamesocket closed');
			return;
		};

		gameSocket.onerror = function (e) {
			// console.log(e);
		};

		gameSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type && data.type === 'get_user_info') {
				this.setState({ player1: data.player1_name });
				this.setState({ player2: data.player2_name });
				if (
					window.localStorage.getItem('gameMode') === 'remote' &&
					(data.player1_image || data.player2_image)
				) {
					var imageUrl1 = data.player1_image;
					var imageUrl2 = data.player2_image;

					this.setState({ player1_image: imageUrl1 });
					this.setState({ player2_image: imageUrl2 });
				}
				this.render();
			} else if (data.type && data.type === 'send_reconnection') {
				gameSocket.close();
				document.removeEventListener('keydown', this.event1);
				document.removeEventListener('keyup', this.event2);
				navigate('/select');
			} else if (data.type && data.type === 'end') {
				if (data.is_normal === false) {
					const element3 = document.querySelector('.game-display');
					element3.innerHTML = this.templateEnd();
				}
				this.setState({ winner: data.winner });
				if (data.winner === this.$state.player1) {
					document.querySelector('.player1-gameresult').textContent = 'Win';
					document.querySelector('.player2-gameresult').textContent = 'Lose';
				} else if (data.winner === this.$state.player2) {
					document.querySelector('.player1-gameresult').textContent = 'Lose';
					document.querySelector('.player2-gameresult').textContent = 'Win';
				}
				if (window.localStorage.getItem('gameMode') === 'tournament') {
					const element = document.querySelector('.game-display');
					element.innerHTML = this.templateEnd();
				} else if (
					window.localStorage.getItem('gameMode') === 'local' ||
					window.localStorage.getItem('gameMode') === 'remote'
				) {
					const element2 = document.querySelector('.game-display');
					element2.innerHTML = this.templateEnd();
				}
				document.removeEventListener('keydown', this.event1);
				document.removeEventListener('keyup', this.event2);
				gameSocket.close();
			} else if (data.type && data.type === 'score') {
				document.querySelector('.player1-game-score').textContent =
					data.player1_score;
				document.querySelector('.player2-game-score').textContent =
					data.player2_score;
			} else if (data.type && data.type === 'get_game_info') {
				this.setState({ ball_x: data.ball_x });
				this.setState({ ball_y: data.ball_y });
				this.setState({ player1_y: data.player1_y });
				this.setState({ player2_y: data.player2_y });
			}
		};
	}

	setEvent() {
		this.addEvent('click', '.game-end-button', ({ target }) => {
			if (window.localStorage.getItem('gameMode') === 'tournament') {
				navigate('/tournamentBracket');
			} else {
				// window.location.pathname = '/select';
				if (window.localStorage.getItem('gameMode') === 'local') {
					window.localStorage.removeItem('local-id');
				} else window.localStorage.removeItem('remote-id');
				window.localStorage.removeItem('gameMode');
				window.localStorage.removeItem('gameLevel');
				// window.location.pathname = '/select';

				navigate('/select');
			}
		});
	}

	templateStart() {
		return `
			<canvas id="canvas"></canvas>
		`;
	}

	templateEnd() {
		return `
			<div class="game-end">
				<button class="game-end-button">${this.$state.buttonMessage}</button>
			</div>
		`;
	}

	gameStart() {
		const displayElement = document.querySelector('.game-display');
		if (displayElement) {
			displayElement.innerHTML = this.templateStart();
			this.canvas();
		}
	}

	timer() {
		let seconds = 2;
		let time;
		const countdown = document.querySelector('.game-count');

		const updateTimer = () => {
			countdown.textContent = `${seconds}`;
		};

		const startTimer = () => {
			time = setInterval(() => {
				updateTimer();
				if (seconds === 0) {
					clearInterval(time);
					this.gameStart();
				} else {
					seconds--;
				}
			}, 1000);
		};
		startTimer();
	}

	canvas() {
		class Bar {
			constructor(x, y, w, h, i) {
				this.baseX = x;
				this.baseY = y;
				this.width = w;
				this.height = h;
				this.image = i;
				this.x = this.baseX * (canvas.width / BASEWIDTH);
				this.y = this.baseY * (canvas.height / BASEHEIGHT);
			}
			draw() {
				ctx.drawImage(this.image, this.x, this.y);
			}
			reCoordinate() {
				this.x = this.baseX * (canvas.width / BASEWIDTH);
			}
		}

		class Sphere {
			constructor(x, y, w, h) {
				this.baseX = x;
				this.baseY = y;
				this.width = w;
				this.height = h;
				this.x = this.baseX * (canvas.width / BASEWIDTH);
				this.y = this.baseY * (canvas.height / BASEHEIGHT);
			}
			draw() {
				ctx.drawImage(img_ball, this.x, this.y);
			}
			reCoordinate() {
				this.x = this.baseX * (canvas.width / BASEWIDTH);
			}
		}

		const displayElement = document.querySelector('.game-display');
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const BASEWIDTH = 637;
		const BASEHEIGHT = 446;
		canvas.width = displayElement.clientWidth;
		canvas.height = displayElement.clientHeight;

		let img_p1 = new Image();
		let img_p2 = new Image();
		let img_ball = new Image();
		img_p1.src = '../../../../static/images/player1_bar.png';
		img_p2.src = '../../../../static/images/player2_bar.png';
		img_ball.src = '../../../../static/images/ball2.png';

		let player1 = new Bar(10, 192, 19, 63, img_p1);
		let player2 = new Bar(608, 192, 19, 63, img_p2);
		let ball = new Sphere(309, 213, 20, 20);

		window.addEventListener('resize', (e) => {
			canvas.width = displayElement.clientWidth;
			canvas.height = displayElement.clientHeight;
			player1.reCoordinate();
			player2.reCoordinate();
			ball.reCoordinate();
		});

		function frame() {
			requestAnimationFrame(frame.bind(this));
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			player1.draw();
			player2.draw();
			ball.draw();

			player1.y = this.$state.player1_y;
			player2.y = this.$state.player2_y;
			ball.x = this.$state.ball_x;
			ball.y = this.$state.ball_y;
		}
		frame.call(this);
	}

	mounted() {
		if (!this.$state.game_id) {
			document.removeEventListener('keydown', this.event1);
			document.removeEventListener('keyup', this.event2);
			navigate('/select');
		} else {
			var player1 = document.querySelector('.player1-image');
			var player2 = document.querySelector('.player2-image');
			if (
				window.localStorage.getItem('gameMode') === 'local' ||
				window.localStorage.getItem('gameMode') === 'tournament'
			) {
				player1.style.backgroundImage =
					"url('../../../../static/images/player1_image2.png')";
				player2.style.backgroundImage =
					"url('../../../../static/images/player2_image.png')";
				player1.style.backgroundRepeat = 'round';
				player2.style.backgroundRepeat = 'round';
			} else if (window.localStorage.getItem('gameMode') === 'remote') {
				player1.style.backgroundImage = `url('${this.$state.player1_image}')`;
				player2.style.backgroundImage = `url('${this.$state.player2_image}')`;
				player1.style.backgroundRepeat = 'round';
				player2.style.backgroundRepeat = 'round';
			}
			this.timer();
		}
	}
}
