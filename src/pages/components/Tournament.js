import Component from "./Component.js";
import Bracket from "./Tournament-Bracket.js"

export default class extends Component{
	setup() {
		this.$state = {
			participant: ["","","",""],
			checkDouble: "",
			gameMode: "임시 게임모드"
		} 
	}

	template () {
		return `
		<div class="main-container">
				<div class="info">${this.$state.gameMode}</div>
				<div class="contain">
					<div class="explaination">토너먼트 참가자 닉네임을 입력해주세요.</div>
					<div class="explaination2">랜덤으로 매치됩니다.</div>
					<div class="nick-container">
						<input type="text" class="nick1" id="nickname" placeholder="Player1">
						<input type="text" class="nick2" id="nickname" placeholder="Player2">
						<input type="text" class="nick3" id="nickname" placeholder="Player3">
						<input type="text" class="nick4" id="nickname" placeholder="Player4">
					</div>
					<div class="error-nickname">${this.$state.checkDouble}</div>
					<button class="start">매칭하기</button>
				</div>
			</div>
		`
	}

	setEvent() {
		this.addEvent('click', '.start', ({ target }) => {
			const prev = this.$state.checkDouble;
			const isDuplicate = this.inputNickname(target, prev);

			if (!isDuplicate) {
				const newComponent = new Bracket(this.$target);
				this.changeComponent(newComponent);
			}
		})
	}

	checkDuplicate(nicknames) {
		const seen = {};
		for (let i = 0; i < nicknames.length; i++) {
			const nickname = nicknames[i];
			if (seen[nickname]){
				this.setState({ checkDouble: "중복된 닉네임입니다. 다시 입력해주세요." });
				return true;
			}
			seen[nickname] = true;
		}
		this.setState({ checkDouble: ""});
		return false;
	}

	inputNickname(target, prev) {
		const nicknames = [];
		const nickname1 = document.querySelector('.nick1').value;
		const nickname2 = document.querySelector('.nick2').value;
		const nickname3 = document.querySelector('.nick3').value;
		const nickname4 = document.querySelector('.nick4').value;
		nicknames.push(nickname1);
		nicknames.push(nickname2);
		nicknames.push(nickname3);
		nicknames.push(nickname4);

		const isDuplicate = this.checkDuplicate(nicknames);
		if (isDuplicate) {
			target.disabled = true;
		}
		return isDuplicate;
	}
}