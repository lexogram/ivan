"use strict";

var rows = document.querySelectorAll(".matches");
var total = document.querySelectorAll(".matches img").length;
var start = document.querySelectorAll(".start button")[0];
start.disabled = true;

for (var ii=0; ii<rows.length; ii++) {
  var row = rows[ii];

  row.onclick = hideMatch;
}

function hideMatch(event) {
  var match = event.target;
  match.classList.add("removed");

  var selector = ".matches img.removed";
  var removed = document.querySelectorAll(selector).length;
  if (removed === total) {
    window.alert("You lose.");
  }

  start.disabled = false;
}

function reset(event) {
  event = event || window.event

  var matches = document.querySelectorAll(".matches img.removed");
  var players = document.querySelectorAll(".turns div");
  var match, player


  for (var ii=0; ii<matches.length; ii++) {
    match = matches[ii];
    match.classList.remove("removed");
  }

  for (var ii=0; ii<players.length; ii++) {
    player = players[ii];
    if (ii === 0) {
      player.classList.add("active");
    } else {
      player.classList.remove("active");
    }
  }

  start.disabled = true;
}

function initializeButtons() {
  var buttons = document.querySelectorAll(".turns button");
  var button

  for (var ii=0; ii<buttons.length; ii++) {
    button = buttons[ii];
    button.onclick = nextTurn;
  }
}

function nextTurn(event) {
    var active = document.querySelector(".turns div.active");
    var next = document.querySelector(".turns div:not(.active)");

    active.classList.remove("active");
    next.classList.add("active");
}

initializeButtons();