const gameConsoleChoice = document.querySelectorAll(".game-console-choice");
const results = document.querySelectorAll(".result");
const gameBtns = document.querySelectorAll(".game-choice-btn");
const actions = document.querySelectorAll(".action");
const pcName = document.querySelector(".pc-name");
const pcCharacter = document.querySelector(".pc-character");
const matchResult = document.querySelector(".match-result");
const totalSpan = document.querySelector(".total-score");
const matchScorePlayer = document.querySelectorAll(".match-score-player");
const matchScorePc = document.querySelectorAll(".match-score-pc");

let totalScore = 0;
let playerScore = 0;
let pcScore = 0;
let choicesArr = [];
let playerScoresArr = [];
let pcScoresArr = [];
let turnCounter = 0;
let isSecondPlayerMove = true;
let pcDecision;

// characters collection
const characters = [
  {
    name: "detective",
    strategy: () => {
      switch (turnCounter) {
        case 1:
          pcDecision = 0;
          break;
        case 2:
          pcDecision = 1;
          break;
        case 3:
          pcDecision = 0;
          break;
        case 4:
          pcDecision = 0;
          break;
        default:
          // new array without newest decision
          let choicesArrChanged = [];

          if (isSecondPlayerMove) {
            choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 0);
          } else {
            choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 1);
          }
          choicesArrChanged.pop();

          // if new array includes "1" => "cheat" - always cheat
          if (choicesArrChanged.includes(1)) {
            pcDecision = choicesArr[turnCounter - 2];
          } else {
            pcDecision = 1;
          }
      }
      return pcDecision;
    },
    image: "./img/detective.png",
  },
  {
    name: "cheater",
    strategy: () => {
      pcDecision = 1;
      return pcDecision;
    },
    image: "./img/cheater.png",
  },
  {
    name: "copycat",
    strategy: () => {
      if (turnCounter === 1) {
        pcDecision = 0;
      } else {
        let choicesArrChanged = [];

        if (isSecondPlayerMove) {
          choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 0);
        } else {
          choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 1);
        }
        pcDecision = choicesArrChanged[turnCounter - 2];
      }
      return pcDecision;
    },
    image: "./img/player.png",
  },
  {
    name: "cooperator",
    strategy: () => {
      pcDecision = 0;
      return pcDecision;
    },
    image: "./img/cooperator.png",
  },
  {
    name: "grudger",
    strategy: () => {
      if (turnCounter === 1) {
        pcDecision = 0;
      } else {
        // new array without newest decision
        let choicesArrChanged = [];

        if (isSecondPlayerMove) {
          choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 0);
        } else {
          choicesArrChanged = choicesArr.filter((e, i) => i % 2 === 1);
        }
        choicesArrChanged.pop();
        // if new array includes "1" => "cheat" - always cheat
        if (choicesArrChanged.includes(1)) {
          pcDecision = 1;
        } else {
          pcDecision = 0;
        }
      }

      return pcDecision;
    },
    image: "./img/grudger.png",
  },
];

// make characters changable
let pcTypeIterator = 0;
let pcType = characters[pcTypeIterator].name;

// game script----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// helper functions-------------------------------------------------

// points logic
const pointsLogic = () => {
  let playerTurnScore = 0;
  let pcTurnScore = 0;

  if (playerDecision === 0) {
    if (pcDecision === 0) {
      playerTurnScore += 2;
      pcTurnScore += 2;

      gameConsoleChoice[0].classList.add("active");
      setTimeout(() => {
        gameConsoleChoice[0].classList.remove("active");
      }, 2000);
    } else {
      playerTurnScore -= 1;
      pcTurnScore += 3;

      gameConsoleChoice[2].classList.add("active");
      setTimeout(() => {
        gameConsoleChoice[2].classList.remove("active");
      }, 2000);
    }
  }
  if (playerDecision === 1) {
    if (pcDecision === 0) {
      playerTurnScore += 3;
      pcTurnScore -= 1;

      gameConsoleChoice[1].classList.add("active");
      setTimeout(() => {
        gameConsoleChoice[1].classList.remove("active");
      }, 2000);
    } else {
      gameConsoleChoice[3].classList.add("active");
      setTimeout(() => {
        gameConsoleChoice[3].classList.remove("active");
      }, 2000);
    }
  }

  // update the result prompt
  results[0].innerHTML = parseInt(results[0].innerHTML) + playerTurnScore;
  results[1].innerHTML = parseInt(results[1].innerHTML) + pcTurnScore;
};
// disable the game buttons
const btnDisable = () => {
  // disable and enable the buttons
  gameBtns.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });
  gameBtns.forEach((btn) => {
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("disabled");
    }, 2000);
  });
};
// show actions
const showActions = () => {
  // show the actions to the user
  switch (pcDecision) {
    case 0:
      actions[1].innerText = "COOPERATED!";
      break;
    case 1:
      actions[1].innerText = "CHEATED!";
      break;
  }

  switch (playerDecision) {
    case 0:
      actions[0].innerText = "COOPERATED!";
      break;
    case 1:
      actions[0].innerText = "CHEATED!";
      break;
  }

  actions.forEach((action) => {
    action.classList.add("active");
  });

  setTimeout(() => {
    actions.forEach((action) => {
      action.classList.remove("active");
    });
  }, 2000);
};
// finish match
const finishMatch = () => {
  
  // character exchange mechanisms
  const playerMatchScore = parseInt(results[0].innerHTML);
  const pcMatchScore = parseInt(results[1].innerHTML);

  // show result
  if (playerMatchScore > pcMatchScore) {
    matchResult.innerText = "You won!";
  } else if (playerMatchScore === pcMatchScore) {
    matchResult.innerText = "Draw!";
  } else if (playerMatchScore < pcMatchScore) {
    matchResult.innerText = "You lost!";
  }

  // save the results
  playerScoresArr.push(parseInt(results[0].innerHTML));
  pcScoresArr.push(parseInt(results[1].innerHTML));
  totalScore += parseInt(results[0].innerHTML);

  // update the total score
  totalSpan.innerHTML = totalScore;
  matchScorePc[pcTypeIterator].innerHTML = pcScoresArr[pcTypeIterator];
  matchScorePlayer[pcTypeIterator].innerHTML = playerScoresArr[pcTypeIterator];

  // change pc character
  pcTypeIterator++;

  // if no pc type remain - slide
  if (pcTypeIterator > characters.length - 1) {
    const charactersSlide = document.getElementById("4");
    setTimeout(() => {
      charactersSlide.scrollIntoView();
    }, 2000);
    pcTypeIterator = 0;
    choicesArr = [];
    return;
  }

  // change pc type
  pcType = characters[pcTypeIterator].name;

  // disappear pc character
  pcCharacter.classList.add("disappear");

  // show result
  matchResult.classList.add("active");

  // classes removal
  setTimeout(() => {
    matchResult.classList.remove("active");
  }, 2500);
  setTimeout(() => {
    pcCharacter.src = characters[pcTypeIterator].image;
    pcCharacter.classList.remove("disappear");
    results[0].innerHTML = "0";
    results[1].innerHTML = "0";
  }, 1000);

  // reset all counters
  turnCounter = 0;
  choicesArr = [];
};

// pc decision making
const pcDecisionMaking = () => {
  switch (pcType) {
    case "copycat":
      characters[2].strategy();
      break;
    case "cheater":
      characters[1].strategy();
      break;
    case "cooperator":
      characters[3].strategy();
      break;
    case "grudger":
      characters[4].strategy();
      break;
    case "detective":
      characters[0].strategy();
      break;
  }
};

// game logic
for (let i = 0; i < gameBtns.length; i++) {
  gameBtns[i].addEventListener("click", () => {
    btnDisable();
    turnCounter++;

     // player decision
    playerDecision = i;
    choicesArr.push(i);

    // pc decision
    pcDecisionMaking();
    choicesArr.push(pcDecision);
    pointsLogic();
    showActions();
    if (turnCounter === 5) {
      finishMatch();
    }
  });
}
