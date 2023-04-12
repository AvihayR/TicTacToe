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

  const _endGame = () => {
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
        //_endGame();
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

//

/* -- Under construction: --
const gameFlow = (() => {
  //set players on scoreBoard:
  const setPlayers = (playerSign1, playerSign2) => {
    _scoreBoard.playerSign1 = 0;
    _scoreBoard.playerSign2 = 0;
  };

  //score board obj - private variable
  let _scoreBoard = {};

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
