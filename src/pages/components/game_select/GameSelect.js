import Component from '../Component.js';
import language from '../../../utils/language.js';

export default class extends Component {
	setup() {
		this.$state = {
			progress: 'main',
			mode: 'local',
			level: 'basic',
			localModal: 'none',
			tournamentModal: 'none',
			remoteModal: 'none',
		};
	}

	setEvent() {
		this.addEvent('click', '[data-button="game-role"]', () => {
			this.setState({ progress: 'role' });
		});

		this.addEvent('click', '[data-button="mode-select"]', () => {
			this.setState({ progress: 'mode' });
		});

		this.addEvent('click', '.game-select-mode .mode', (e) => {
			const modeValue = e.target.value;
			this.setState({
				mode: modeValue,
				localModal: 'none',
				tournamentModal: 'none',
				remoteModal: 'none',
			});
		});

		this.addEvent('click', '.game-select-difficult .level', (e) => {
			const levelValue = e.target.value;
			this.setState({ level: levelValue });
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
	}

	roleTemplate() {
		return `
		<div class="main-container">
		<div class="game-select-flex">
			<div class="game-role-box">
				${language.gameSelect.kr.roleBox}
			</div>
			<button data-button="mode-select" class="game-select-button">
				${language.gameSelect.kr.startBtn}
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
					<img src="../../../../static/images/selectLocal.png" alt="local game"/>
					<input type="checkbox" class="mode" value="local"> ${language.gameSelect.kr.localMode}
					<img src="../../../../static/images/selectModeInfo.png" alt="local mode info" class="select-modal" id="select-modal-local">
						<div class="select-modal-box" id="select-modal-local-info">
							<p>${language.gameSelect.kr.localModal}</p>
						</div>
					</img>

				</label>
				<label class="game-select-mode">
					<img src="../../../../static/images/selectTournament.png" alt="tourament game"/>
					<input type="checkbox" class="mode" value="tournament"> ${language.gameSelect.kr.tournamentMode}
					<img src="../../../../static/images/selectModeInfo.png" alt="tournament mode info" class="select-modal" id="select-modal-tournament">
						<div class="select-modal-box" id="select-modal-tournament-info">

							<p>${language.gameSelect.kr.tournamentModal}</p>
						</div>
					</img>
				</label>
				<label class="game-select-mode">
					<img src="../../../../static/images/selectRemote.png" alt="remote game"/>
					<input type="checkbox" class="mode" value="remote"> ${language.gameSelect.kr.remoteMode}
					<img src="../../../../static/images/selectModeInfo.png" alt="remote mode info" class="select-modal" id="select-modal-remote">
						<div class="select-modal-box" id="select-modal-remote-info">

							<p>${language.gameSelect.kr.remoteModal}</p>
						</div>
					</img>
				</label>
			</div>
			<div>
				<label class="game-select-difficult">
					<input type="checkbox" class="level" value="basic"> ${language.gameSelect.kr.levelOne}
				</label>
				<label class="game-select-difficult">
					<input type="checkbox" class="level" value="extreme"> ${language.gameSelect.kr.levelTwo}
				</label>
			</div>
			<button data-button="game-start" class="game-select-button">${language.gameSelect.kr.startBtn}</button>
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
						<button data-button="mode-select" class="game-select-button">${language.gameSelect.kr.startBtn}</button>
						<button data-button="game-role" class="game-select-button">${language.gameSelect.kr.roleBtn}</button>
					</div>
				</div>`;
			case 'role':
				return this.roleTemplate();
			case 'mode':
				return this.modeTemplate();
		}
	}

	mounted() {
		if (this.$state.progress === 'mode') {
			const localModal = document.getElementById('select-modal-local-info');
			const tournamentModal = document.getElementById(
				'select-modal-tournament-info',
			);
			const remoteModal = document.getElementById('select-modal-remote-info');

			console.log(localModal);
			console.log(tournamentModal);
			console.log(remoteModal);
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
