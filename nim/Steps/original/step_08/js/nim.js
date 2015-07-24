"use strict";

var rows = document.querySelectorAll(".matches");
//console.log(matches);

for (var ii=0; ii<rows.length; ii++) {
  var row = rows[ii];
  row.onclick = hideMatch;
}

function hideMatch(event) {
  var match = event.target;
  match.classList.add("removed");
}

function reset() {
  var matches = document.querySelectorAll(".matches img.removed");

  for (var ii=0; ii<matches.length; ii++) {
    var match = matches[ii];
    match.classList.remove("removed");
  }
}