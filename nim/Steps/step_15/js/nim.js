"use strict";

;(function ready() {

  var rows = document.querySelectorAll(".matches");
  var total = document.querySelectorAll(".matches img").length;
  var turns = document.querySelectorAll(".turns button");
  var start = document.querySelectorAll(".start button")[0];
  var players = document.querySelectorAll(".turns div");
  var winOverlay = document.querySelectorAll(".winner.overlay")[0];
  var winField = document.querySelectorAll(".winner p")[0];
  var row, winner


  function initialize() {
    var button, turn

    for (var ii=0; ii<rows.length; ii++) {
      var row = rows[ii];
      row.onclick = hideMatch;
    }

    for (var ii=0; ii<turns.length; ii++) {
      turn = turns[ii];
      turn.onclick = nextTurn;
    }

    start.onclick = reset;
    reset();
  }

  function hideMatch(event) {
    var match = event.target;
    var matchRow = getRow(match);

    if (match.className === "removed") {
      return;
    }

    if (row > -1) {
      // Check that the player clicked on the same row
      if (row !== matchRow) {
        return;
      }
    }

    row = matchRow;
    match.classList.add("removed");

    var selector = ".matches img.removed";
    var removed = document.querySelectorAll(selector).length;
    if (removed === total) {
      showWinner();
    }

    start.disabled = false;
    toggleNextTurn(true)
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

  function toggleNextTurn(enabled) {
    var turn;

    for (var ii=0; ii<turns.length; ii++) {
      turn = turns[ii];
      turn.disabled = !enabled
    }

  }

  function nextTurn(event) {
    var active = document.querySelector(".turns div.active");
    var next = document.querySelector(".turns div:not(.active)");

    active.classList.remove("active");
    next.classList.add("active");

    row = -1;
    winner = active.getElementsByTagName("p")[0].innerHTML
    toggleNextTurn(false);
  }

  function showWinner() {
    //alert (winner+" wins!")
    winField.innerHTML = winner+" wins!";
    winOverlay.classList.remove("hidden")
  }
 
  function reset() {
    var matches = document.querySelectorAll(".matches img.removed");
    var match, player

    for (var ii=0; ii<matches.length; ii++) {
      match = matches[ii];
      match.classList.remove("removed");
    }

    for (var ii=0; ii<players.length; ii++) {
      player = players[ii];
      if (ii === 0) {
        player.classList.remove("active");
      } else {
        player.classList.add("active");
      }
    }

    winOverlay.classList.add("hidden")

    start.disabled = true;
    nextTurn();
  }

  initialize();
})()