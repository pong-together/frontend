import Login from './components/login/Login.js';
import GameSelect from './components/game_select/GameSelect.js';
import Tournament from './components/Tournament.js';
import Remote from './components/Remote/Remote.js';
import Local from './components/Local.js';

export default (main, props) => {
	const login = () => new Login(main, props);
	const gameSelect = () => new GameSelect(main, props);
	const local = () => new Local(main, props);
	const tournament = () => new Tournament(main, props);
	const remote = () => new Remote(main, props);
	const game = () => null;

	return {
		login,
		gameSelect,
		local,
		tournament,
		remote,
		game,
	};
};
