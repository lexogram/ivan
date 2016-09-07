;(function() {
  var active
  var winner
  var rowIndex = -1
  var rows = document.querySelectorAll(".matches")

  document.body.onclick = hideMatch

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

  function showWinner(winner) {
    alert (winner)
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

  function reset() {
    var matches = document.querySelectorAll(".matches img.removed")

    for (var ii=0; ii<matches.length; ii++) {
      var match = matches[ii]
      match.classList.remove("removed")
    }
  }

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

  ;(function initializeTurns() {
    var turnButtons = document.querySelectorAll(".turns button")
    var button

    for (var ii=0; ii<turnButtons.length; ii++) {
      button = turnButtons[ii]
      button.onclick = nextTurn

      if (ii === 0) {
        active = button.parentElement
        active.classList.add("active")
      }
    }
  })()
})()