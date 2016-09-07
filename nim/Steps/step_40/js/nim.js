var showWinner

;(function() {
  var active
  var winner
  var useAI
  var computerToPlay
  var rowsWithMatches
  var matchesInRows
  var taken
  var rowIndex = -1
  var rows = document.querySelectorAll(".matches")
  var winnerDiv = document.querySelector("#winner")
  var losers = ["1357", "1247", "1256", "1346", "1155", "1144", "1133", "1122", "0257", "0347", "0356", "0246", "0145", "0123", "0111", "0055", "0044", "0033", "0022", "0001"]

  // Code that runs when the page is first loaded
  ;(function initialize () {
    document.body.onclick = hideMatch
    document.querySelector(".start").onclick = startNewGame
    initializeTurns()

    startNewGame({target: {className: "twoPlayers"}})
  })()

  function initializeTurns() {
    var turnButtons = document.querySelectorAll(".turns button")
    var button

    for (var ii=0; ii<turnButtons.length; ii++) {
      button = turnButtons[ii]
      button.onclick = nextTurn
    }
  }

  // Code to start a new game
  function startNewGame(event) {
    var buttonName = event.target.className

    if (buttonName === "twoPlayers") {
      useAI = false
      player1 = "Player 1"
      player2 = "Player 2"

    } else {
      useAI = true
      if (buttonName === "computerStarts") {
        computerToPlay = true
        player1 = "Computer"
        player2 = "You"

      } else {
        computerToPlay = false
        player1 = "You"
        player2 = "Computer"
      }

      setUpAI()
    } 

    setPlayerNames()
    reset()

    if (useAI && computerToPlay) {
      computerChooseMove()
    }
  }

  function setUpAI() {   
    rowsWithMatches = [0, 1, 2, 3]
    matchesInRows = [7, 5, 3, 1]
  }

  function setPlayerNames() {
    var players = document.querySelectorAll(".turns div")
    var match, player, nameField

    for (var ii=0; ii<players.length; ii++) {
      player = players[ii]
      nameField = player.querySelector("p")

      if (ii === 0) {       
        active = player
        active.classList.add("active")
        active.classList.remove("enabled")
        nameField.textContent = player1

      } else {
        player.classList.remove("active")
        nameField.textContent = player2
      }
    }
  }

  function reset() {
    var matches = document.querySelectorAll(".matches img.removed")

    for (var ii=0; ii<matches.length; ii++) {
      var match = matches[ii]
      match.classList.remove("removed")
    }

    winnerDiv.classList.add("hidden")

    rowIndex = -1
    taken = 0
  }

  // Code that runs each time a match is removed
  function hideMatch(event) {
    var match = event.target
    
    if (match.nodeName !== "IMG") {
      return
    } else if (match.className === "removed") {
      return
    } else if (rowsDontMatch(match)) {
      return
    }
    
    match.classList.add("removed")
    active.classList.add("enabled")

    taken++

    checkForWinner()
  }

  function rowsDontMatch(match) {
    var currentRowIndex = getCurrentRowIndex(match)

    if (rowIndex < 0) {
      rowIndex = currentRowIndex
    } else if (rowIndex !== currentRowIndex) {
      return true
    }

    return false
  }

  function getCurrentRowIndex(match) {   
    var parentElement = match.parentElement
    var row

    for (var index=0; index<rows.length; index++) {
      row = rows[index]
      if (row === parentElement) {
        return index
      }
    }
  }

  function checkForWinner() {
    var selector = ".matches img.removed"
    var removed = document.querySelectorAll(selector).length

    if (removed === 16) {
      if (winner === "You") {
        showWinner(winner+" win!")
      } else {
        showWinner(winner+" wins!")
      }
      return true
    }

    return false
  }

  showWinner = function showWinner(winner) {
    var p = winnerDiv.querySelector("p")
    p.textContent = winner
    winnerDiv.classList.remove("hidden")
  }

  // Code that runs when the Done button is clicked
  function nextTurn() {
    if (!active.classList.contains("enabled")) {
      return
    }

    winner = active.querySelector("p").textContent

    var next = document.querySelector(".turns div:not(.active)")
    active.classList.remove("active")
    active.classList.remove("enabled")

    active = next
    active.classList.add("active")

    if (useAI) {
      takeFromRow(rowIndex, taken);
      taken = 0;  

      computerToPlay = !computerToPlay;
      if (computerToPlay) {
        computerChooseMove();
      }
    }

    rowIndex = -1
  }

  function takeFromRow(row, taken) {
    var remaining = matchesInRows[row] - taken;
    var index;
    
    matchesInRows[rowIndex] = remaining
    if (!remaining) {
      index = rowsWithMatches.indexOf(rowIndex)
      rowsWithMatches.splice(index, 1)
    }
  }

  // Code for the computer player
  function computerChooseMove() {
    var string = convertToString(matchesInRows);

    if (losers.indexOf(string) < 0) {
      findWinningMove()
    } else {
      chooseRandomMove()
    }

    hideMatches()
    gameOver = checkForWinner()

    if (!gameOver) {
      active.classList.add("enabled")
      nextTurn()
    }
  }

  function convertToString(array) {
    var string;

    array = array.slice(0) // use clone of array
    array.sort(); // [7, 5, 0, 1] => [0, 1, 5, 7]
    string = array.join(""); // "0157"

    return string;
  }

  function findWinningMove() {
    // More code will go here
  }

  function chooseRandomMove() {
    var index, max
    index = Math.floor(Math.random() * rowsWithMatches.length)
    rowIndex = rowsWithMatches[index]
    max = matchesInRows[rowIndex]
    taken = Math.ceil(Math.random() * max); // 1 - max
  }

  function hideMatches() {
    var matches = rows[rowIndex].children; // [img, img, ...]
    var removed = 0
    var match; // img

    for (var ii=0; ii<matches.length; ii++) {
      match = matches[ii]
      if (!match.classList.contains("removed")) {
        match.classList.add("removed")
        removed ++

        if (removed === taken) {
          return
        }
      }
    }
  }
})()