;(function() {
  var active

  document.body.onclick = hideMatch

  function hideMatch(event) {
    var match = event.target
    if (match.nodeName !== "IMG") {
      return
    } else if (match.className === "removed") {
      return
    }
    
    match.classList.add("removed")

    active.classList.add("enabled")
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

    var next = document.querySelector(".turns div:not(.active)")
    active.classList.remove("active")
    active.classList.remove("enabled")

    active = next
    active.classList.add("active")
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