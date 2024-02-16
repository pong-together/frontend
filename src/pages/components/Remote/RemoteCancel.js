import Component from '../Component.js';
import Find from './RemoteFind.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none'
		};
	}

	template() {
		return `
			<div class="top-text">참가자 찾는중...</div>
			<img src="static/images/question-mark.png" id="question">
			<div id="counter"></div>
			<button class="match-button">취소하기</button>
		`;
	}

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		
		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		function stopCounter() {
			clearInterval(count);
			// counterElement.remove();
			updateCounter();
			new Find();
		}

		function startCounter() {
			count = setInterval(() => {
				// if (this.$state.next === true) {
				// 	this.$state.next = false;
				// 	stopCounter();
				// }
				if (seconds === 3) {
					stopCounter();
				}
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		}

		startCounter();
	}

	// 비동기로 백엔드로부터 매칭됐음을 받아오는 처리
	// await async

	render() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = '';
		mainboxElement.innerHTML = this.template();
		this.counter();
	}

	mounted() {
		this.addEventListener('click', '.match-button', e => {
			
		})
	}
}