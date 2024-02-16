import Component from '../Component.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none',
			intraPicture: 'none',
			intraID: 'jonseo'
		};
	}

	template() {
		return `
			<div class="top-text">참가자를 찾았습니다!</div>
			<img src="static/images/intraPicture.png" id="picture">
			<button id="match-intra">${this.$state.intraID}(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.getElementById('match-intra');
		const bindUpdateTimer = updateTimer.bind(this);
		
		function updateTimer() {
			buttonElement.textContent = `${this.$state.intraID}(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			// 매칭 화면으로 라우팅
			bindUpdateTimer();
		}

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 0) {
					stopTimer();
				} else {
					seconds--;
				}
				bindUpdateTimer();
			}, 1000);
		}

		startTimer();
	}

	// 비동기로 백엔드로부터 매칭됐음을 받아오는 처리
	// await async

	render() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.template();
		this.timer();
	}

	mounted() {
		
	}
}