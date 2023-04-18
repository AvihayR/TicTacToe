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
        scoreBoard.addPoint(_currentPlayer);
        console.log(physicalBoard, checkForWinner());
      }
    }
  };

  const pickRandomPlayer = () => {
    if (GameBoard.showCurrentPlayer() == undefined) {
      let players = [playerOne, playerTwo];
      let randomPlayer = players[Math.floor(Math.random() * 2)];
      return (_currentPlayer = randomPlayer.show().sign);
    }
  };

  const changeCurrentPlayer = (players) => {
    //_currentPlayer = players.filter((player) => player !== _currentPlayer);
    let nextPlayer = players.filter((player) => player !== _currentPlayer);
    _currentPlayer = nextPlayer.toString();
  };

  return {
    play,
    checkForWinner,
    showCurrentPlayer,
    pickRandomPlayer,
    changeCurrentPlayer,
  };
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
    return { name: _playerName, sign: _playerSign };
  };
  return { play, show };
};

//run example:
//const myPlayer = Player('x');
//myPlayer.play(0)

const scoreBoard = (() => {
  let players = {};
  let players1;

  const registerPlayers = (sign1, sign2) => {
    players[sign1] = { score: 0 };
    players[sign2] = { score: 0 };
    console.log(players);
  };

  const registerPlayers1 = (obj1, obj2) => {
    players1 = [obj1, obj2];
  };

  const addPoint = (name) => {
    players[name].score += 1;
    return players;
  };

  const showScore = () => {
    let playerNames = Object.keys(players);
    const score = playerNames.map((name) => players[name].score);
    //let currentScore = [playerNames[0], score[0], playerNames[1], score[1]];
    return score;
  };

  const showPlayers = () => {
    return players1;
  };

  const findCurrent = () => {
    return players1.filter(
      (player) => player.show().sign != GameBoard.showCurrentPlayer()
    );
  };

  return {
    registerPlayers,
    registerPlayers1,
    addPoint,
    showScore,
    showPlayers,
    findCurrent,
  };
})();

//Query selectors:
const playersForm = document.querySelector('.players');
const playBtn = document.querySelector('.play-btn');
const playerOneName = document.getElementById('player-1-name');
const playerTwoName = document.getElementById('player-2-name');
const playerOneSign = document.getElementById('player-1-sign');
const playerTwoSign = document.getElementById('player-2-sign');
const modal = document.querySelector('.modal');
const scoreBoardContainerDOM = document.querySelector('.scoreboard-container');
let allCards = document.querySelectorAll('.card');

//DOM:
let playerOne;
let playerTwo;

//Start the game at the 'Play' Button:
playBtn.addEventListener('click', () => {
  playerOne = Player(playerOneName.value, playerOneSign.textContent);
  playerTwo = Player(playerTwoName.value, playerTwoSign.textContent);
  console.log(playerOne, playerTwo);

  //register created players at Score board:
  scoreBoard.registerPlayers(playerOne.show().sign, playerTwo.show().sign);
  scoreBoard.registerPlayers1(playerOne, playerTwo);

  //choose a random starting player:
  GameBoard.pickRandomPlayer();

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

  firstPlayerName.textContent = playerOneName.value;
  secondPlayerName.textContent = playerTwoName.value;
  firstPlayerScore.textContent = scoreBoard.showScore()[0];
  secondPlayerScore.textContent = scoreBoard.showScore()[1];

  firstCard.appendChild(firstPlayerName);
  firstCard.appendChild(firstPlayerScore);
  secondCard.appendChild(secondPlayerName);
  secondCard.appendChild(secondPlayerScore);
  scoreBoardContainerDOM.appendChild(firstCard);
  scoreBoardContainerDOM.appendChild(secondCard);
});

//listen to all cards, on click play nextPlayer in the right spot in the gameBoard + Render to screen.
allCards = Array.from(allCards).map((card) => {
  card.addEventListener('click', () => {
    //identify target card location in DOM:
    let target = event.target;
    let credentials = [target.dataset.row, target.dataset.col];

    //play in logical game & add sign (X/O) to card text context:
    scoreBoard.findCurrent()[0].play(credentials[0], credentials[1]);
    card.textContent = GameBoard.showCurrentPlayer();
  });
  GameBoard.changeCurrentPlayer(['O', 'X']);
});
