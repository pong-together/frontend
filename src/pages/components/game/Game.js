import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import GameReady from './GameReady.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
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
			player: [],
			gameMode: window.localStorage.getItem('gameMode'),
			player1_result: '',
			player1_score: '',
			player2_result: '',
			player2_score: '',
		}
	}

	template() {
		return `
			<div class="game-container">
				<div class="player1-container">
					<div class="player1-image"></div>
					<div class="player1-nickname">${this.$state.player[0]}</div>
					<div class="player1-gameresult"${this.$state.player1_result}</div>
					<div class="player1-score-info">score</div>
					<div class="player1-game-score">${this.$state.player1_score}</div>
				</div>
				<div class="game-display"></div>
				<div class="player2-container">
					<div class="player2-game-score">${this.$state.player2_score}</div>
					<div class="player2-score-info">score</div>
					<div class="player2-gameresult">${this.$state.player2_result}</div>
					<div class="player2-nickname">${this.$state.player[1]}</div>
					<div class="player2-image"></div>
				</div>
			</div>
		`;
	}

	// connectGameSocket() {
	// 	const gameSocket = new WebSocket(
	// 		`${SOCLKET_URL}/ws/chats/?token=${localStorage.getItem('accessToken')} type=${localStorage.getItem('gameMode')} type_id=${localStorage.getItem('tournament-id')}`,
	// 	)
		
	// 	gameSocket.onopen = () => {
	// 		this.addEvent('keypress', '.game-display', (e) => {
	// 			if (e.key === 'w')
	// 		})
	// 	}
	// }

	mounted() {
		new GameReady(document.querySelector('.game-display'));
	}
}
