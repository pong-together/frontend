import Component from '../../../core/Component.js';

export default class extends Component {

	template() {
        return `
		<div class="game-container">
			<div class="player1-container">
				<div class="player1-image"></div>
				<div class="player1-nickname">player1</div>
				<div class="player1-gameresult">Win</div>
				<div class="player1-score-info">score</div>
				<div class="player1-game-score">0</div>
			</div>
			<div class="game-display">
				<div class="game-background">
					
				</div>
			</div>
			<div class="player2-container">
				<div class="player2-game-score">0</div>
				<div class="player2-score-info">score</div>
				<div class="player2-gameresult">Lose</div>
				<div class="player2-nickname">player2</div>
				<div class="player2-image"></div>
			</div>
		</div>
		`;
    }
}