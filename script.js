//GameBoard module
const GameBoard = (() => {
  //initiate a 3X3 gameBoard:
  let physicalBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  let winPattern = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  let playersContainer = [];
  let _currentPlayer;

  const registerPlayer = (player) => {
    playersContainer.push(player);
  };

  const showAllPlayers = () => {
    return playersContainer;
  };

  const showCurrentPlayer = () => {
    let player = _currentPlayer;
    return player;
  };

  const checkForWinner = () => {
    let currentPlayer = _currentPlayer.show().sign;
    //check rows & cols:
    for (let i = 0; i < 3; i++) {
      if (physicalBoard[i].every((square) => square === currentPlayer)) {
        winPattern[i] = winPattern[i].map((square) => (square = currentPlayer));

        return true;
      } else if (physicalBoard.every((row) => row[i] === currentPlayer)) {
        winPattern.every((row) => (row[i] = currentPlayer));

        return true;
      }
    }

    //Check Diagonals:

    if (
      physicalBoard[0][0] == currentPlayer &&
      physicalBoard[1][1] == currentPlayer &&
      physicalBoard[2][2] == currentPlayer
    ) {
      winPattern[0][0] = currentPlayer;
      winPattern[1][1] = currentPlayer;
      winPattern[2][2] = currentPlayer;

      return true;
    } else if (
      physicalBoard[0][2] == currentPlayer &&
      physicalBoard[1][1] == currentPlayer &&
      physicalBoard[2][0] == currentPlayer
    ) {
      winPattern[0][2] = currentPlayer;
      winPattern[1][1] = currentPlayer;
      winPattern[2][0] = currentPlayer;

      return true;
    }
    return false;
  };

  const renderWinPattern = () => {
    let cards = Array.from(document.querySelectorAll('.card'));
    cards = cards.filter(
      (card) =>
        winPattern[card.dataset.row][card.dataset.col] ==
        GameBoard.showCurrentPlayer().show().sign
    );
    console.log(winPattern);
    return cards.map((card) => card.classList.add('won'));
  };

  const _endRound = () => {
    //Make changes in logical 2D Array:
    physicalBoard = physicalBoard.map((arr) => arr.map((i) => (i = '')));
    //Make visible changes in UI:
    Array.from(allCards).map((c) => c.classList.remove('played', 'won'));
    Array.from(allCards).map((c) => (c.textContent = ''));
    //reset the winPattern:
    winPattern = winPattern.map((arr) => arr.map((i) => (i = '')));
  };

  //Add player sign to the chosen location:
  const play = (row, col) => {
    //_currentPlayer = this;
    if (physicalBoard[row][col] == '') {
      physicalBoard[row][col] = _currentPlayer.show().sign;
      //End game if there's a winner:
      if (checkForWinner() === true) {
        scoreBoard.addPoint(GameBoard.showCurrentPlayer().show());
        GameBoard.renderWinPattern();
        Array.from(allCards).map((card) => card.classList.add('played'));
        setTimeout(() => {
          scoreBoard.nextRound();
        }, 750);
        roundModalHeader.textContent = `${
          GameBoard.showCurrentPlayer().show().name
        } Wins the round 🥳`;
      } else if (
        checkForWinner() === false &&
        Array.from(allCards).every((card) => card.classList.contains('played'))
      ) {
        scoreBoard.Tie();
        setTimeout(() => {
          scoreBoard.nextRound();
        }, 750);
        roundModalHeader.textContent = "It's a Tie 💀";
      }
    }
  };

  const pickRandomPlayer = () => {
    if (GameBoard.showCurrentPlayer() == undefined) {
      let randomPlayer =
        GameBoard.showAllPlayers()[Math.floor(Math.random() * 2)];
      return (_currentPlayer = randomPlayer);
    }
  };

  const nextTurn = () => {
    let allPlayers = GameBoard.showAllPlayers().map((p) => p);
    let nextPlayer = allPlayers.filter(
      (p) => p.show().sign !== GameBoard.showCurrentPlayer().show().sign
    );
    _currentPlayer = nextPlayer[0];
  };

  return {
    play,
    checkForWinner,
    showCurrentPlayer,
    pickRandomPlayer,
    nextTurn,
    registerPlayer,
    showAllPlayers,
    renderWinPattern,
    _endRound,
  };
})();

//factory function - Player:
const Player = (name, sign) => {
  const _playerSign = sign;
  const _playerName = name;
  //play method to choose a next spot to play in:
  const play = (row, col) => {
    GameBoard.play(row, col);
  };

  const show = () => {
    return { name: _playerName, sign: _playerSign };
  };
  return { play, show };
};

const scoreBoard = (() => {
  let players;

  const initScore = () => {
    players = GameBoard.showAllPlayers().map((p) => p.show());
    players.map((p) => {
      p.points = 0;
      document.querySelector(`.${p.sign}`).textContent = p.points;
    });
  };

  const addPoint = (chosenPlayer) => {
    players.forEach((p) => {
      if (chosenPlayer.sign == p.sign) {
        p.points += 1;
        //Render point to UI:
        let currentPlayerSign = GameBoard.showCurrentPlayer().show().sign;
        document.querySelector(`.${currentPlayerSign}`).textContent = p.points;
      }
    });
  };

  const Tie = () => {
    players.forEach((p) => {
      p.points += 1;
      const signs = GameBoard.showAllPlayers().map((p) => p.show().sign);
      signs.map(
        (s) => (document.querySelector(`.${s}`).textContent = p.points)
      );
    });
  };

  const renderBlinkingPlayer = () => {
    let currentPlayerSign = GameBoard.showCurrentPlayer().show().sign;
    let allPlayerCards = document.querySelectorAll('.sign');
    allPlayerCards = Array.from(allPlayerCards);
    allPlayerCards.map((sign) => {
      if (sign.classList.contains(currentPlayerSign)) {
        sign.parentElement.classList.add('blink_me');
      } else {
        sign.parentElement.classList.remove('blink_me');
      }
    });
  };

  const nextRound = () => {
    //if score is less than 2, render the modal, the win checker in gameBoard will render the winner or tie into it:
    if (players.every((player) => player.points <= 2)) {
      welcomeModal.classList.remove('hidden');
      roundModal.classList.remove('hidden');
      welcomeModalContent.classList.add('hidden');
      //Clean the board, give next player his turn, and show it to him:
      GameBoard._endRound();
      GameBoard.nextTurn();
      scoreBoard.renderBlinkingPlayer();
    } else if (players.filter((player) => player.points > 2)) {
      announceGrandWinner();
    }
  };

  const announceGrandWinner = () => {
    let grandWinners = players.filter((p) => p.points > 2);
    let grandWinnerName = grandWinners[0].name;
    if (grandWinners.length > 1) {
      endingPara.textContent = "It's a Draw.";
    } else if (grandWinners.length == 1) {
      endingPara.textContent = `${grandWinnerName} Wins the game! 🏆`;
    }
    welcomeModal.classList.remove('hidden');
    welcomeModalContent.classList.add('hidden');
    endingModal.classList.remove('hidden');
    roundModal.classList.add('hidden');
  };

  return {
    initScore,
    addPoint,
    Tie,
    renderBlinkingPlayer,
    nextRound,
    announceGrandWinner,
  };
})();

//Query selectors:
const playersForm = document.querySelector('.players');
const playBtn = document.querySelector('.play-btn');
const playerOneName = document.getElementById('player-1-name');
const playerTwoName = document.getElementById('player-2-name');
const playerOneSign = document.getElementById('player-1-sign');
const playerTwoSign = document.getElementById('player-2-sign');
const welcomeModal = document.querySelector('.welcome.modal');
const welcomeModalContent = document.getElementById('modal-1');
const scoreBoardContainerDOM = document.querySelector('.scoreboard-container');
let allCards = document.querySelectorAll('.card');
const roundModal = document.getElementById('modal-2');
const roundModalHeader = roundModal.querySelector('h2');
const roundBtn = roundModal.querySelector('.round-btn');
const endingModal = document.getElementById('modal-3');
const endingPara = endingModal.querySelector('.finale-p');
const resetBtn = endingModal.querySelector('.reset-btn');
//DOM:
let playerOne;
let playerTwo;

//Start the game at the 'Play' Button:
playBtn.addEventListener('click', () => {
  playerOne = Player(playerOneName.value, playerOneSign.textContent);
  playerTwo = Player(playerTwoName.value, playerTwoSign.textContent);
  GameBoard.registerPlayer(playerOne);
  GameBoard.registerPlayer(playerTwo);

  //choose a random starting player:
  GameBoard.pickRandomPlayer();

  //hide welcome-modal:
  welcomeModal.classList.add('hidden');

  //Create & render score board player names and signs:
  let firstCard = document.createElement('div');
  firstCard.classList.add('player-card');
  firstCard.classList.add('1');
  let firstPlayerName = document.createElement('h2');
  let firstPlayerScore = document.createElement('p');
  firstPlayerScore.classList.add(
    'sign',
    document.getElementById('player-1-sign').textContent
  );

  let secondCard = document.createElement('div');
  secondCard.classList.add('player-card');
  secondCard.classList.add('2');
  let secondPlayerName = document.createElement('h2');
  let secondPlayerScore = document.createElement('p');
  secondPlayerScore.classList.add(
    'sign',
    document.getElementById('player-2-sign').textContent
  );

  firstPlayerName.textContent = playerOneName.value;
  secondPlayerName.textContent = playerTwoName.value;

  firstCard.appendChild(firstPlayerName);
  firstCard.appendChild(firstPlayerScore);
  secondCard.appendChild(secondPlayerName);
  secondCard.appendChild(secondPlayerScore);
  scoreBoardContainerDOM.appendChild(firstCard);
  scoreBoardContainerDOM.appendChild(secondCard);
  scoreBoard.initScore();
  scoreBoard.renderBlinkingPlayer();
});

Array.from(allCards).map((card) => {
  card.addEventListener('mouseover', () => {
    if (card.classList.contains('played')) {
      return;
    }
    card.textContent = GameBoard.showCurrentPlayer().show().sign;
  });

  card.addEventListener('mouseout', () => {
    if (card.classList.contains('played')) {
      return;
    }
    card.textContent = '';
  });

  card.addEventListener('click', () => {
    if (card.classList.contains('played')) {
      return;
    }
    card.classList.add('played');
    //identify target card location in DOM:
    let target = event.target;
    let credentials = [target.dataset.row, target.dataset.col];

    //play in logical game & add sign (X/O) to card text context:

    card.textContent = GameBoard.showCurrentPlayer().show().sign;
    GameBoard.showCurrentPlayer().play(credentials[0], credentials[1]);
    if (GameBoard.checkForWinner() !== true) {
      GameBoard.nextTurn(GameBoard.showAllPlayers());
    }
    scoreBoard.renderBlinkingPlayer();
  });
});

//Round modal event listener:
roundBtn.addEventListener('click', () => {
  welcomeModal.classList.add('hidden');
});

//Ending modal event listener:
resetBtn.addEventListener('click', () => {
  location.reload();
});
