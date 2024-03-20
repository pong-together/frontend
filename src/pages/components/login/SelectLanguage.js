import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import store from '../../../store/index.js';
import http from '../../../core/http.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class extends Component {
	setup() {
		this.$state = {
			region: store.state.language,
		};
	}

	setEvent() {
		this.addEvent('click', '.login-language-select-btn', () => {
			const $select = this.$target.querySelector('#language-select');
			const selectedLanguage = $select.value;
			this.setState({ region: selectedLanguage });
			localStorage.setItem('language', this.$state.region);
			store.dispatch('changeLanguage', this.$state.region);
		});

		this.addEvent('click', '#login-to-start', async () => {
			try {
				const accessToken = 'Bearer ' + localStorage.getItem('accessToken');
				const data = await http.get(`${BASE_URL}/api/userinfo/`, {
					Authorization: accessToken,
					'Content-Type': 'application/json',
				});
				// console.log(data);
				if (data) {
					localStorage.setItem('intraId', data?.intra_id);
					store.dispatch('changeIntraId', data?.intra_id);
					localStorage.setItem('winCount', data?.win_count);
					store.dispatch('changeWinCount', data?.win_count);
					localStorage.setItem('loseCount', data?.lose_count);
					store.dispatch('changeLoseCount', data?.lose_count);
					localStorage.setItem('intraImg', data?.image);
					store.dispatch('changeIntraImg', data?.image);
					if (data?.win_count + data?.lose_count !== 0) {
						localStorage.setItem(
							'rate',
							(data?.win_count / (data?.lose_count + data?.win_count)) * 100,
						);
					} else {
						localStorage.setItem('rate', 0);
					}
				}
			} catch (e) {}

			store.dispatch('changeLoginProgress', 'done');
		});
	}

	template() {
		return `
		<img src="/static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper">
		<div>
			<div class="language-select">
				<select name="language-select" id="language-select" class="login-language-select-wrapper">
					<option value="kr">
						<img src="/static/images/korean.png" alt="korean" />한국어
					</option>
					<option value="en">
						<img src="/static/images/american.png" alt="american" />English
					</option>
					<option value="jp">
						<img src="/static/images/japanese.png" alt="japanese" />日本語
					</option>
				</select>
				<input type="submit" value="${language.login[store.state.language].languageSelect}" class="login-language-select-btn" />
			</div>
			<button class="login-btn" id="login-to-start">${language.login[store.state.language].gameStartBtn}</button>
		</div>
		</div>`;
	}

	mounted() {
		const $select = this.$target.querySelector('#language-select');
		const selectedRegion = this.$state.region;

		$select.querySelectorAll('option').forEach((option) => {
			if (option.value === selectedRegion) {
				option.selected = true;
			}
		});
	}
}
