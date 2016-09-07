document.body.onclick = function (event) {
  event.target.classList.add("removed")
}

function reset() {
  var matches = document.querySelectorAll(".matches img.removed")

  for (var ii=0; ii<matches.length; ii++) {
    var match = matches[ii]
    match.classList.remove("removed")
  }
}

function nextTurn() {
    var active = document.querySelector(".active")
    var next = document.querySelector(".turns div:not(.active)")

    active.classList.remove("active")
    next.classList.add("active")
}

function initializeTurns() {
  var turnButtons = document.querySelectorAll(".turns button")
  var button

  for (var ii=0; ii<turnButtons.length; ii++) {
    button = turnButtons[ii]
    button.onclick = nextTurn
  }
}

initializeTurns()