import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import store from '../../../store/index.js';
import http from '../../../core/http.js';
import { navigate } from '../../../router/utils/navigate.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class GameSelect extends Component {
	// static instance = null;

	// static getInstance($container) {
	// 	if (GameSelect.instance === null) {
	// 		GameSelect.instance = new GameSelect($container);
	// 	}
	// 	console.log('game select',GameSelect.instance);
	// 	return GameSelect.instance;
	// }

	async setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')) {
			// window.location.pathname = '/login';
			navigate("/login", true);
		} else {
			http.checkToken();
		}

		if (localStorage.getItem('language')) {
			store.dispatch('changeLanguage', localStorage.getItem('language'));
		}
		this.$state = {
			progress: 'main',
			mode: 'local',
			level: 'default',
			localModal: 'none',
			tournamentModal: 'none',
			remoteModal: 'none',
		};
		if (
			!localStorage.getItem('intraId') ||
			localStorage.getItem('intraId') === 'undefined' ||
			!localStorage.getItem('winCount') ||
			localStorage.getItem('winCount') === 'undefined' ||
			!localStorage.getItem('loseCount') ||
			localStorage.getItem('loseCount') === 'undefined' ||
			!localStorage.getItem('intraImg') ||
			localStorage.getItem('intraImg') === 'undefined'
		) {
			console.log("전적 http 요청");
			const data = await http.get(`${BASE_URL}/api/userinfo/`, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				'Content-Type': 'application/json',
			});
			localStorage.setItem('intraId', data?.intra_id || 'anonymous');
			localStorage.setItem('winCount', data?.win_count || 0);
			localStorage.setItem('loseCount', data?.lose_count || 0);
			localStorage.setItem(
				'intraImg',
				data?.image || '/static/images/user.png',
			);
			console.log("전적 요청 완료");
		}
	}

	setEvent() {
		this.addEvent('click', '[data-button="game-role"]', (e) => {
			e.stopPropagation();
			this.setState({ progress: 'role' });
		});

		this.addEvent('click', '[data-button="mode-select"]', (e) => {
			e.stopPropagation();
			this.setState({ progress: 'mode' });
		});

		this.addEvent('click', '[data-button="game-start"]', (e) => {
			e.stopPropagation();
		});

		this.addEvent('click', '.game-select-mode .mode', (e) => {
			e.stopPropagation();
			const modeValue = e.target.value;
			this.setState({
				mode: modeValue,
				localModal: 'none',
				tournamentModal: 'none',
				remoteModal: 'none',
			});
			store.dispatch('gameModeChange', this.$state.mode);
		});

		this.addEvent('click', '.game-select-difficult .level', (e) => {
			e.stopPropagation();
			const levelValue = e.target.value;
			this.setState({ level: levelValue });
			store.dispatch('gameLevelChange', this.$state.level);
		});

		this.addEvent('click', '#select-modal-local', () => {
			if (this.$state.localModal === 'none')
				this.setState({
					localModal: 'block',
					tournamentModal: 'none',
					remoteModal: 'none',
				});
			else this.setState({ localModal: 'none' });
		});

		this.addEvent('click', '#select-modal-tournament', () => {
			if (this.$state.tournamentModal === 'none')
				this.setState({
					localModal: 'none',
					tournamentModal: 'block',
					remoteModal: 'none',
				});
			else this.setState({ tournamentModal: 'none' });
		});

		this.addEvent('click', '#select-modal-remote', () => {
			if (this.$state.remoteModal === 'none')
				this.setState({
					remoteModal: 'block',
					localModal: 'none',
					tournamentModal: 'none',
				});
			else this.setState({ remoteModal: 'none' });
		});

		this.addEvent('click', '#game-mode-button', (e) => {
			e.stopPropagation();
			localStorage.setItem('gameMode', this.$state.mode);
			localStorage.setItem('gameLevel', this.$state.level);
			if (this.$state.mode === 'local') {
				navigate("/local");
			} else if (this.$state.mode === 'tournament') {
				navigate("/tournament")
			} else if (this.$state.mode === 'remote') {
				navigate("/remote");
			}
		});
	}

	roleTemplate() {
		return `
		<div class="main-container">
		<div class="game-select-flex">
			<div class="game-role-box">
			<p>${language.gameSelect[store.state.language].roleBox}</P>
			<p>${language.gameSelect[store.state.language].roleBox2}</P>
			<p>${language.gameSelect[store.state.language].roleBox3}</P>
			</div>
			<button data-button="mode-select" class="game-select-button">
				${language.gameSelect[store.state.language].startBtn}
			</button>
			</div>
		</div>`;
	}

	modeTemplate() {
		return `
		<div class="main-container">
		<div class="game-select-flex">
			<div style="display:flex;">
				<label class="game-select-mode">
					<img src="/static/images/selectLocal.png" alt="local game"/>
					<input type="checkbox" class="mode" value="local"> ${language.gameSelect[store.state.language].localMode}
					<img src="/static/images/selectModeInfo.png" alt="local mode info" class="select-modal" id="select-modal-local">
						<div class="select-modal-box" id="select-modal-local-info">
							<p>${language.gameSelect[store.state.language].localModal}</p>
						</div>
					</img>

				</label>
				<label class="game-select-mode">
					<img src="/static/images/selectTournament.png" alt="tourament game"/>
					<input type="checkbox" class="mode" value="tournament"> ${language.gameSelect[store.state.language].tournamentMode}
					<img src="/static/images/selectModeInfo.png" alt="tournament mode info" class="select-modal" id="select-modal-tournament">
						<div class="select-modal-box" id="select-modal-tournament-info">

							<p>${language.gameSelect[store.state.language].tournamentModal}</p>
						</div>
					</img>
				</label>
				<label class="game-select-mode">
					<img src="/static/images/selectRemote.png" alt="remote game"/>
					<input type="checkbox" class="mode" value="remote"> ${language.gameSelect[store.state.language].remoteMode}
					<img src="/static/images/selectModeInfo.png" alt="remote mode info" class="select-modal" id="select-modal-remote">
						<div class="select-modal-box" id="select-modal-remote-info">

							<p>${language.gameSelect[store.state.language].remoteModal}</p>
						</div>
					</img>
				</label>
			</div>
			<div>
				<label class="game-select-difficult">
					<input type="checkbox" class="level" value="default"> ${language.gameSelect[store.state.language].levelOne}
				</label>
				<label class="game-select-difficult">
					<input type="checkbox" class="level" value="extreme"> ${language.gameSelect[store.state.language].levelTwo}
				</label>
			</div>
			<button data-button="game-start" id="game-mode-button" class="game-select-button">${language.gameSelect[store.state.language].startBtn}</button>
		</div>
		</div>
		`;
	}

	template() {
		switch (this.$state.progress) {
			case 'main':
				return `
				<div class="main-container">
					<div class="game-select-flex">
						<button data-button="mode-select" class="game-select-button">${language.gameSelect[store.state.language].startBtn}</button>
						<button data-button="game-role" class="game-select-button">${language.gameSelect[store.state.language].roleBtn}</button>
					</div>
				</div>`;
			case 'role':
				return this.roleTemplate();
			case 'mode':
				return this.modeTemplate();
		}
	}

	async mounted() {
		if (this.$state.progress === 'mode') {
			const localModal = document.getElementById('select-modal-local-info');
			const tournamentModal = document.getElementById(
				'select-modal-tournament-info',
			);
			const remoteModal = document.getElementById('select-modal-remote-info');

			if (this.$state.localModal === 'block') {
				localModal.style.display = 'block';
			}
			if (this.$state.tournamentModal === 'block') {
				tournamentModal.style.display = 'block';
			}
			if (this.$state.remoteModal === 'block') {
				remoteModal.style.display = 'block';
			}

			document.querySelectorAll('.game-select-mode').forEach((label) => {
				const checkbox = label.querySelector('.mode');
				if (checkbox.value !== this.$state.mode) {
					checkbox.checked = false; // 현재 선택한 것 외에는 모두 선택 해제
					label.classList.remove('checked');
				} else {
					checkbox.checked = true;
					label.classList.add('checked');
				}
			});
		}

		document
			.querySelectorAll('.game-select-difficult .level')
			.forEach((checkbox) => {
				if (checkbox.value !== this.$state.level) {
					checkbox.checked = false;
				} else {
					checkbox.checked = true;
				}
			});
	}
}
