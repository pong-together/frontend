import Component from './Component.js';
import Router from '../router.js';
import Pages from '../pages.js';

export default class extends Component {
	setup() {
		this.$state = {
			next: false,
			home: false
		}
	}

	template() {
		return `
			<div class="container">
				<div class="mainbox">
					<div class="top-text">참가자 찾는중...</div>
					<img src="static/images/question-mark.png" class="match-image">
					<div id="counter"></div>
					<button class="match-button">취소하기</button>
				</div>
			</div>
		`;
	}

	timer(node) {
		let seconds = 5;
		let time;
		
		function updateTimer() {
			node.textContent = `준비하기(${seconds})`;
		}

		function stopTimer() {
			
		}

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 0) {
					this.$state.home = true;
					stopTimer();
				} else {
					seconds--;
				}
				updateTimer();
			}, 1000);
		}
	}

	findUser() {
		const topTextElement = document.querySelector('.top-text');
		const buttonElement = document.querySelector('.match-button');

		topTextElement.textContent = '참가자를 찾았습니다!';
		timer(buttonElement);
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
			findUser();
		}

		function startCounter() {
			count = setInterval(() => {
				// if (this.$state.next === true) {
				// 	this.$state.next = false;
				// 	stopCounter();
				// }
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

	setEvent() {
		this.addEvent('click', '.match-button', )
	}

	render() {
		this.$target.innerHTML = '';
		this.$target.innerHTML = this.template();
		this.mounted();
		this.counter();
	}
}
