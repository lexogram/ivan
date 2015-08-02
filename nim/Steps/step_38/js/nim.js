var showWinner

;(function() {
  var active
  var winner
  var useAI
  var computerToPlay
  var rowsWithMatches
  var matchesInRows
  var rowIndex = -1
  var rows = document.querySelectorAll(".matches")
  var winnerDiv = document.querySelector("#winner")

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
  }

  function setUpAI() {
    matchesInRows = [7, 5, 3, 1]
    remainingMatches = 
      [[1,1,1,1,1,1,1]
      ,[  1,1,1,1,1  ]
      ,[    1,1,1    ]
      ,[      1      ]]  
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
    }
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

    rowIndex = -1
  }
})()