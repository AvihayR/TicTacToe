//GameBoard module
const GameBoard = (() => {
  //initiate a 3X3 gameBoard:
  let physicalBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  let _currentPlayer;

  const showCurrentPlayer = () => {
    let player = _currentPlayer;
    return player;
  };

  const checkForWinner = () => {
    //check rows & cols:
    for (let i = 0; i < 3; i++) {
      if (
        physicalBoard[i].every((square) => square === _currentPlayer) ||
        physicalBoard.every((row) => row[i] === _currentPlayer)
      ) {
        return true;
      }
    }

    //Check Diagonals:
    if (
      (physicalBoard[0][0] == _currentPlayer &&
        physicalBoard[1][1] == _currentPlayer &&
        physicalBoard[2][2] == _currentPlayer) ||
      (physicalBoard[0][2] == _currentPlayer &&
        physicalBoard[1][1] == _currentPlayer &&
        physicalBoard[2][0] == _currentPlayer)
    ) {
      return true;
    }
    return false;
  };

  const _endRound = () => {
    physicalBoard = physicalBoard.map((arr) => arr.map((i) => (i = '')));
  };

  //Add player sign to the chosen location:
  const play = (sign, row, col) => {
    _currentPlayer = sign;
    if (physicalBoard[row][col] == '') {
      physicalBoard[row][col] = _currentPlayer;
      console.log(`Is winner: ${checkForWinner()}`);
      console.log(physicalBoard);
      //End game if there's a winner:
      if (checkForWinner() === true) {
        //_endRound();
        console.log(physicalBoard, checkForWinner());
      }
    }
  };

  return { play, checkForWinner, showCurrentPlayer };
})();

//run example:
//GameBoard.play('x',3);

//factory function - Player:
const Player = (sign) => {
  const _playerSign = sign;
  //play method to choose a next spot to play in:
  const play = (row, col) => {
    GameBoard.play(_playerSign, row, col);
  };
  return { play };
};

//run example:
//const myPlayer = Player('x');
//myPlayer.play(0)

const scoreBoard = (() => {
  let players = {};
  const registerPlayers = ([name1, sign1], [name2, sign2]) => {
    players[name1] = { sign: sign1, score: 0 };
    players[name2] = { sign: sign2, score: 0 };
    console.log(players);
  };

  const addPoint = (name) => {
    players[name].score += 1;
    return players;
  };
  return { registerPlayers, addPoint };
})();

//Query selectors:
let playersForm = document.querySelector('.players');
let playBtn = document.querySelector('.play-btn');
let playerOneName = document.getElementById('player-1-name');
let playerTwoName = document.getElementById('player-2-name');
let playerOneSign = document.getElementById('player-1-sign');
let playerTwoSign = document.getElementById('player-2-sign');

//DOM:
playBtn.addEventListener('click', () => {
  scoreBoard.registerPlayers(
    [playerOneName.value, playerOneSign.textContent],
    [playerTwoName.value, playerTwoSign.textContent]
  );
  const playerOne = Player(playerOneSign.textContent);
  const playerTwo = Player(playerTwoSign.textContent);
});

//
//
//
/*
const gameFlow = (() => {
  //score board obj - private variable
  let _scoreBoard = {};

  //set players on scoreBoard:
  const setPlayers = (playerSign1, playerSign2) => {
    _scoreBoard.playerSign1;
    _scoreBoard.playerSign2;
  };

  const addPoint = () => {
    if (GameBoard.checkForWinner() === true) {
      let playerSign = GameBoard.showCurrentPlayer();
      _scoreBoard.playerSign += 1;
      console.log(
        `Scoreboard: ${_scoreBoard.playerSign1} , ${_scoreBoard.playerSign2}`
      );
    }
  };
  return { setPlayers, addPoint };
})();
*/
