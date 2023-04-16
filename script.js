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
const Player = (name, sign) => {
  const _playerSign = sign;
  const _playerName = name;
  //play method to choose a next spot to play in:
  const play = (row, col) => {
    GameBoard.play(_playerSign, row, col);
  };

  const show = () => {
    return [_playerName, _playerSign];
  };
  return { play, show };
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

  const showScore = () => {
    let playerNames = Object.keys(players);
    const score = playerNames.map((name) => players[name].score);
    let currentScore = [playerNames[0], score[0], playerNames[1], score[1]];
    return currentScore;
  };

  return { registerPlayers, addPoint, showScore };
})();

//Query selectors:
const playersForm = document.querySelector('.players');
const playBtn = document.querySelector('.play-btn');
//Get player names and signs from input fields at modal:
const playerOneName = document.getElementById('player-1-name');
const playerTwoName = document.getElementById('player-2-name');
const playerOneSign = document.getElementById('player-1-sign');
const playerTwoSign = document.getElementById('player-2-sign');
const modal = document.querySelector('.modal');
const scoreBoardContainerDOM = document.querySelector('.scoreboard-container');

//DOM:
let playerOne;
let playerTwo;

playBtn.addEventListener('click', () => {
  //create two player objects at "Play" button
  playerOne = Player(playerOneName.value, playerOneSign.textContent);
  playerTwo = Player(playerTwoName.value, playerTwoSign.textContent);
  console.log(playerOne, playerTwo);

  //register created players at Score board:
  scoreBoard.registerPlayers(playerOne.show(), playerTwo.show());

  //hide modal:
  modal.classList.add('hidden');

  //Create & render score board player names and signs:
  let firstCard = document.createElement('div');
  firstCard.classList.add('player-card');
  firstCard.classList.add('1');
  let firstPlayerName = document.createElement('h2');
  let firstPlayerScore = document.createElement('p');

  let secondCard = document.createElement('div');
  secondCard.classList.add('player-card');
  secondCard.classList.add('2');
  let secondPlayerName = document.createElement('h2');
  let secondPlayerScore = document.createElement('p');

  firstPlayerName.textContent = scoreBoard.showScore()[0];
  secondPlayerName.textContent = scoreBoard.showScore()[2];
  firstPlayerScore.textContent = scoreBoard.showScore()[1];
  secondPlayerScore.textContent = scoreBoard.showScore()[3];

  firstCard.appendChild(firstPlayerName);
  firstCard.appendChild(firstPlayerScore);
  secondCard.appendChild(secondPlayerName);
  secondCard.appendChild(secondPlayerScore);
  scoreBoardContainerDOM.appendChild(firstCard);
  scoreBoardContainerDOM.appendChild(secondCard);
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
