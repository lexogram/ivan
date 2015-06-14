"use strict";

var rows = document.querySelectorAll(".matches");
var total = document.querySelectorAll(".matches img").length;
//console.log(matches);

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
}

function reset() {
  var matches = document.querySelectorAll(".matches img.removed");

  for (var ii=0; ii<matches.length; ii++) {
    var match = matches[ii];
    match.classList.remove("removed");
  }
}