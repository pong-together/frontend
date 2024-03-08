import Component from '../../../core/Component.js';
import Bracket from './Tournament-Bracket.js';
import language from '../../../utils/language.js';
import tourapi from '../tournament/TournamentApi.js';
import store from '../../../store/index.js';
import http from '../../../core/http.js';

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
			participant: [],
			checkError: '',
			gameMode: store.state.gameLevel,
			region: localStorage.getItem('language')
				? localStorage.getItem('language')
				: 'kr',
			gamemodemessage: '',
		};
		this.$store = this.$props;
		console.log('gamemode: ' + store.state.gameLevel);
		window.localStorage.setItem('gameMode', 'tournament');
		if (this.$state.gameMode == 'basic')
			this.$state.gamemodemessage =
				language.tournament[this.$state.region].normalGameMode;
		else
			this.$state.gamemodemessage =
				language.tournament[this.$state.region].extreamGameMode;
		// store.events.subscribe('tournamentIdChange', async () => this.render());
	}

	template() {
		return `
		<div class="main-container">
				<div class="info">${this.$state.gamemodemessage}</div>
				<div class="contain">
					<div class="explaination">${language.tournament[this.$state.region].tournamentExplain1}</div>
					<div class="explaination2">${language.tournament[this.$state.region].tournamentExplain2}</div>
					<div class="nick-container">
						<input type="text" class="nick1" id="nickname" placeholder="${language.tournament[this.$state.region].player1}">
						<input type="text" class="nick2" id="nickname" placeholder="${language.tournament[this.$state.region].player2}">
						<input type="text" class="nick3" id="nickname" placeholder="${language.tournament[this.$state.region].player3}">
						<input type="text" class="nick4" id="nickname" placeholder="${language.tournament[this.$state.region].player4}">
					</div>
					<div class="error-nickname">${this.$state.checkError}</div>
					<button class="start">${language.tournament[this.$state.region].startButton}</button>
				</div>
			</div>
		`;
	}

	async registNickname(nicknames) {
		var gamemode = '';
		if (this.$state.gameMode == 'basic') gamemode = 'default';
		else gamemode = 'extreme';
		//api부분
		const result = await tourapi.create(nicknames, gamemode);
		const { id } = result;
		window.localStorage.setItem('tournament-id', id);
	}

	setEvent() {
		this.addEvent('click', '.start', async ({ target }) => {
			const prev = this.$state.checkDouble;
			const isDuplicate = await this.inputNickname(target, prev);

			if (!isDuplicate) {
				new Bracket(this.$target, this.$props);
			}
		});
	}

	checkDuplicate(nicknames) {
		const seen = {};
		for (let i = 0; i < nicknames.length; i++) {
			const nickname = nicknames[i];
			if (seen[nickname]) {
				this.setState({
					checkError: `${language.tournament[this.$state.region].errorNickname}`,
				});
				return true;
			}
			seen[nickname] = true;
		}
		this.setState({ checkError: '' });
		return false;
	}

	checkEmpty(nicknames) {
		for (let i = 0; i < nicknames.length; i++) {
			const nickname = nicknames[i];
			if (!nickname) {
				this.setState({
					checkError: `${language.tournament[this.$state.region].emptyNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	checkLength(nicknames) {
		for (let i = 0; i < nicknames.length; i++) {
			const nickname = nicknames[i];
			if (nickname.length > 10) {
				this.setState({
					checkError: `${language.tournament[this.$state.region].lengthNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	async inputNickname(target, prev) {
		const nicknames = [];
		const nickname1 = document.querySelector('.nick1').value;
		const nickname2 = document.querySelector('.nick2').value;
		const nickname3 = document.querySelector('.nick3').value;
		const nickname4 = document.querySelector('.nick4').value;
		nicknames.push(nickname1);
		nicknames.push(nickname2);
		nicknames.push(nickname3);
		nicknames.push(nickname4);

		if (
			this.checkEmpty(nicknames) ||
			this.checkDuplicate(nicknames) ||
			this.checkLength(nicknames)
		) {
			return true;
		}
		await this.registNickname(nicknames);
		return false;
	}

	mounted() {
		
	}
}
