import Component from "./Component.js";

export default class extends Component {
	setup() {
		this.$state = {
			participant: ["",""],
			checkDouble: "",
			gameMode: "2인용 기본게임",
		}
	}

	template() {
		return `
		<div class="main-container">
				<div class="info">${this.$state.gameMode}</div>
				<div class="contain">
					<div class="explaination">플레이어 닉네임을 입력해주세요.</div>
					<div class="local-nick-container">
						<input type="text" class="local-nick1" id="nickname" placeholder="Player1">
						<input type="text" class="local-nick2" id="nickname" placeholder="Player2">
					</div>
					<div class="error-nickname">${this.$state.checkDouble}</div>
					<button class="local-start">게임 시작</button>
				</div>
			</div>
		`
	}

	setEvent() {
		this.addEvent('click', '.local-start', ({ target }) => {
			const localPrev = this.$state.checkDouble;
			this.localInputNickname(target, localPrev);
		})
	}

	localCheckDuplicate(localNicknames) {
		const seen = {};
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (seen[nickname]){
				this.setState({ checkDouble: "중복된 닉네임입니다. 다시 입력해주세요." });
				return true;
			}
			seen[nickname] = true;
		}
		this.setState({ checkDouble: ""});
		return false;
	}

	localInputNickname(target, localPrev) {
		const localNicknames = [];
		const localNickname1 = document.querySelector('.local-nick1').value;
		const localNickname2 = document.querySelector('.local-nick2').value;
		localNicknames.push(localNickname1);
		localNicknames.push(localNickname2);
		console.log(localNicknames);

		const isDuplicate = this.localCheckDuplicate(localNicknames);
		if (isDuplicate) {
			target.disabled = true;
		}
	}
}