//GameBoard module
const GameBoard = (() => {
  //initiate a 3X3 gameBoard:
  let physicalBoard = [];
  for (i = 0; i < 9; i++) {
    physicalBoard.push(null);
  }
  //method "play" - add player sign to physicalBoard array:
  const play = (player, num) => {
    physicalBoard.splice(num, 1, player);
    console.log(physicalBoard);
  };
  return { play };
})();

//run example:
//GameBoard.play('x',3);

//factory function - Player:
const Player = (sign) => {
  //Private variables playerSign and ChosenLocation:
  const _playerSign = sign;
  let _chosenLocation;
  //chooseLocation method to choose a next spot to play in:
  const chooseLocation = (location) => {
    _chosenLocation = location;
  };
  //play method that uses dynamic private vars to use gameBoard.play method:
  const play = () => {
    GameBoard.play(_playerSign, _chosenLocation);
  };

  return { play, chooseLocation };
};

//run example:
//const myPlayer = Player('x');
