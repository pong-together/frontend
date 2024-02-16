import Component from "./Component.js"

export default class extends Component {
	setup() {
		this.$state = {
			participant: ["jugwak","jonseo","sooyang","yeepark"],
			gameround: 3,
			winner: ["jonseo", "yeepark", ""],
			gameMode: "임시 게임모드"
		} 
	}

	template() {
		return `
			<div class="main-container-bracket">
			<div class="info">${this.$state.gameMode}</div>
				<div class="bracket-container">
				<div class="tournament-bracket">
					<div class="crownball">
						<div class="tournament-crown"></div>
						<div class="tournament-ball"></div>
					</div>
					<div class="finalgame-winner-line"></div>
					<div class="finalgame-line-container">
						<div class="finalgame-rightline"></div>
						<div class="finalgame-vertline1"></div>
						<div class="finalgame-vertline2"></div>
						<div class="finalgame-leftline"></div>
					</div>
					<div class="winner-players">
						<div class="game1-winner" id="player"></div>
						<div class="game2-winner" id="player"></div>
					</div>
					<div class="winner-line-container">
						<div class="game1-winner-line"></div>
						<div class="game2-winner-line"></div>
					</div>
					<div class="connector">
						<div class="game1-rightline"></div>
						<div class="game1-vertline1"></div>
						<div class="game1-vertline2"></div>
						<div class="game1-leftline"></div>
						<div class="game2-rightline"></div>
						<div class="game2-vertline1"></div>
						<div class="game2-vertline2"></div>
						<div class="game2-leftline"></div>
					</div>
					<div class="players">
						<div class="player1" id="player">${this.$state.participant[0]}</div>
						<div class="player2" id="player">${this.$state.participant[1]}</div>
						<div class="player3" id="player">${this.$state.participant[2]}</div>
						<div class="player4" id="player">${this.$state.participant[3]}</div>
					</div>
				</div>
				<div class="gameinfo-container">
					<div class="firstgame-info1">4강 첫번째 경기</div>
					<div class="firstgame-info2">4강 두번째 경기</div>
				</div>
				<button class="game-start">경기 시작하기</button>
			</div>
		</div>
		`
	}

	gameRoundOne(playerBox1, playerBox2, playerBox3) {
		const rightline = document.querySelector('.game1-rightline');
		rightline.style.width = "5px";
		const vertline1 = document.querySelector('.game1-vertline1');
		vertline1.style.height = "5px";
		const vertline2 = document.querySelector('.game1-vertline2');
		vertline2.style.height = "5px";
		const leftline = document.querySelector('.game1-leftline');
		leftline.style.width = "5px";
		const winnerLine = document.querySelector('.game1-winner-line');
		winnerLine.style.width = "5px";
		playerBox1.style.border = "5px solid white";
		playerBox2.style.border = "5px solid white";
		playerBox3.style.marginLeft = "95px";
	}

	gameRoundTwoPlayerOneBorderLine(playerBox1, playerBox2, winner) {
		playerBox1.style.backgroundColor = 'lightgray';
		playerBox1.textContent = "";
		playerBox2.style.backgroundColor = 'lightgray';

		//set winner
		const game1Winner = document.querySelector('.game1-winner');
		game1Winner.textContent = winner;
		game1Winner.style.border = "5px solid white";

		//game1 line
		const game1Rightline = document.querySelector('.game1-rightline');
		game1Rightline.style.width = "5px";
		const game1Vertline1 = document.querySelector('.game1-vertline1');
		game1Vertline1.style.height = "5px";
		const game1WinnerLine = document.querySelector('.game1-winner-line');
		game1WinnerLine.style.width = "5px";
		const game1Vertline2 = document.querySelector('.game1-vertline2');
		game1Vertline2.style.display = "none";
		const game1Leftline = document.querySelector('.game1-leftline');
		game1Leftline.style.display = "none";

		return game1Winner;
	}

	gameRoundTwoPlayerTwoBorderLine(playerBox1, playerBox2, winner) {
		playerBox1.style.backgroundColor = 'lightgray';
		playerBox1.textContent = "";
		playerBox2.style.backgroundColor = 'lightgray';

		//set winner
		const game1Winner = document.querySelector('.game1-winner');
		game1Winner.textContent = winner;
		game1Winner.style.border = "5px solid white";

		//game1 line
		const game1Rightline = document.querySelector('.game1-leftline');
		game1Rightline.style.width = "5px";
		const game1Vertline1 = document.querySelector('.game1-vertline2');
		game1Vertline1.style.height = "5px";
		game1Vertline1.style.marginLeft = "160px";
		const game1WinnerLine = document.querySelector('.game1-winner-line');
		game1WinnerLine.style.width = "5px";
		const game1Vertline2 = document.querySelector('.game1-vertline1');
		game1Vertline2.style.display = "none";
		const game1Leftline = document.querySelector('.game1-rightline');
		game1Leftline.style.display = "none";

		return game1Winner;
	}

	gameRoundTwoPlayerOne(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		playerBox3.style.border = "5px solid white";
		playerBox4.style.border = "5px solid white";
		this.gameRoundTwoPlayerOneBorderLine(playerBox1, playerBox2, winner);

		//game2 line
		const rightline = document.querySelector('.game2-rightline');
		rightline.style.width = "5px";
		rightline.style.marginLeft = "340px";
		const vertline1 = document.querySelector('.game2-vertline1');
		vertline1.style.height = "5px";
		const vertline2 = document.querySelector('.game2-vertline2');
		vertline2.style.height = "5px";
		const leftline = document.querySelector('.game2-leftline');
		leftline.style.width = "5px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
		// winnerLine.style.height = "25px";
	}

	gameRoundTwoPlayerTwo(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		playerBox3.style.border = "5px solid white";
		playerBox4.style.border = "5px solid white";

		this.gameRoundTwoPlayerTwoBorderLine(playerBox1, playerBox2, winner);
		//game2 line
		const rightline = document.querySelector('.game2-rightline');
		rightline.style.width = "5px";
		const vertline1 = document.querySelector('.game2-vertline1');
		vertline1.style.height = "5px";
		const vertline2 = document.querySelector('.game2-vertline2');
		vertline2.style.height = "5px";
		const leftline = document.querySelector('.game2-leftline');
		leftline.style.width = "5px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
	}

	gameRoundThreePlayerOneThree(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		const game1Winner = this.gameRoundTwoPlayerOneBorderLine(playerBox1, playerBox2, winner[0]);

		playerBox3.style.backgroundColor = "lightgray";
		playerBox4.style.backgroundColor = "lightgray";
		playerBox3.textContent = "";

		const game2Winner = document.querySelector('.game2-winner');
		game2Winner.textContent = winner[1];
		game2Winner.style.border = "5px solid white";

		//game2 line
		const rightline = document.querySelector('.game2-rightline');
		rightline.style.width = "5px";
		rightline.style.marginLeft = "335px"
		const vertline1 = document.querySelector('.game2-vertline1');
		vertline1.style.height = "5px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
		const vertline2 = document.querySelector('.game2-vertline2');
		vertline2.style.display = "none";
		const leftline = document.querySelector('.game2-leftline');
		leftline.style.display = "none";

		console.log(game1Winner)
		if (winner[2] !== "" && winner[2] === game1Winner.textContent)
			this.finalGameLineLeftBorder(game1Winner, game2Winner);
		else if (winner[2] !== "" && winner[2] === game2Winner.textContent)
			this.finalGameLineRightBorder(game1Winner, game2Winner);
	}

	gameRoundThreePlayerOneFour(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		const game1Winner = this.gameRoundTwoPlayerOneBorderLine(playerBox1, playerBox2, winner[0]);

		playerBox3.style.backgroundColor = "lightgray";
		playerBox4.style.backgroundColor = "lightgray";
		playerBox3.textContent = "";

		const game2Winner = document.querySelector('.game2-winner');
		game2Winner.textContent = winner[1];
		game2Winner.style.border = "5px solid white";

		//game2 line
		const rightline = document.querySelector('.game2-leftline');
		rightline.style.width = "5px";
		// rightline.style.marginLeft = "335px"
		const vertline1 = document.querySelector('.game2-vertline2');
		vertline1.style.height = "5px";
		vertline1.style.marginLeft = "423px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
		const vertline2 = document.querySelector('.game2-vertline1');
		vertline2.style.display = "none";
		const leftline = document.querySelector('.game2-rightline');
		leftline.style.display = "none";

		console.log(game1Winner.textContent)
		if (winner[2] !== "" && winner[2] === game1Winner.textContent)
			this.finalGameLineLeftBorder(game1Winner, game2Winner);
		else if (winner[2] !== "" && winner[2] === game2Winner.textContent)
			this.finalGameLineRightBorder(game1Winner, game2Winner);
	}

	gameRoundThreePlayerTwoThree(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		const game1Winner = this.gameRoundTwoPlayerTwoBorderLine(playerBox1, playerBox2, winner[0]);

		playerBox3.style.backgroundColor = "lightgray";
		playerBox4.style.backgroundColor = "lightgray";
		playerBox3.textContent = "";

		const game2Winner = document.querySelector('.game2-winner');
		game2Winner.textContent = winner[1];
		game2Winner.style.border = "5px solid white";

		//game2 line
		const rightline = document.querySelector('.game2-rightline');
		rightline.style.width = "5px";
		rightline.style.marginLeft = "250px"
		const vertline1 = document.querySelector('.game2-vertline1');
		vertline1.style.height = "5px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
		const vertline2 = document.querySelector('.game2-vertline2');
		vertline2.style.display = "none";
		const leftline = document.querySelector('.game2-leftline');
		leftline.style.display = "none";

		if (winner[2] !== "" && winner[2] === game1Winner.textContent)
			this.finalGameLineLeftBorder(game1Winner, game2Winner);
		else if (winner[2] !== "" && winner[2] === game2Winner.textContent)
			this.finalGameLineRightBorder(game1Winner, game2Winner);
	}

	gameRoundThreePlayerTwoFour(playerBox1, playerBox2, playerBox3, playerBox4, winner) {
		const game1Winner = this.gameRoundTwoPlayerTwoBorderLine(playerBox1, playerBox2, winner[0]);
		playerBox3.style.backgroundColor = "lightgray";
		playerBox4.style.backgroundColor = "lightgray";
		playerBox3.textContent = "";

		const game2Winner = document.querySelector('.game2-winner');
		game2Winner.textContent = winner[1];
		game2Winner.style.border = "5px solid white";

		//game2 line
		const rightline = document.querySelector('.game2-leftline');
		rightline.style.width = "5px";
		// rightline.style.marginLeft = "335px"
		const vertline1 = document.querySelector('.game2-vertline2');
		vertline1.style.height = "5px";
		vertline1.style.marginLeft = "338px";
		const winnerLine = document.querySelector('.game2-winner-line');
		winnerLine.style.width = "5px";
		const vertline2 = document.querySelector('.game2-vertline1');
		vertline2.style.display = "none";
		const leftline = document.querySelector('.game2-rightline');
		leftline.style.display = "none";

		if (winner[2] !== "" && winner[2] === game1Winner.textContent)
			this.finalGameLineLeftBorder(game1Winner, game2Winner);
		else if (winner[2] !== "" && winner[2] === game2Winner.textContent)
			this.finalGameLineRightBorder(game1Winner, game2Winner);
	}

	finalGameLineRightBorder(game1Winner, game2Winner) {
		game1Winner.style.backgroundColor = "lightgray";
		game1Winner.style.border = "none";

		const finalGameLeftLine = document.querySelector('.finalgame-leftline');
		finalGameLeftLine.style.width = "5px";
		// finalGameLeftLine.style.marginLeft = "375px"
		const finalGameVertLine2 = document.querySelector('.finalgame-vertline2');
		finalGameVertLine2.style.height = "5px";
		finalGameVertLine2.style.marginLeft = "375px"
		const finalGameRightLine = document.querySelector('.finalgame-rightline');
		finalGameRightLine.style.display = "none";
		const finalGameVertLine1 = document.querySelector('.finalgame-vertline1');
		finalGameVertLine1.style.display = "none";
		const finalGameWinnerLine = document.querySelector('.finalgame-winner-line');
		finalGameWinnerLine.style.width = "5px";
	}

	finalGameLineLeftBorder(game1Winner, game2Winner) {
		game2Winner.style.backgroundColor = "lightgray";
		game2Winner.style.border = "none";

		const finalGameLeftLine = document.querySelector('.finalgame-leftline');
		finalGameLeftLine.style.display = "none";
		const finalGameVertLine2 = document.querySelector('.finalgame-vertline2');
		finalGameVertLine2.style.display = "none";
		const finalGameRightLine = document.querySelector('.finalgame-rightline');
		finalGameRightLine.style.width = "5px";
		const finalGameVertLine1 = document.querySelector('.finalgame-vertline1');
		finalGameVertLine1.style.height = "5px";
		const finalGameWinnerLine = document.querySelector('.finalgame-winner-line');
		finalGameWinnerLine.style.width = "5px";
	}

	mounted() {
		const playerBox1 = document.querySelector('.player1');
		const playerBox2 = document.querySelector('.player2');
		const playerBox3 = document.querySelector('.player3');
		const playerBox4 = document.querySelector('.player4');
		const game1WinnerBox = document.querySelector('.game1-winner');
		const game2WinnerBox = document.querySelector('.game2-winner');
		if (this.$state.gameround === 1)
			this.gameRoundOne(playerBox1, playerBox2, playerBox3);
		else if (this.$state.gameround === 2 && (this.$state.winner[0] === playerBox1.textContent))
			this.gameRoundTwoPlayerOne(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner[0]);
		else if (this.$state.gameround === 2 && (this.$state.winner[0] === playerBox2.textContent))
			this.gameRoundTwoPlayerTwo(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner[0]);
		else if (this.$state.gameround === 3 && (this.$state.winner[0] === playerBox1.textContent) && (this.$state.winner[1] === playerBox3.textContent))
			this.gameRoundThreePlayerOneThree(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner);
		else if (this.$state.gameround === 3 && (this.$state.winner[0] === playerBox1.textContent) && (this.$state.winner[1] === playerBox4.textContent))
			this.gameRoundThreePlayerOneFour(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner);
		else if (this.$state.gameround >= 3 && (this.$state.winner[0] === playerBox2.textContent) && (this.$state.winner[1] === playerBox3.textContent))
			this.gameRoundThreePlayerTwoThree(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner);
		else if (this.$state.gameround >= 3 && (this.$state.winner[0] === playerBox2.textContent) && (this.$state.winner[1] === playerBox4.textContent))
			this.gameRoundThreePlayerTwoFour(playerBox1, playerBox2, playerBox3, playerBox4, this.$state.winner);
	}
}