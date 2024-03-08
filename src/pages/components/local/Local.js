import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import http from '../../../core/http.js';
import store from '../../../store/index.js';
import LocalApi from './LocalApi.js';
import { navigate } from '../../../router/utils/navigate.js';

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
			participant: ['', ''],
			checkError: '',
			gameMode: store.state.gameLevel,
			region: localStorage.getItem('language')
				? localStorage.getItem('language')
				: 'kr',
			gamemodemessage: '',
		};
		console.log("!!");
		console.log('gamemode: ' + store.state.gameLevel);
		window.localStorage.setItem('gameMode', 'local');
		if (this.$state.gameMode == 'basic')
			this.$state.gamemodemessage =
				language.local[this.$state.region].normalGameMode;
		else
			this.$state.gamemodemessage =
				language.local[this.$state.region].extreamGameMode;
	}

	template() {
		return `
		<div class="main-container">
				<div class="info">${this.$state.gamemodemessage}</div>
				<div class="contain">
					<div class="explaination">${language.local[this.$state.region].localExplain}</div>
					<div class="local-nick-container">
						<input type="text" class="local-nick1" id="nickname" placeholder="${language.local[this.$state.region].player1}">
						<input type="text" class="local-nick2" id="nickname" placeholder="${language.local[this.$state.region].player2}">
					</div>
					<div class="error-nickname">${this.$state.checkError}</div>
					<button class="local-start">${language.local[this.$state.region].gameStartButton}</button>
				</div>
			</div>
		`;
	}

	async registLocalNickname(localNicknames) {
		var gamemode = '';
		if (this.$state.gameMode == 'basic') gamemode = 'default';
		else gamemode = 'extreme';

		const result = await LocalApi.create(localNicknames, gamemode);
		console.log(result);
		const { id } = result;
		window.localStorage.setItem('local-id', id);
	}

	setEvent() {
		this.addEvent('click', '.local-start', async ({ target }) => {
			const localPrev = this.$state.checkDouble;
			const isDuplicate = await this.localInputNickname(target, localPrev);

			if (!isDuplicate) {
				window.location.pathname = '/game';
			}
		});
	}

	localCheckDuplicate(localNicknames) {
		const seen = {};
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (seen[nickname]) {
				this.setState({
					checkError: `${language.local[this.$state.region].errorNickname}`,
				});
				return true;
			}
			seen[nickname] = true;
		}
		this.setState({ checkDouble: '' });
		return false;
	}

	localCheckEmpty(localNicknames) {
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (!nickname) {
				this.setState({
					checkError: `${language.local[this.$state.region].emptyNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	localCheckLength(localNicknames) {
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (nickname.length > 10) {
				this.setState({
					checkError: `${language.local[this.$state.region].lengthNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	async localInputNickname(target, localPrev) {
		const localNicknames = [];
		const localNickname1 = document.querySelector('.local-nick1').value;
		const localNickname2 = document.querySelector('.local-nick2').value;
		localNicknames.push(localNickname1);
		localNicknames.push(localNickname2);

		if (
			this.localCheckEmpty(localNicknames) ||
			this.localCheckDuplicate(localNicknames) ||
			this.localCheckLength(localNicknames)
		)
			return true;
		await this.registLocalNickname(localNicknames);
		return false;
	}

	mounted() {
		
	}
}
