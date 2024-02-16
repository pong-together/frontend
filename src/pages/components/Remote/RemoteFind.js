import Component from '../Component.js';
import Wait from './RemoteWait.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none'
		};
	}

	template() {
		return `
			<div class="top-text">참가자를 찾았습니다!</div>
			<img src="static/images/exclamation-mark.png" id="exclamation">
			<button class="match-button">준비하기(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.querySelector('.match-button');
		
		function updateTimer() {
			buttonElement.textContent = `준비하기(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			// 매칭 화면으로 라우팅
			updateTimer();
			new Wait();
		}

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 0) {
					stopTimer();
				} else {
					seconds--;
				}
				updateTimer();
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
		this.addEventListener('click', '.match-button', e => {
			
		})
	}
}