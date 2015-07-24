;(function ready() {
  "use strict";

  var rows = document.querySelectorAll(".matches");
  var total = document.querySelectorAll(".matches img").length;
  var turns = document.querySelectorAll(".turns button");
  var start = document.querySelectorAll(".start")[0];
  var players = document.querySelectorAll(".turns div");
  var winOverlay = document.querySelectorAll(".winner.overlay")[0];
  var winField = document.querySelectorAll(".winner p")[0];
  var taken, row, winner;
  var useAI, computerToPlay, player1, player2;
  var rowsWithMatches, matchesInRows;


  function initialize() {
    var button, turn;

    for (var ii=0; ii<rows.length; ii++) {
      var row = rows[ii];
      row.onclick = hideMatch;
    }

    for (var ii = 0; ii<turns.length; ii++) {
      turn = turns[ii];
      turn.onclick = nextTurn;
    }

    start.onclick = startNewGame;
    startNewGame();
  }

  function startNewGame(event) {
    event = event || {};
    var target = event.target || {};
    var className = target.className || "playerStarts";

    useAI = true;
    computerToPlay = true;
    player1 = "You";
    player2 = "Computer";

    switch (className) {
      case "computerStarts":
        computerToPlay = false;
        player1 = "Computer";
        player2 = "You";
      case "playerStarts":
        // Use default values
      break;

      default: // case "twoPlayers":
        useAI = false;
        player1 = "Player 1";
        player2 = "Player 2";
     break;
    
    }

    if (useAI) {
      setUpAI();
    }

    reset();
  }

  function setUpAI() {
    rowsWithMatches = [0, 1, 2, 3];
    matchesInRows = [7, 5, 3, 1];
  }
 
  function reset() {
    var matches = document.querySelectorAll(".matches img.removed");
    var match, player, nameField;

    for (var ii=0; ii<matches.length; ii++) {
      match = matches[ii];
      match.classList.remove("removed");
    }

    for (var ii=0; ii<players.length; ii++) {
      player = players[ii];
      nameField = player.getElementsByTagName("p")[0];
      
      if (ii === 0) {
        player.classList.remove("active");
        nameField.innerHTML = player1;
      } else {
        player.classList.add("active");
        nameField.innerHTML = player2;
      }
    }

    winOverlay.classList.add("hidden");

    taken = 0;
    nextTurn();
  }

  function nextTurn(event) {
    var active = document.querySelector(".turns div.active");
    var next = document.querySelector(".turns div:not(.active)");
    var selector = ".matches img.removed";
    var removed = document.querySelectorAll(selector).length;

    if (removed === total) {
      return showWinner();
    }

    active.classList.remove("active");
    next.classList.add("active");

    takeFromRow(row, taken);

    taken = 0;
    winner = active.getElementsByTagName("p")[0].innerHTML;
    toggleNextTurn(false);

    if (useAI) {
      computerToPlay = !computerToPlay;
      if (computerToPlay) {
        computerChooseMove();
      }
    }
  }

  function showWinner() {
    if (winner === "You") {
      winField.innerHTML = "You win!"
    } else {
      winField.innerHTML = winner+" wins!";
    }
    winOverlay.classList.remove("hidden");
  }

  function takeFromRow(row, taken) {
    if (!taken) {
      return;
    }

    var remaining = matchesInRows[row] - taken;
    var index;

    matchesInRows[row] = remaining;
    if (!remaining) {
      index = rowsWithMatches.indexOf(row);
      rowsWithMatches.splice(index, 1);
    }
  }

  function toggleNextTurn(enabled) {
    var turn;

    for (var ii=0; ii<turns.length; ii++) {
      turn = turns[ii];
      turn.disabled = !enabled;
    }
  }

  function computerChooseMove() {
    if (false) {
      findWinningMove();
    } else {
      chooseRandomMove();
    }

    hideMatches(row, taken);
    nextTurn();
  }

  function findWinningMove() {

  }

  function chooseRandomMove() {
    var index, max;
    index = Math.floor(Math.random() * rowsWithMatches.length);
    row = rowsWithMatches[index];
    max = matchesInRows[row];
    taken = Math.ceil(Math.random() * max); // 1 - max
  }

  function hideMatches() {
    var matches = rows[row].children; // [img, img, ...]
    var removed = 0;
    var match; // img

    for (var ii=0; ii<matches.length; ii++) {
      match = matches[ii];
      if (match.className !== "removed") {
        match.className = "removed";
        removed ++;

        if (removed === taken) {
          return;
        }
      }
    }
  }

  function hideMatch(event) {
    var match = event.target;
    var matchRow = getRow(match);

    if (match.className === "removed") {
      return;
    }

    if (taken) {
      // Check that the player clicked on the same row
      if (row !== matchRow) {
        return;
      }
    } else {
      row = matchRow;
    }
   
    taken ++;
    match.classList.add("removed");

    toggleNextTurn(true);
  }

  function getRow(match) {
    var parentElement = match.parentElement;
    var row;

    for (var ii=0; ii<rows.length; ii++) {
      row = rows[ii];
      if (row === parentElement) {
        return ii;
      }
    }
  }

  initialize();
})();