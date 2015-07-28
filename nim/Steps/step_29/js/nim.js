;(function() {
  var rows = document.querySelectorAll(".matches")
  var active

  ;(function initialize() {
    initializeRows()
    initializeTurns()
  })()

  function initializeRows() {
    var row

    for (var ii=0; ii<rows.length; ii++) {
      row = rows[ii]
      row.onclick = hideMatch
    }
  }

  function initializeTurns() {
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
  }

  function hideMatch(event) {
    var match = event.target
    match.classList.add("removed")

    active.classList.add("enabled")
  }

  function nextTurn() {
    if (!active.classList.contains("enabled")) {
      return
    }

    var next = document.querySelector(".turns div:not(.active)")
    active.classList.remove("active")
    active.classList.remove("enabled")

    active = next
  active.classList.add("active")
  }

  function reset() {
    var matches = document.querySelectorAll(".matches img.removed")

    for (var ii=0; ii<matches.length; ii++) {
      var match = matches[ii]
      match.classList.remove("removed")
    }
  }
})()