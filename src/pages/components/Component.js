export default class {
	$target;
	$props;
	$state;

	constructor($target, $props) {
		this.$target = $target;
		this.$props = $props;
		this.setup();
		this.setEvent();
		this.render();
	}

	// component state 설정
	setup() {}

	// 컴포넌트가 마운트 됐을 때
	mounted() {}

	// 화면에 그려질 ui 템플릿
	template() {
		return ``;
	}

	// 실제 화면에 그려지는 동작
	render() {
		this.$target.innerHTML = '';
		this.$target.innerHTML = this.template();
		this.mounted();
	}

	// 컴포넌트 내에서 필요한 이벤트 설정
	setEvent() {}

	// 상태 변경 후 렌더링
	setState(newState) {
		this.$state = { ...this.$state, ...newState };
		this.render();
	}

	addEvent(eventType, seletor, callback) {
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(seletor)) return false;
			callback(event);
		});
	}
}
